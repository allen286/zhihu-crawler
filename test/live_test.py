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

# live的id
live = client.live(890935300405198848)
for role, badge, people in live.participants:
    print(role, badge.name, people.name, people.id)

# for role, badge, people in live.members:
#     print(role, badge.name, people.name)
