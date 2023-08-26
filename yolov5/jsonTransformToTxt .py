# 将标签文件中的关键信息转为txt格式并存储起来
import glob
import json
import requests
import os
import shutil
import tqdm

sets = ['train', 'val', 'test']
abs_path = os.getcwd()
print(abs_path)



def json_to_txt(file_dir, f_file_dir):
    """将一个json标签转为txt标签, 标签的修改在18行下"""
    file = open(file_dir, encoding="utf-8")
    name = file_dir.split("/")[-1][:-5]
    # print(img.shape)
    txt_file = open(f_file_dir + "/" + name + ".txt", "w")
    print(file)
    info = json.load(file)
    img_width = info["imageWidth"]
    img_height = info["imageHeight"]
    for position in info["shapes"]:
        # 根据需要修改标签名及对应的txt标签的数字类别
        if position["label"] == "crack":
            judge_num = "0"
        # elif position["label"] == "outside fin":
        #     judge_num = "1"
        # elif position["label"] == "damage":
        #     judge_num = "2"
        else:
            judge_num = "1"
        #
        # x1 = position["points"][0][0]/img_width
        # y1 = position["points"][0][1]/img_height
        # x2 = position["points"][1][0]/img_width
        # y2 = position["points"][1][1]/img_height
        # x3 = position["points"][2][0] / img_width
        # y3 = position["points"][2][1] / img_height
        # x4 = position["points"][3][0] / img_width
        # y4 = position["points"][3][1] / img_height

        # x_center = ((x1 + x2)/2)/img_width
        # y_center = ((y1 + y2)/2)/img_height
        # width = 50/img_width
        # height = 50/img_height
        # txt_file.write(f"{judge_num} {x1:.6f} {y1:.6f} {x2:.6f} {y2:.6f} {x3:.6f} {y3:.6f} {x4:.6f} {y4:.6f}\n")
        x1 = position["points"][0][0]
        y1 = position["points"][0][1]
        x2 = position["points"][1][0]
        y2 = position["points"][1][1]
        x_center = ((x1 + x2) / 2) / img_width
        y_center = ((y1 + y2) / 2) / img_height
        width = (abs(x1 - x2)) / img_width
        height = (abs(y1 - y2)) / img_height
        txt_file.write(f"{judge_num} {x_center:.6f} {y_center:.6f} {width:.6f} {height:.6f}\n")

    txt_file.close()
    file.close()

if __name__ == '__main__':
    # 原图片所在的文件夹
    sourceImageDir = r"D:/FlFile/yolov5-6.1/paper_data/images"
    # 原json标签所在文件
    labels_dir = r"D:/FlFile/yolov5-6.1/paper_data/Annotations"
    # txt标签的存储位置
    goal_dir = r"D:/FlFile/yolov5-6.1/paper_data/labels"
    # image存储的位置
    goal_image_dir = r"D:/FlFile/yolov5-6.1/paper_data/images"

for image_set in sets:
    if not os.path.exists(goal_image_dir):
        os.makedirs(goal_image_dir)
    if not os.path.exists(goal_dir):
        os.makedirs(goal_dir)
    file_dirs = glob.glob(labels_dir + "/*.json")
    image_ids = open('./paper_data/ImageSets/Main/%s.txt' % (image_set)).read().split('\n')
    list_file = open('paper_data/%s.txt' % (image_set), 'w')
    for image_id in image_ids:

        list_file.write(abs_path + '/paper_data/images/%s.jpg\n' % (image_id))
        file_dir = 'D:/FlFile/yolov5-6.1/paper_data/Annotations/' + image_id + '.json'
        json_to_txt(file_dir, goal_dir)

    # for file_dir in tqdm.tqdm(file_dirs):
    #     json_to_txt(file_dir, goal_dir)


