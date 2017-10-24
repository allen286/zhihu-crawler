# -*- coding: utf-8 -*-
import os
from zhihu_oauth import ZhihuClient


TOKEN_FILE = 'token.pkl'

#login
client = ZhihuClient()

if os.path.isfile(TOKEN_FILE):
    client.load_token(TOKEN_FILE)
else:
    client.login_in_terminal()
    client.save_token(TOKEN_FILE)

me = client.me()
print('id',me.id)
#print('uid',me.uid)
print('name', me.name)
print('gender',me.gender)
print('headline', me.headline)
print('description', me.description)
print('\n')

print('question asked', me.question_count)
print('answered question', me.answer_count)
print('article count', me.articles_count)
print('collection count', me.collection_count)
print('column count', me.column_count)
print('\n')

print('voteup count', me.voteup_count)
print('get thanks count', me.thanked_count)
print('collected_count', me.collected_count)
print('shared_count',me.shared_count)
print('\n')

print('following me count', me.following_count)
print('followers count', me.follower_count)
print('following column count', me.following_column_count)
print('following topic count', me.following_topic_count)
# print('following_question_count',following_question_count)
print('\n')

print('created_at',me.created_at)
print('friendly_score',me.friendly_score )
print('has_daily_recommend_permission',me.has_daily_recommend_permission)
print('is_active',me.is_active)
print('is_moments_user',me.is_moments_user)
print('\n')

print('is_bind_sina',me.is_bind_sina)
print('sina_weibo_name',me.sina_weibo_name)
print('sina_weibo_url',me.sina_weibo_url)