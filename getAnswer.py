# -*- coding: utf-8 -*-

import time

def time2str(timestamp):
    time_array = time.localtime(timestamp)
    return time.strftime("%Y-%m-%d %H:%M:%S", time_array)

def getAnswer(answer):
    data = []
    # 13个变量
    ans_ques = ''
    que_id = None
    ans_id = None
    ans_auth = ''
    ans_cont = ''
    ans_vote = answer.voteup_count
    ans_than = answer.thanks_count
    ans_comm = answer.comment_count
    com_perm = answer.comment_permission
    cre_timestamp = answer.created_time
    upd_timestamp = answer.updated_time
    cre_time = time2str(cre_timestamp)
    upd_time = time2str(upd_timestamp)

    try:
        ans_ques = answer.question.title
    except Exception as e:
        print(str(e))
    try:
        que_id = answer.question.id
    except Exception as e:
        print(str(e))
    try:
        ans_id = answer.id
    except Exception as e:
        print(str(e))
    try:
        ans_auth = answer.author.name
    except Exception as e:
        print(str(e))
    try:
        ans_cont = answer.content
    except Exception as e:
        print(str(e))
    try:
        ans_vote = answer.voteup_count
    except Exception as e:
        print(str(e))
    try:
        ans_than = answer.thanks_count
    except Exception as e:
        print(str(e))
    try:
        ans_comm = answer.comment_count
    except Exception as e:
        print(str(e))
    try:
        com_perm = answer.comment_permission
    except Exception as e:
        print(str(e))
    try:
        cre_timestamp = answer.created_time
        upd_timestamp = answer.updated_time
    except Exception as e:
        print(str(e))
    try:
        cre_time = time2str(cre_timestamp)
        upd_time = time2str(upd_timestamp)
    except Exception as e:
        print(str(e))
    try:
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
    except Exception as e:
        print(str(e))

    return data
