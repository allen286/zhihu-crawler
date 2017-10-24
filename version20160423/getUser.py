# -*- coding: utf-8 -*-

def getUser(people):
    data = []
    # 37个变量，注释掉了一个(38-1)，该属性返回错误
    uid = ''
    name = ''
    gender = None
    headline = ''
    description = ''
    que_count = 0
    ans_count = 0
    art_count = 0
    column = 0
    column_fol_sum = 0
    collection = 0
    coll_ans_sum = 0
    coll_fol_sum = 0
    voteup = 0
    thanks = 0
    collected = 0
    shared = 0
    art_vote_sum = 0
    following = 0
    follower = 0
    fol_column = 0
    fol_topic = 0
    fol_topic_name = ''
    fol_ques = 0
    # fol_coll=0
    location = ''
    business = ''
    school = ''
    major = ''
    company = ''
    job = ''
    avatar = None
    avatar_url = ''
    weibo = None
    weibo_name = ''
    weibo_url = ''
    give_ans_vote = 0
    give_art_vote = 0

    try:
        uid = people.id
    except Exception as e:
        print(str(e))
    try:
        name = people.name
    except Exception as e:
        print(str(e))
    try:
        gender = people.gender
    except Exception as e:
        print(str(e))
    try:
        headline = people.headline
    except Exception as e:
        print(str(e))
    try:
        description = people.description
    except Exception as e:
        print(str(e))
    try:
        que_count = people.question_count
    except Exception as e:
        print(str(e))
    try:
        ans_count = people.answer_count
    except Exception as e:
        print(str(e))
    try:
        art_count = people.articles_count
    except Exception as e:
        print(str(e))
    try:
        column = people.column_count
    except Exception as e:
        print(str(e))
    # column_fol_sum变量要用到循环，获取速度会慢
    try:
        if people.columns:
            for c in people.columns:
                column_fol_sum += c.follower_count
    except Exception as e:
        print(str(e))
    try:
        collection = people.collection_count
    except Exception as e:
        print(str(e))

    # coll_ans_sum和coll_fol_sum变量要用到循环，获取速度会慢
    try:
        if people.collections:
            for col in people.collections:
                    coll_ans_sum += col.answer_count
                    coll_fol_sum += col.follower_count
    except Exception as e:
        print(str(e), '获取用户收藏夹总答案数或总关注者数失败')
    try:
        voteup = people.voteup_count
    except Exception as e:
        print(str(e))
    try:
        thanks = people.thanked_count
    except Exception as e:
        print(str(e))
    try:
        collected = people.collected_count
    except Exception as e:
        print(str(e))
    try:
        shared = people.shared_count
    except Exception as e:
        print(str(e))

    # art_vote_sum变量要用到循环，获取速度会慢
    try:
        if people.articles:
            for art in people.articles:
                art_vote_sum += art.voteup_count
    except Exception as e:
        print(str(e))
    try:
        following = people.following_count
    except Exception as e:
        print(str(e))
    try:
        follower = people.follower_count
    except Exception as e:
        print(str(e))
    try:
        fol_column = people.following_column_count
    except Exception as e:
        print(str(e))
    try:
        fol_topic = people.following_topic_count
    except Exception as e:
        print(str(e))

    # fol_topic_title变量要用到循环，获取速度会慢
    topic_names = []
    try:
        if people.following_topics:
            for f_topic in people.following_topics:
                topic_names.append(f_topic.name)
            fol_topic_name = ','.join(topic_names)
    except Exception as e:
            print(str(e), '获取用户关注的所有话题的名称失败')
    try:
        fol_ques = people.following_question_count
    except Exception as e:
        print(str(e))
    # fol_coll = count(people.following_collections) if people.following_collections else 0    #此属性已从People类中删除

    locs = []
    try:
        if people.locations:
            for loc in people.locations:
                locs.append(loc.name)
                location = ','.join(locs)
    except Exception as e:
        print(str(e))
    try:
        business = people.business.name if people.business else None
    except Exception as e:
        print(str(e))
    edu_schools = []
    edu_majors = []
    try:
        if people.educations:
            for education in people.educations:
                if 'school' in education:
                    edu_schools.append(education.school.name)
                if 'major' in education:
                    edu_majors.append(education.major.name)
            school = ','.join(edu_schools) if edu_schools else None
            major = ','.join(edu_majors) if edu_majors else None
    except Exception as e:
        print(str(e))
    emp_jobs = []
    emp_comps = []
    try:
        if people.employments:
            for employment in people.employments:
                if 'job' in employment:
                    emp_jobs.append(employment.job.name)
                if 'company' in employment:
                    emp_comps.append(employment.company.name)
            job = ','.join(emp_jobs) if emp_jobs else None
            company = ','.join(emp_comps) if emp_comps else None
    except Exception as e:
        print(str(e))
    try:
        avatar = 0 if people.avatar_url == 'http://pic1.zhimg.com/da8e974dc_s.jpg' else 1
        avatar_url = people.avatar_url
    except Exception as e:
        print(str(e))
    try:
        weibo = people.is_bind_sina
        weibo_name = people.sina_weibo_name
        weibo_url = people.sina_weibo_url
    except Exception as e:
        print(str(e))
    # 下面两个变量要遍历用户动态，获取速度非常非常慢
    try:
        if people.activities:
            for act in people.activities:
                if act.type == 'VOTEUP_ANSWER':
                    give_ans_vote += 1
    except Exception as e:
        print(str(e), '获取用户赞同答案数失败')
    try:
        if people.activities:
            for act in people.activities:
                if act.type == 'VOTEUP_ARTICLE':
                    give_art_vote += 1
    except Exception as e:
        print(str(e), '获取用户赞同文章数失败')
    # create_at=people.created_at  #获取的值全部为None
    # fri_score=people.friendly_score   #获取的值全部为None

    try:
        data.append(uid)
        data.append(name)
        data.append(gender)  # 存储成了varchar格式，因为存储成int时出错了，未设置性别的是-1,匿名用户时会报错。后面avatar和weibo同理
        data.append(headline)
        data.append(description)
        data.append(que_count)
        data.append(ans_count)
        data.append(art_count)
        data.append(column)
        data.append(column_fol_sum)
        data.append(collection)
        data.append(coll_ans_sum)
        data.append(coll_fol_sum)
        data.append(voteup)
        data.append(thanks)
        data.append(collected)
        data.append(shared)
        data.append(art_vote_sum)
        data.append(following)
        data.append(follower)
        data.append(fol_column)
        data.append(fol_topic)
        data.append(fol_topic_name)
        data.append(fol_ques)
        # data.append(fol_coll)
        data.append(location)
        data.append(business)
        data.append(school)
        data.append(major)
        data.append(company)
        data.append(job)
        data.append(avatar)
        data.append(avatar_url)
        data.append(weibo)
        data.append(weibo_name)
        data.append(weibo_url)
        data.append(give_ans_vote)  # 超级慢
        data.append(give_art_vote)  # 超级慢
    except Exception as e:
        print(str(e))

    # 共38个变量，注释掉了fol_coll，还剩37个
    return data
