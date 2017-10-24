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

#test topic class
topic = client.topic(19551275)
print(topic.followers_count)
print(topic.best_answers_count)
for fol in topic.followers:
    print(fol.id, fol.name)

#没有提供话题关注者接口，只能获取关注者数目，不能得到具体每位关注者
#最佳回答者无法获取
# print(type(topic.best_answerers))
# for answerer in topic.best_answerers:
#     print(answerer.id)
# 报错信息如下
# return People(data['id'], data, self._session)
# KeyError: u'id'
# 为什么呢

# for child in topic.children:
#     print(child.name)