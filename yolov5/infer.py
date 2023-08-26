import base64
import math
import sys
from pathlib import Path
import cv2
import torch

FILE = Path(__file__).absolute()
sys.path.append(FILE.parents[0].as_posix())  # add yolov5/ to path
from models.experimental import attempt_load
from utils.general import non_max_suppression, scale_coords, xyxy2xywh
from utils.torch_utils import select_device
from utils.datasets import letterbox
import numpy as np
from requests_toolbelt import MultipartEncoder
import json
from flask import Flask, request
import requests


class Detector(object):
    def __init__(self, weight_path="weights/best.pt",
                 device="0",  # cuda device, i.e. 0 or 0,1,2,3 or cpu
                 conf_thres=0.25,  # confidence threshold
                 iou_thres=0.2,  # NMS IOU threshold
                 max_det=1000,  # maximum detections per image
                 input_size=(640, 640)  # resize of input image.
                 ):
        super(Detector, self).__init__()
        self.weight_path = weight_path
        assert self.weight_path
        self.conf_thres = conf_thres
        self.iou_thres = iou_thres
        self.max_det = max_det
        self.input_size = input_size
        # Load model
        self.device = select_device(device)
        self.model = attempt_load(self.weight_path, map_location=self.device)  # load FP32 model
        self.model.eval()

    def get_result(self, img):
        pointsList = []
        im0 = img
        img = letterbox(img, self.input_size, stride=32)[0]
        img = img[:, :, ::-1].transpose(2, 0, 1)
        img = torch.Tensor(img.copy())
        img /= 255.0  # 0 - 255 to 0.0 - 1.0
        if img.ndimension() == 3:
            img = img.unsqueeze(0)  # Inference
        img = img.float().to(self.device)
        pred = self.model(img, augment=False)[0]

        det = non_max_suppression(pred, self.conf_thres, self.iou_thres, None,
                                  False, max_det=self.max_det)[0]  # Apply NMS
        det[:, :4] = scale_coords(img.shape[2:], det[:, :4], im0.shape).round()

        if det.shape[0] > 0:
            det = det.to("cpu").numpy()
            for e in det:
                w = int(e[2] - e[0])
                h = int(e[3] - e[1])
                x_center = int(e[0] + w)
                y_center = int(e[1] + 1)
                x1 = int(e[2] + 1)
                y1 = int(e[3])
                x2 = int(e[0])
                y2 = int(e[1])
                pointsList.append([x1, y1])
                pointsList.append([x2, y2])
                pointsList.append([x_center, y_center])
        return pointsList


def base64_to_cv2(base64_code):
    missing_padding = 4 - len(base64_code) % 4
    if missing_padding:
        base64_code += '=' * missing_padding
    # base64解码
    img_data = base64.b64decode(base64_code)
    img_array = np.frombuffer(img_data, np.uint8)
    # 转成opencv可用格式
    img = cv2.imdecode(img_array, cv2.COLOR_RGB2BGR)
    return img


def cv2_to_base64(img):
    img = cv2.imencode('.jpg', img)[1]
    image_code = str(base64.b64encode(img))[2:-1]
    return image_code


def gradient(pt1, pt2):
    return (pt2[1] - pt1[1]) / (pt2[0] - pt1[0])


def getAngle(pointsList):
    pt1, pt2, pt3 = pointsList[-3:]
    m1 = gradient(pt1, pt2)
    m2 = gradient(pt1, pt3)
    angR = math.atan((m2 - m1) / (1 + (m2 * m1)))
    angD = math.degrees(angR)
    return angD


# 双线插值法
def bilinear(img, scale):
    AH, AW, channel = img.shape
    BH, BW = int(AH * scale), int(AW * scale)
    dst_img = np.zeros((BH, BW, channel), np.uint8)
    for k in range(channel):
        for dst_x in range(BW):
            for dsy_y in range(BH):
                # 找到目标图x、y在原图中对应的坐标
                AX = (dst_x + 0.5) / scale - 0.5
                AY = (dsy_y + 0.5) / scale - 0.5
                # 找到将用于计算插值的点的坐标
                x1 = int(np.floor(AX))  # 取下限整数
                y1 = int(np.floor(AY))
                x2 = min(x1 + 1, AW - 1)  # 返回最小值
                y2 = min(y1 + 1, AH - 1)
                # 计算插值
                R1 = (x2 - AX) * img[y1, x1, k] + (AX - x1) * img[y1, x2, k]
                R2 = (x2 - AX) * img[y2, x1, k] + (AX - x1) * img[y2, x2, k]
                dst_img[dsy_y, dst_x, k] = int((y2 - AY) * R1 + (AY - y1) * R2)
    return dst_img


