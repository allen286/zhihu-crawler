# -*- coding: utf-8 -*-
import os
from zhihu_oauth import ZhihuClient
import time
import binascii


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


def ucps2str(ucpstr):
    '''Convert unicode code point (in hex) ascii string to unicode string'''
    s = ''
    for i in range(len(ucpstr) / 4):
        ucp = ucpstr[i * 4:i * 4 + 4]
        s = s + unichr(int(ucp, 16))
    return s


question = client.question(20840874)#哪些东西买了之后，会让人因生活质量和幸福感提升而感觉相见恨晚？

# 通过question类的answers这个生成器属性可以获取到每个回答的author（answer.author类），进而过去回答者的档案信息
# for answer in question.answers:
#     print(answer.author.name+ str(answer.author.answer_count) + ' ' + str(answer.voteup_count))
#     print(answer.author.id)  #为什么id是这样的？10fc5f92b8f7f7cd1a058d10a0f36ce0

# for answer in question.answers:
#     # print('id',ucps2str(answer.author.id),answer.author.id.decode('hex'),binascii.unhexlify(answer.author.id))
#     print('id', answer.author.i)
#     print('uid',answer.author.uid)
#     print('name', answer.author.name)
#     print('gender', answer.author.gender)
#     print('headline', answer.author.headline)
#     print('description', answer.author.description)
#     print('\n')
#
#     print('question asked', answer.author.question_count)
#     print('answered question', answer.author.answer_count)
#     print('article count', answer.author.articles_count)
#     print('collection count', answer.author.collection_count)
#     print('column count', answer.author.column_count)
#     print('\n')
#
#     print('voteup count', answer.author.voteup_count)
#     print('get thanks count', answer.author.thanked_count)
#     print('collected_count', answer.author.collected_count)
#     print('shared_count', answer.author.shared_count)
#     print('\n')
#
#     print('following answer.author count', answer.author.following_count)
#     print('followers count', answer.author.follower_count)
#     print('following column count', answer.author.following_column_count)
#     print('following topic count', answer.author.following_topic_count)
#     print('following_question_count', answer.author.following_question_count)
#     print('\n')
#
#     print('created_at', answer.author.created_at)
#     print('friendly_score', answer.author.friendly_score)
#     print('has_daily_recommend_permission', answer.author.has_daily_recommend_permission)
#     print('is_active', answer.author.is_active)
#     print('is_moments_user', answer.author.is_moments_user)
#     print('\n')
#
#     print('is_bind_sina', answer.author.is_bind_sina)
#     print('sina_weibo_name', answer.author.sina_weibo_name)
#     print('\n')
#
#     print('answer_question_title',answer.question.title)
#     print('answer_question_id',answer.question.id)
#     print('answer_id',answer.id)
#     print('answer_author',answer.author.name)
#     print('answer_content', answer.content)
#
#     print('answer_voteup_count', answer.voteup_count)
#     print('answer_thanks_count', answer.thanks_count)
#     print('answer_comment_count', answer.comment_count)
#
#     print('answer_comment_permission',answer.comment_permission)
#     print('answer_created_time',type(answer.created_time),time2str(answer.created_time))
#     print('answer_updated_time',answer.updated_time,time2str(answer.updated_time))
#
#     for comment in answer.comments:
#         print(comment.author.name)
#         print(comment.content)
#         print(comment.vote_count)
#     print('-------------------------------------------------------------')

print('follower_count',question.follower_count)
for ques_fol in question.followers:
    print(ques_fol.name)
