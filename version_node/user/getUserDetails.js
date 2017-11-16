// let res = require('./userData')

function getUserDetails(user) {
  let {
    id, // string
    name, // string
    follower_count,
    following_count,
    pins_count,

    answer_count,
    articles_count,
    columns_count,

    voteup_count,
    thanked_count,
    favorited_count,
    shared_count,

    question_count,
    following_question_count,
    following_topic_count,
    following_columns_count,
    following_favlists_count,

    favorite_count,
    live_count,
    hosted_live_count,
    participated_live_count,

    gender,
    // 后面的都是string类型
    headline,
    description,
    marked_answers_text
  } = user

  let detail = {
    id, // string
    name, // string
    follower_count,
    following_count,
    pins_count,

    answer_count,
    articles_count,
    columns_count,

    voteup_count,
    thanked_count,
    favorited_count,
    shared_count,

    question_count,
    following_question_count,
    following_topic_count,
    following_columns_count,
    following_favlists_count,

    favorite_count,
    live_count,
    hosted_live_count,
    participated_live_count,

    gender,
    // 后面的都是string
    headline,
    description,
    marked_answers_text,

    business_name: '',
    location: '',
    education: '',
    employment: '',
    badge_type: '',
    badge_description: '',
  }

  detail.business_name = user.business && user.business.name || ''

  if (user.location && user.location.length > 0) {
    detail.location = user.location.map(loc => loc.name).join('；') // 中文分号 
  }

  if (user.education && user.education.length > 0) {
    detail.education = user.education.map(edu => edu.name).join('；') // 中文分号 
  }

  if (user.employment && user.employment.length > 0) {
    detail.employment = user.employment.map(eduArr => eduArr.map(item => item.name).join('-')).join('；') // 中文分号 
  }

  if (user.badge && user.badge.length > 0) {
    detail.badge_type = user.badge.map(badge => badge.type).join(';') // 英文分号
    detail.badge_description = user.badge.map(badge => badge.description).join('；') // 中文分号
  }

  // 过滤表情字符
  detail.description = filterEmoji(detail.description)

  return detail
}

function filterEmoji(text) {
  return text.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030|\s*/ig, '')
}

module.exports = getUserDetails

// 测试
// getUserDetails(res)
