# -*- coding: utf-8 -*-
# 获取live听众的用户信息
import os
from zhihu_oauth import ZhihuClient
from getUser import getUser
import pymysql

TOKEN_FILE = 'token.pkl'

# login
client = ZhihuClient()

if os.path.isfile(TOKEN_FILE):
    client.load_token(TOKEN_FILE)
else:
    client.login_in_terminal()
    client.save_token(TOKEN_FILE)

live = client.live(896780923079639040)

if __name__ == '__main__':
    connection = pymysql.connect(host='localhost',
                                 user='root',
                                 password='root',
                                 port=3306,
                                 db='zhihu_live',
                                 charset='utf8mb4')
    u_table = 'live_' + str(topic.name)
    cre_utable = 'create table IF NOT EXISTS %s (uid VARCHAR (50) PRIMARY KEY ,name VARCHAR (20),gender VARCHAR (10),headline VARCHAR (400),description VARCHAR (1000),que_count INT ,ans_count INT ,art_count INT ,column_ INT ,column_fol_sum INT ,collection INT ,coll_ans_sum INT ,coll_fol_sum INT ,voteup INT ,thanks INT ,collected INT ,shared INT ,art_vote_sum INT ,following INT ,follower INT ,fol_column INT ,fol_topic INT ,fol_topic_name MEDIUMTEXT,fol_ques INT ,location VARCHAR (200),business VARCHAR (50),school VARCHAR (200),major VARCHAR (200),company VARCHAR (200),job VARCHAR (200), avatar VARCHAR (10),avatar_url VARCHAR (100),weibo VARCHAR (10),weibo_name VARCHAR (50),weibo_url VARCHAR (50), give_ans_vote INT, give_art_vote INT, topic_name VARCHAR (200))' % u_table
    ins_utable = 'insert into ' + u_table + ' values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)'

try:
    with connection.cursor() as cursor:
        # 建表
        cursor.execute(cre_utable)

        # 获取live下每个参与者的用户数据
        try:
            for role, badge, people in live.participants:
                u_data = getUser(people)
                print(role, badge.name, people.name)
                # 票价类型：普通票，聊表心意，鼎力支持
        except Exception as e:
            print(str(e), '对live.participants进行循环时出错')

    try:
        for follower in topic.followers:
            try:
                u_data = getUser(follower)
                u_data.append(topic.title)
            except Exception as e:
                print(str(e), '循环内getUser方法获取数据时出错，忽略后继续循环')
                continue
            try:
                cur.execute(ins_utable, u_data)
                conn.commit()
            except MySQLdb.Error as e:
                print(str(e))
    except Exception as e:
        print(str(e), '利用for in循环获取数据的时候知乎返回了预期以外的数据（格式错误，或者直接没返回有效数据）')

    try:
        cur.close()
        conn.close()
    except MySQLdb.Error as e:
        print("Mysql Error %d: %s" % (e.args[0], e.args[1]))
