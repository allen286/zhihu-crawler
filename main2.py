# -*- coding: utf-8 -*-
# 获取question关注者的用户信息
import os
from zhihu_oauth import ZhihuClient
from getUser import getUser
import MySQLdb

TOKEN_FILE = 'token.pkl'

# login
client = ZhihuClient()

if os.path.isfile(TOKEN_FILE):
    client.load_token(TOKEN_FILE)
else:
    client.login_in_terminal()
    client.save_token(TOKEN_FILE)

question = client.question(42173009)

if __name__ == '__main__':
    conn = MySQLdb.connect(host='127.0.0.1', user='root', passwd='root', port=3306, charset='utf8')
    cur = conn.cursor()
    u_table = 'user_que_' + str(question.id)
    cre_utable = 'create table IF NOT EXISTS %s (uid VARCHAR (50) PRIMARY KEY ,name VARCHAR (20),gender VARCHAR (10),headline VARCHAR (400),description VARCHAR (1000),que_count INT ,ans_count INT ,art_count INT ,column_ INT ,column_fol_sum INT ,collection INT ,coll_ans_sum INT ,coll_fol_sum INT ,voteup INT ,thanks INT ,collected INT ,shared INT ,art_vote_sum INT ,following INT ,follower INT ,fol_column INT ,fol_topic INT ,fol_topic_name MEDIUMTEXT,fol_ques INT ,location VARCHAR (200),business VARCHAR (50),school VARCHAR (200),major VARCHAR (200),company VARCHAR (200),job VARCHAR (200), avatar VARCHAR (10),avatar_url VARCHAR (100),weibo VARCHAR (10),weibo_name VARCHAR (50),weibo_url VARCHAR (50), give_ans_vote INT, give_art_vote INT, que_title VARCHAR (200))' % u_table
    ins_utable = 'insert into ' + u_table + ' values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)'

    try:
        # cur.execute('set interactive_timeout=96*3600')
        # cur.execute('CREATE DATABASE IF NOT EXISTS zhihu DEFAULT CHARSET utf8 COLLATE utf8_unicode_ci')
        conn.select_db('zhihu')
        # cur.execute('DROP TABLE IF EXISTS %s' % u_table)
        cur.execute(cre_utable)
    except MySQLdb.Error as e:
        print(str(e))

    try:
        for follower in question.followers:
            if follower.id == '0':
                continue
            else:
                try:
                    u_data = getUser(follower)
                    u_data.append(question.title)
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
