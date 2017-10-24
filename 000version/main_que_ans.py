# -*- coding: utf-8 -*-
import os
from zhihu_oauth import ZhihuClient
import MySQLdb
import time
import socket
import sys

TOKEN_FILE = 'token.pkl'


# login
client = ZhihuClient()

if os.path.isfile(TOKEN_FILE):
    client.load_token(TOKEN_FILE)
else:
    client.login_in_terminal()
    client.save_token(TOKEN_FILE)

#用count函数还是用len(list()),哪个好？
# def count(iter):
#     return sum(1 for _ in iter)

def time2str(timeStamp):
    timeArray = time.localtime(timeStamp)
    return time.strftime("%Y-%m-%d %H:%M:%S", timeArray)

def getUserData(people):
    data = []
    uid = people.id
    name = people.name
    gender = people.gender
    headline = people.headline
    description = people.description

    que_count = people.question_count
    ans_count = people.answer_count
    art_count = people.articles_count
    collection = people.collection_count
    column = people.column_count
    # coll_ans_sum和coll_fol_sum变量要用到循环，获取速度会慢
    # coll_ans_sum = 0
    coll_fol_sum = 0
    if people.collections:
        for col in people.collections:
            # coll_ans_sum += count(col.answers)  ##循环嵌套循环。。速度最慢
            coll_fol_sum += col.follower_count

    voteup = people.voteup_count
    thanks = people.thanked_count
    collected = people.collected_count
    shared = people.shared_count
    # art_vote_sum变量要用到循环，获取速度会慢
    art_vote_sum = 0
    if people.articles:
        for art in people.articles:
            art_vote_sum += art.voteup_count

    following = people.following_count
    follower = people.follower_count
    fol_column = people.following_column_count
    fol_topic = people.following_topic_count
    # fol_topic_title变量要用到循环，获取速度会慢
    topic_names = []
    fol_topic_name = ''
    if people.following_topics:
        for f_topic in people.following_topics:
            topic_names.append(f_topic.name)
        fol_topic_name = ','.join(topic_names)
    fol_ques = people.following_question_count
    # fol_coll = count(people.following_collections) if people.following_collections else 0    #每次获取到的都是37，是自己关注的收藏夹数

    locs = []
    # print("locations is", repr(people.locations))
    location = None
    if people.locations:
        for loc in people.locations:
            locs.append(loc.name)
            location = ','.join(locs)

    business = people.business.name if people.business else None

    edu_schools = []
    edu_majors = []
    school = ''
    major = ''
    if people.educations:
        for education in people.educations:
            if 'school' in education:
                edu_schools.append(education.school.name)
            if 'major' in education:
                edu_majors.append(education.major.name)
        school = ','.join(edu_schools) if edu_schools else None
        major = ','.join(edu_majors) if edu_majors else None

    emp_jobs = []
    emp_comps = []
    company = ''
    job = ''
    if people.employments:
        for employment in people.employments:
            if 'job' in employment:
                emp_jobs.append(employment.job.name)
            if 'company' in employment:
                emp_comps.append(employment.company.name)
        job = ','.join(emp_jobs) if emp_jobs else None
        company = ','.join(emp_comps) if emp_comps else None

    avatar = 0 if people.avatar_url == 'http://pic1.zhimg.com/da8e974dc_s.jpg' else 1
    avatar_url = people.avatar_url
    weibo = people.is_bind_sina
    weibo_name = people.sina_weibo_name
    weibo_url = people.sina_weibo_url
    # creat_at=people.created_at  #获取的值全部为None
    # fri_score=people.friendly_score   #获取的值全部为None

    data.append(uid)
    data.append(name)
    data.append(gender)  # 存储成了varchar格式，因为存储成int时出错了，未设置性别的是-1,匿名用户时会报错。后面avatar和weibo同理
    data.append(headline)
    data.append(description)

    data.append(que_count)
    data.append(ans_count)
    data.append(art_count)
    data.append(collection)
    data.append(column)
    # data.append(coll_ans_sum)    #慢慢慢
    data.append(coll_fol_sum)    #慢慢慢

    data.append(voteup)
    data.append(thanks)
    data.append(collected)
    data.append(shared)
    data.append(art_vote_sum)    #慢慢慢

    data.append(following)
    data.append(follower)
    data.append(fol_column)
    data.append(fol_topic)
    data.append(fol_topic_name)
    data.append(fol_ques)
    # data.append(fol_coll)

    data.append(location)
    data.append(business)
    data.append(school)
    data.append(major)
    data.append(company)
    data.append(job)

    data.append(avatar)
    data.append(avatar_url)
    data.append(weibo)
    data.append(weibo_name)
    data.append(weibo_url)

    # 共33个变量  34-2+1,删了fol_coll,coll_ans_sum,增加了fol_topic_name
    return data

