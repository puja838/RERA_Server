import json
import pymysql
from numpy import NaN, nan
import random as r

from verifictaion import *

imagePath = '/home/ubuntu/reraserver_demo/public/uploadedFiles/'

def createLog(message):
   try:
     file1 = open('/home/ubuntu/reraserver_demo/verification/logger.txt', 'a')
     s = message + '\n'
     file1.write(s)
     file1.close()
   except Exception as e:
     print(e)

def connect_db():
    return pymysql.connect(
        host="localhost", user = 'root', passwd = 'Secure@2020', database = 'rera_demo',
        autocommit = True, charset = 'utf8mb4',
        cursorclass = pymysql.cursors.DictCursor)

cursor = connect_db().cursor()

def updateFunction(row):
    try:
        if row['fromwhich'] == 1:
            sql = "UPDATE mst_entitytype_project_dtl SET issystemverified = 1 WHERE fieldid = %s AND entitytypeprojecthdrid = %s"
            data = (row['filefieldid'], row['particularmoduleid'])
            cursor.execute(sql, data)

            sqltemp = "UPDATE mst_entitytype_project_dtl_temp SET issystemverified = 1 WHERE fieldid = %s AND entitytypeprojecthdrid = %s"
            data = (row['filefieldid'], row['particularmoduleid'])
            cursor.execute(sqltemp, data)
        else:
            sql = "UPDATE mst_entity_profile_values_dtl SET issystemverified = 1 WHERE fieldid = %s AND userid = %s"
            data = (row['filefieldid'], row['particularmoduleid'])
            cursor.execute(sql, data)

            sqltemp = "UPDATE mst_entity_profile_dtl_temp SET issystemverified = 1 WHERE fieldid = %s AND userid = %s"
            data = (row['filefieldid'], row['particularmoduleid'])
            cursor.execute(sqltemp, data)
    except Exception as e:
        print(e)
    finally:
        return True

def updateIsProcessFlag(id):
    try:
       sql = "UPDATE verificationschedulefields SET isprocess = 1 WHERE id = %s"
       cursor.execute(sql, (id))
    except Exception as e:
        print(e)
    finally:
        return True


def executionStart():
    try:
        updateProcessFlag('1')
        sql_verificationschedulefields = "SELECT id, reraid, particularmoduleid, strfieldid, strfieldvalue, filefieldid, filefieldvalue, fromwhich FROM verificationschedulefields WHERE isprocess = 0"
        cursor.execute(sql_verificationschedulefields)
        result1 = cursor.fetchall()
        createLog("Total data >>> " + str(len(result1)))
        new_resultLst = []
        for item in result1:
            print(item)
            try:
                isVerified = 1
                if item['strfieldid'] != None and item['filefieldid'] != None:
                    isVerified = document_verification(imagePath +   item['filefieldvalue'],item['strfieldvalue'],1)
                    createLog("isVerified >>>>>>> " + str(isVerified))
                    if isVerified == 1:
                        resp1 = updateFunction(item)
                else:
                    keyWordList = []
                    sql11 = "SELECT keywords FROM vefificationfieldkeywords where fieldid = "+str(item['filefieldid'])+""
                    cursor.execute(sql11)
                    rows = cursor.fetchall()
                    if len(rows) > 0:
                        for row in rows:
                            keyWordList.append(row['keywords'])
                    isVerified = document_verification(imagePath +   item['filefieldvalue'],keyWordList,0)
                    createLog("isVerified >>>>>>> " + str(isVerified))
                    if isVerified == 1:
                        resp1 = updateFunction(item)
            except Exception as e:
                print(e)
            updateIsProcessFlag(item['id'])
        updateProcessFlag('0')
    except Exception as e:
        print(e)
        updateProcessFlag('0')


def updateProcessFlag(flag):
   file1 = open('/home/ubuntu/reraserver_demo/verification/processflag.txt', 'w')
   file1.write(flag)
   file1.close()

def isProcessing():
    file1 = open('/home/ubuntu/reraserver_demo/verification/processflag.txt', 'r')
    flag = file1.read()
    print(flag)
    if flag == '1':
       print('1111111111111')
       return True
    else:
      return False

print(isProcessing())
if isProcessing() == False:
   executionStart()
else:
   createLog('Processing')
