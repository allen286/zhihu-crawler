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

def time2str(timeStamp):
    timeArray = time.localtime(timeStamp)
    return time.strftime("%Y-%m-%d %H:%M:%S", timeArray)

def userData(people):
    data=[]
    uid=people.id
    name=people.name
    gender=people.gender
    headline=people.headline
    description=people.description

    que_count=people.question_count
    ans_count=people.answer_count
    art_count=people.articles_count
    collection=people.collection_count
    column=people.column_count

    voteup=people.voteup_count
    thanks=people.thanked_count
    collected=people.collected_count
    shared=people.shared_count

    following=people.following_count
    follower=people.follower_count
    fol_column=people.following_column_count
    fol_topic=people.following_topic_count

    weibo=people.is_bind_sina
    weibo_name=people.sina_weibo_name
    weibo_url=people.sina_weibo_url
    creat_at=people.created_at
    fri_score=people.friendly_score

    locs=[]
    # print("locations is", repr(people.locations))
    if people.locations:
        for loc in people.locations:
            locs.append(loc.name)
            location=','.join(locs)
    else:
        location=None

    if people.business:
        business=people.business.name
    else:
        business=None

    edu_schools = []
    edu_majors = []
    school=''
    major=''
    if people.educations:
        for education in people.educations:
            if 'school' in education:
                edu_schools.append(education.school.name)
            if 'major' in education:
                edu_majors.append(education.major.name)
        if edu_schools:
            school=','.join(edu_schools)
        else:
            school=None
        if edu_majors:
            major=','.join(edu_majors)
        else:
            major=None

    emp_jobs = []
    emp_comps = []
    job=''
    company=''
    if people.employments:
        for employment in people.employments:
            if 'job' in employment:
                emp_jobs.append(employment.job.name)
            if 'company' in employment:
                emp_comps.append(employment.company.name)
        if emp_jobs:
            job=','.join(emp_jobs)
        else:
            job=None
        if emp_comps:
            company=','.join(emp_comps)
        else:
            company=None

    data.append(uid)
    data.append(name)
    data.append(gender)
    data.append(headline)
    data.append(description)
    data.append(que_count)
    data.append(ans_count)
    data.append(art_count)
    data.append(collection)
    data.append(column)
    data.append(voteup)
    data.append(thanks)
    data.append(collected)
    data.append(shared)
    data.append(following)
    data.append(follower)
    data.append(fol_column)
    data.append(fol_topic)
    data.append(location)
    data.append(business)
    data.append(school)
    data.append(major)
    data.append(job)
    data.append(company)
    data.append(weibo)
    data.append(weibo_name)
    data.append(weibo_url)
    data.append(creat_at)
    data.append(fri_score)

    return data

def answerData(answer):
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


if __name__=='__main__':
    try:
        conn=MySQLdb.connect(host='127.0.0.1',user='root',passwd='root',port=3306, charset='utf8')
        cur=conn.cursor()
        cur.execute('set interactive_timeout=96*3600')
        # cur.execute('drop database if exists zhihu')
        # cur.execute('CREATE DATABASE IF NOT EXISTS zhihu DEFAULT CHARSET utf8 COLLATE utf8_unicode_ci')
        conn.select_db('zhihu')
    except MySQLdb.Error,e:
        print("Mysql Error %d: %s" % (e.args[0], e.args[1]))

    user_table_sql='create table IF NOT EXISTS 20406962_user(uid varchar(50),name varchar(20),gender varchar(10),headline varchar(200),description varchar(1000),que_count int ,ans_count int ,art_count int ,collection int ,column_ int ,voteup int ,thanks int ,collected int ,shared int ,following int ,follower int ,fol_column int ,fol_topic int ,location varchar(200),business varchar(50),school varchar(200),major varchar(200),job varchar(200),company varchar(200),weibo varchar(20),weibo_name varchar(40),weibo_url varchar(40),creat_at varchar(40),fri_score varchar(20),ans_id int)'
    ans_table_sql='create TABLE IF NOT EXISTS 20406962_ans(ans_ques VARCHAR (200),que_id INT ,ans_id INT ,ans_auth VARCHAR (20),ans_cont MEDIUMTEXT ,ans_vote INT ,ans_than INT ,ans_comm INT ,com_perm VARCHAR(20) ,cre_timestamp VARCHAR (30),upd_timestamp VARCHAR (30),cre_time VARCHAR (30),upd_time VARCHAR (30))'
    question = client.question(20406962)#你最孤独的时刻是什么？
    answers = question.answers
    try:
        cur.execute(user_table_sql)
        cur.execute(ans_table_sql)
        # print("answers is", repr(answers))
        for answer in answers:
            ans_data = answerData(answer)
            u_data = userData(answer.author)
            u_data.append(answer.id)
            cur.execute('insert into 20406962_user values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)', u_data)
            cur.execute('insert into 20406962_ans values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)', ans_data)
            conn.commit()
    except MySQLdb.Error, e:
        print(e)
    try:
        cur.close()
        conn.close()
    except MySQLdb.Error, e:
        print("Mysql Error %d: %s" % (e.args[0], e.args[1]))