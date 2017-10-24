# -*- coding: utf-8 -*-
import os
from zhihu_oauth import ZhihuClient

TOKEN_FILE = 'token.pkl'

# login
client = ZhihuClient()

if os.path.isfile(TOKEN_FILE):
    client.load_token(TOKEN_FILE)
else:
    client.login_in_terminal()
    client.save_token(TOKEN_FILE)


# test people class
# people = client.people('suji-yan')
people = client.people('zhang-jia-wei')
# people = client.people('zhang-xiao-hei-86-4')
# people = client.people('zhao-wen-biao')
# people = client.people('bu-er-chen-94')
# people = client.people('zhang-yi-da-78')
# people = client.people('wang-xiao-fei-39-10')


print('id', people.id, type(people.id))
# print('uid', people.uid)
print('name', people.name)
print('gender', people.gender, type(people.gender))
print('headline', people.headline)
print('description', people.description)
print('\n')

print('question_asked', people.question_count)
print('answered_question', people.answer_count)
print('article_count', people.articles_count)
print('collection_count', people.collection_count)
print('column_count', people.column_count)
print('\n')

print('voteup_count', people.voteup_count)
print('get_thanks_count', people.thanked_count)
print('collected_count', people.collected_count)
print('shared_count', people.shared_count)
print('\n')

print('following_people_count', people.following_count)
print('followers_count', people.follower_count)
print('following_column_count', people.following_column_count)
print('following_topic_count', people.following_topic_count)
print('following_question_count', people.following_question_count)
print('\n')

print('created_at', people.created_at)
print('friendly_score', people.friendly_score)
print('has_daily_recommend_permission', people.has_daily_recommend_permission)
print('is_active', people.is_active)
print('is_moments_user', people.is_moments_user)
print('\n')

print('is_bind_sina', people.is_bind_sina)
print('sina_weibo_name', people.sina_weibo_name)
print('sina_weibo_url', people.sina_weibo_url)
print('\n')

# 居住地信息，不用判断是否存在，可直接调用。list型变量
locations = []
for location in people.locations:
    locations.append(location.name)
if locations:
    print('location', ','.join(locations))

# 所在行业，需要先判断是否存在。str型变量。
if people.business:
    print('business', people.business.name)
else:
    print('business', None)

# 学校和专业，需要先判断是否存在。str型变量，这样分开存储不太合适，它们间有一一对应关系
edu_schools = []
edu_majors = []
for education in people.educations:
    if 'school' in education:
        edu_schools.append(education.school.name)
    if 'major' in education:
        edu_majors.append(education.major.name)
if edu_schools:
    print('school', ','.join(edu_schools))
else:
    print('school', None)
if edu_majors:
    print('major', ','.join(edu_majors))
else:
    print('major', None)

# 职位和公司，需要先判断是否存在。str型变量，这样分开存储不太合适，它们间有一一对应关系
emp_jobs = []
emp_comps = []
for employment in people.employments:
    if 'job' in employment:
        emp_jobs.append(employment.job.name)
    if 'company' in employment:
        emp_comps.append(employment.company.name)
if emp_jobs:
    print('job', ','.join(emp_jobs))
else:
    print('job', None)
if emp_comps:
    print('company', ','.join(emp_comps))
else:
    print('company', None)

# 2016.04.14,15:00 添加三个新属性:关注的收藏夹数，用户自己创建的收藏夹中回答的总数，创建的收藏夹的关注者总数
# fol_cols = people.following_collections
# if fol_cols:
#     for col in fol_cols:
#         print(col.answer_count)
#         # print(col.title)
#         # print(col.comment_count)
#         # print(col.follower_count)
#         # print(len(list(col.answers)))
# if fol_cols:
#     fol_coll = count(fol_cols)
# print ('following_collection_count',fol_coll)   #不对，全是37。。是我自己关注的收藏夹数。此属性不能用，作者已删除

# ques=people.following_questions
# if ques:
#     for que in ques:
#         print(que.title)

coll_ans_sum = 0
coll_fol_sum = 0
if people.collections:
    for col in people.collections:
        # print(col.answer_count)
        # print(col.follower_count)
        # print(col.comment_count)
        # print(len(list(col.answers)))
        coll_ans_sum += col.answer_count
        coll_fol_sum += col.follower_count
print('coll_ans_sum', coll_ans_sum)
print('coll_fol_sum', coll_fol_sum)

# print(people.avatar_url)
# print(people2.avatar_url)
# print(people.avatar_url=='http://pic1.zhimg.com/da8e974dc_s.jpg')

# 2016.04.14,17:00 添加个新属性:是否自定义头像
avatar = 0 if people.avatar_url == 'http://pic1.zhimg.com/da8e974dc_s.jpg' else 1
print('avatar', avatar)

# 2016.04.14,17:00 添加新属性:文章获赞总数。同样用到了循环，跑起来会很慢很慢
art_vote_sum = 0
if people.articles:
    for art in people.articles:
        art_vote_sum += art.voteup_count
print('art_vote_sum', art_vote_sum)

# 2016.04.15增加关注话题名字的属性
topic_titles = []
fol_topic_title = ''
if people.following_topics:
    for f_topic in people.following_topics:
        topic_titles.append(f_topic.name)
    fol_topic_title = ','.join(topic_titles)
print(fol_topic_title)

column_fol_sum = 0
if people.columns:
    for c in people.columns:
        column_fol_sum += c.follower_count
print('column_fol_sum', column_fol_sum)

give_art_vote = 0
if people.activities:
    for act in people.activities:
        if act.type == 'VOTEUP_ARTICLE':
            give_art_vote += 1
            # print(act.target.title)
print('give_art_vote', give_art_vote)

give_ans_vote = 0
if people.activities:
    for act in people.activities:
        if act.type == 'VOTEUP_ANSWER':
            give_ans_vote += 1
            # print(act.target.question.title)
print('give_ans_vote', give_ans_vote)