def getAnswerData(answer):
    data=[]
    ans_ques = answer.question.title
    que_id = answer.question.id
    ans_id = answer.id
    ans_auth = answer.author.name
    ans_cont = answer.content

    ans_vote = answer.voteup_count
    ans_than = answer.thanks_count
    ans_comm = answer.comment_count

    com_perm = answer.comment_permission
    cre_timestamp = answer.created_time
    upd_timestamp = answer.updated_time
    cre_time = time2str(cre_timestamp)
    upd_time = time2str(upd_timestamp)

    data.append(ans_ques)
    data.append(que_id)
    data.append(ans_id)
    data.append(ans_auth)
    data.append(ans_cont)
    data.append(ans_vote)
    data.append(ans_than)
    data.append(ans_comm)
    data.append(com_perm)
    data.append(cre_timestamp)
    data.append(upd_timestamp)
    data.append(cre_time)
    data.append(upd_time)

    return data


question = client.question(42173009)  # 思念到极致是什么感觉？

if __name__ == '__main__':
    try:
        conn = MySQLdb.connect(host='127.0.0.1',user='root',passwd='root',port=3306, charset='utf8')
        cur = conn.cursor()
        cur.execute('set interactive_timeout=96*3600')
        # cur.execute('drop database if exists zhihu')
        # cur.execute('CREATE DATABASE IF NOT EXISTS zhihu DEFAULT CHARSET utf8 COLLATE utf8_unicode_ci')
        conn.select_db('new_zhihu')
    except MySQLdb.Error,e:
        print("Mysql Error %d: %s" % (e.args[0], e.args[1]))

    # 35列，33个变量，加上回答id和回答对应的问题名称
    user_table_sql = 'create table IF NOT EXISTS 42173009_user(uid varchar(50),name varchar(20),gender varchar(10),headline varchar(400),description varchar(1000),que_count int ,ans_count int ,art_count int ,collection int ,column_ int ,coll_fol_sum int ,voteup int ,thanks int ,collected int ,shared int ,art_vote_sum int ,following int ,follower int ,fol_column int ,fol_topic int ,fol_topic_name MEDIUMTEXT,fol_ques int ,location varchar(200),business varchar(50),school varchar(200),major varchar(200),company varchar(200),job varchar(200), avatar varchar(10),avatar_url varchar(100),weibo varchar(10),weibo_name varchar(50),weibo_url varchar(50),ans_id INT ,ans_ques VARCHAR (200))'
    ans_table_sql = 'create TABLE IF NOT EXISTS 42173009_ans(ans_ques VARCHAR (200),que_id INT ,ans_id INT ,ans_auth VARCHAR (20),ans_cont MEDIUMTEXT ,ans_vote INT ,ans_than INT ,ans_comm INT ,com_perm VARCHAR(20) ,cre_timestamp VARCHAR (30),upd_timestamp VARCHAR (30),cre_time VARCHAR (30),upd_time VARCHAR (30))'

    try:
        cur.execute(user_table_sql)
        cur.execute(ans_table_sql)
        # print("answers is", repr(answers))
        for answer in question.answers:
            ans_data = getAnswerData(answer)
            u_data = getUserData(answer.author)
            u_data.append(answer.id)
            u_data.append(answer.question.title)
            #35个%s
            cur.execute('insert into 42173009_user values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)', u_data)
            cur.execute('insert into 42173009_ans values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)', ans_data)
            conn.commit()
    except MySQLdb.Error, e:
        print(e)
    try:
        cur.close()
        conn.close()
    except MySQLdb.Error, e:
        print("Mysql Error %d: %s" % (e.args[0], e.args[1]))