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

answer = client.answer(44818033)
print(answer.comment_count)

# for follower in people.followers:
#     print(follower.name)

# 获取点赞量最高的 5 个回答
# for _, answer in zip(range(5), people.answers.order_by('votenum')):
#     print(answer.question.title, answer.voteup_count)
# print('----------')
