# -*- coding: utf-8 -*-
import os
import zhihu_oauth

TOKEN_FILE = 'token.pkl'

# login
client = zhihu_oauth.ZhihuClient()

if os.path.isfile(TOKEN_FILE):
    client.load_token(TOKEN_FILE)
else:
    client.login_in_terminal()
    client.save_token(TOKEN_FILE)

# 张佳玮 关于阅读的一些微小经验
live = client.live(896780923079639040)
for role, badge, people in live.participants:
    print(role, badge.name, people.name)

# for role, badge, people in live.members:
#     print(role, badge.name, people.name)
