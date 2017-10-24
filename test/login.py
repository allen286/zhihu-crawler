# -*- coding: utf-8 -*-
from zhihu_oauth import ZhihuClient
from zhihu_oauth.exception import NeedCaptchaException

client = ZhihuClient()

client.login_in_terminal('', '')
client.save_token('token.pkl')