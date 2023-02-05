
import cv2
import pytesseract
from pytesseract import Output
import pandas as pd
from datetime import datetime
from pdf2image import convert_from_path
import glob
import os

fileTempLocation = "/home/ubuntu/reraserver_demo/public/uploadedFiles/"

timeStamp = str(datetime.now().timestamp()).replace('.', '')


class adhar_card_verifictaion:
    def __init__(self):
        pass



    def text_extraction(self,img_path):

        #source = convert_from_path(img_path)
        #print('source-----------', source)
        #timeStamp = str(datetime.now().timestamp()).replace('.', '')


        if img_path.endswith('.pdf'):
            print('5555555555555555555555555555555')
            df = pd.DataFrame()
            source = convert_from_path(img_path)
            print('source-----------', source)
            timeStamp = str(datetime.now().timestamp()).replace('.', '')
            cnt = 1
            for i, image in enumerate(source):
                # print("--image", image)
                fname = fileTempLocation+"extracted_image" + str(timeStamp) +'_'+ str(i) + ".JPEG"
                image.save(fname, "JPEG")
                cnt=+1

            # print(cnt)

            for img_path in glob.glob(fileTempLocation+"*.JPEG"):

                img = cv2.imread(img_path)
                gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

                thresh = cv2.threshold(gray, 170, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]

                custom_config = r'-l eng --oem 1 --psm 6 '
                # custom_config = '--psm 11 --oem 3 -c tessedit_char_whitelist=0123456789m.'

                # print("333")
                d = pytesseract.image_to_data(thresh, config=custom_config, output_type=Output.DICT)
                df1 = pd.DataFrame(d)

                df = df.append(df1, ignore_index=True)

                os.remove(img_path)



            # print("no of images", cnt)

        else:
            print("1111111111111111111111111111111111")
            img = cv2.imread(img_path)
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            thresh = cv2.threshold(gray, 170, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
            custom_config = r'-l eng --oem 1 --psm 6 '

            d = pytesseract.image_to_data(thresh, config=custom_config, output_type=Output.DICT)
            df = pd.DataFrame(d)


            #df = imgToDF(self, img_path)


        df1 = df[(df.conf != '-1') & (df.text != ' ') & (df.text != '')]

        pd.set_option('display.max_rows', None)
        pd.set_option('display.max_columns', None)

        sorted_blocks = df1.groupby('block_num').first().sort_values('top').index.tolist()
        # print("sorted_blocks >>>>> ",sorted_blocks)
        text_array = []
        text = ''
        for block in sorted_blocks:
            curr = df1[df1['block_num'] == block]
            sel = curr[curr.text.str.len() > 3]
            # sel = curr
            char_w = (sel.width / sel.text.str.len()).mean()
            prev_par, prev_line, prev_left = 0, 0, 0

            # text = ''

            for ix, ln in curr.iterrows():
                # add new line when necessary
                if prev_par != ln['par_num']:
                    text += '\n\n'
                    prev_par = ln['par_num']
                    prev_line = ln['line_num']
                    prev_left = 0
                elif prev_line != ln['line_num']:
                    text += '\n\n'
                    prev_line = ln['line_num']
                    prev_left = 0

                added = 0  # num of spaces that should be added
                if ln['left'] / char_w > prev_left + 1:
                    added = int((ln['left']) / char_w) - prev_left
                    text += ' ' * added
                    # print("  text_inside_loop   >>>>>> ",text)
                text += ln['text'] + ' '
                prev_left += len(ln['text']) + added + 1


            text_array.append(text)
            text += '\n'
            # print(text)
            

        # print("text_array >> ",text_array)

        search_string = text_array[0].replace(" ","").replace("\n","")
        # print(search_string)

        punc = '''!()-[]{};:'"\,<>./?@#$%^&*_~|‘'''

        for ele in search_string:
            if ele in punc:
                search_string = search_string.replace(ele, "")
        search_string = search_string.replace(" ","")


        print(search_string)

        return search_string





# adhar = adhar_card_verifictaion()
# img_path = '/home/phloxblog/adhar_land_deed_verification/id_sample/adhar_sample_4.jpg'
# pre_img_path = ''
# input_string = 'T47889555'
# result = adhar.text_extraction(img_path,pre_img_path)
# print(result)


