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

collection= client.collection(19825336)
print(collection.answer_count)

# 报错：
# Traceback (most recent call last):
#   File "C:/learnpython/zhihu_sp/collection.py", line 18, in <module>
#     print(collection.answer_count)
#   File "C:\Python27\lib\site-packages\zhihu_oauth\zhcls\other.py", line 57, in wrapper
#     return cls(cache['id'], cache, self._session)
# TypeError: 'int' object has no attribute '__getitem__'