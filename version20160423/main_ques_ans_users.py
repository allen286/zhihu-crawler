# 获取question下所有答案及回答者的用户信息
# -*- coding: utf-8 -*-

import os
import pymysql
from zhihu_oauth import ZhihuClient
from getAnswer import getAnswer
from getUser import getUser

# login
TOKEN_FILE = 'token.pkl'
client = ZhihuClient()
if os.path.isfile(TOKEN_FILE):
    client.load_token(TOKEN_FILE)
else:
    client.login_in_terminal()
    client.save_token(TOKEN_FILE)

# 创建问题对象，参数为问题id
question = client.question(67079761)

if __name__ == '__main__':
    connection = pymysql.connect(host='localhost',
                                 user='root',
                                 password='root',
                                 port=3306,
                                 db='zhihu_live',
                                 charset='utf8mb4')
    u_table = str(question.id) + '_user'
    a_table = str(question.id) + '_ans'
    cre_utable = 'create table IF NOT EXISTS %s (uid VARCHAR (50),name VARCHAR (20),gender VARCHAR (10),headline VARCHAR (400),description VARCHAR (1000),que_count INT ,ans_count INT ,art_count INT ,column_ INT ,column_fol_sum INT ,collection INT ,coll_ans_sum INT ,coll_fol_sum INT ,voteup INT ,thanks INT ,collected INT ,shared INT ,art_vote_sum INT ,following INT ,follower INT ,fol_column INT ,fol_topic INT ,fol_topic_name MEDIUMTEXT,fol_ques INT ,location VARCHAR (200),business VARCHAR (50),school VARCHAR (200),major VARCHAR (200),company VARCHAR (200),job VARCHAR (200), avatar VARCHAR (10),avatar_url VARCHAR (100),weibo VARCHAR (10),weibo_name VARCHAR (50),weibo_url VARCHAR (50), give_ans_vote INT, give_art_vote INT, ans_id INT ,que_title VARCHAR (200))' % u_table
    ins_utable = 'insert into ' + u_table + ' values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)'
    cre_atable = 'create TABLE IF NOT EXISTS %s (ans_ques VARCHAR (200),que_id INT ,ans_id INT ,ans_auth VARCHAR (20),ans_cont MEDIUMTEXT ,ans_vote INT ,ans_than INT ,ans_comm INT ,com_perm VARCHAR (20) ,cre_timestamp VARCHAR (30),upd_timestamp VARCHAR (30),cre_time VARCHAR (30),upd_time VARCHAR (30))' % a_table
    ins_atable = 'insert into ' + a_table + ' values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)'

    try:
        with connection.cursor() as cursor:
            # 建表
            cursor.execute(cre_utable)
            cursor.execute(cre_atable)

            # 获取问题下答案数据，以及每个答主用户数据，并插入到表中
            try:
                i = 0
                for answer in question.answers:
                    i += 1
                    try:
                        u_data = getUser(answer.author)
                        u_data.append(answer.id)
                        u_data.append(answer.question.title)
                    except Exception as e:
                        print(str(e), '循环内getUser方法获取数据时出错，忽略后继续循环')
                        continue

                    try:
                        a_data = getAnswer(answer)
                    except Exception as e:
                        print(str(e), '循环内getAnswer方法获取数据时出错，忽略后继续循环')
                        continue

                    try:
                        # 插入答案数据
                        cursor.execute(ins_atable, a_data)
                        connection.commit()
                        print('插入第{i}条答案数据'.format(i=i))
                    except Exception as e:
                        print(str(e), '插入答案数据出错')
                        continue

                    try:
                        # 插入用户数据
                        cursor.execute(ins_utable, u_data)
                        connection.commit()
                        print('插入第{i}条用户数据'.format(i=i))
                    except Exception as e:
                        print(str(e), '插入用户数据出错')
                        continue

            except Exception as e:
                print(str(e), '对question.answers进行for in循环时出错')

        # with connection.cursor() as cursor:
        #     # Read a single record
        #     sql = "SELECT `id`, `password` FROM `users` WHERE `email`=%s"
        #     cursor.execute(sql)
        #     result = cursor.fetchone()
        #     print(result)
    finally:
        connection.close()