def get_imghist(img):
    # 判断图像是否为三通道；
    if len(img.shape) == 3:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # 无 Mask，256个bins,取值范围为[0,255]
    hist = cv2.calcHist([img], [0], None, [256], [0, 255])
    return hist


def cal_equalhist(img):
    if len(img.shape) == 3:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    h, w = img.shape[:2]
    grathist = get_imghist(img)

    zerosumMoment = np.zeros([256], np.uint32)
    for p in range(256):
        if p == 0:
            zerosumMoment[p] = grathist[0]
        else:
            zerosumMoment[p] = zerosumMoment[p - 1] + grathist[p]
    output_q = np.zeros([256], np.uint8)
    cofficient = 256.0 / (h * w)
    for p in range(256):
        q = cofficient * float(zerosumMoment[p]) - 1
        if q >= 0:
            output_q[p] = math.floor(q)
        else:
            output_q[p] = 0
    equalhistimage = np.zeros(img.shape, np.uint8)
    for i in range(h):
        for j in range(w):
            equalhistimage[i][j] = output_q[img[i][j]]
    return equalhistimage


if __name__ == '__main__':
    model = Detector()
    app = Flask(__name__)


    @app.route('/getAngle', methods=['POST'])
    def test_post():
        data = request.get_data()
        # 解析请求参数
        json_data = json.loads(data.decode("utf-8"))
        # 图片网络路径
        img_path = json_data['filePath']
        # 获取图片数据
        r = requests.get(img_path)
        # 解码为cv2格式
        img = cv2.imdecode(np.frombuffer(r.content, np.uint8), cv2.IMREAD_COLOR)
        # 得到关键点列表
        pointlist = model.get_result(img)
        # 模型计算得到角度
        result = getAngle(pointlist)
        # 返回json
        image_code = cv2_to_base64(img)
        result_json = json.dumps({'leafAngle': result, 'base64': image_code})
        return result_json
        # 使用cv2进行线段绘制
        cv2.circle(img, (int(pointlist[0][0]), int(pointlist[0][1])),
                   5, (0, 0, 255), cv2.FILLED)
        cv2.circle(img, (int(pointlist[1][0]), int(pointlist[1][1])),
                   5, (0, 0, 255), cv2.FILLED)
        cv2.circle(img, (int(pointlist[2][0]), int(pointlist[2][1])),
                   5, (0, 0, 255), cv2.FILLED)
        cv2.line(img, (int(pointlist[0][0]), int(pointlist[0][1])),
                 (int(pointlist[1][0]), int(pointlist[1][1])), (0, 0, 255), 10)
        cv2.line(img, (int(pointlist[0][0]), int(pointlist[0][1])),
                 (int(pointlist[2][0]), int(pointlist[2][1])), (0, 0, 255), 10)
        cv2.putText(img, str(result), (pointlist[1][0] + 50, pointlist[1][1] + 20),
                    cv2.FONT_HERSHEY_PLAIN, 5, (251, 255, 255), 6)





    app.run(debug=True, host='0.0.0.0', port=3000)


def inv_align(M):
    k, b1, b2 = M[0, 0], M[0, 2], M[1, 2]
    return np.array([[1 / k, 0, -b1 / k],
                     [0, 1 / k, -b2 / k]])


def align(image, dst_size):
    # image -> [h,w,c]
    oh, ow = image.shape[:2]
    dh, dw = dst_size
    scale = min(dw / ow, dh / oh)
    # 仿射变换矩阵
    M = np.array([
        [scale, 0, -scale * ow * 0.5 + dw * 0.5],
        [0, scale, -scale * oh * 0.5 + dh * 0.5]
    ], dtype=np.float32)
    # warpAffine后的图片
    image_pre = cv2.warpAffine(image, M, dst_size,
                               flags=cv2.INTER_LINEAR,
                               borderMode=cv2.BORDER_CONSTANT,
                               borderValue=(114, 114, 114))
    return image_pre, M, inv_align(M)
