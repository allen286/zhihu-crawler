// let res = require('./userData')

function getAnsDetails(ans) {
  let {
    id, // string
    voteup_count,
    created_time,
    updated_time,
    content,
    comment_count,
    is_normal,
    is_collapsed,
    url,
    author = {} // object
  } = ans

  return {
    id, // string
    voteup_count,
    created_time,
    updated_time,
    content,
    comment_count,
    is_normal,
    is_collapsed,
    url,
    author_id: author.id || '',
    author_name: author.name || '',
    author_url: author.url_token || ''
  }
}

function filterEmoji(text) {
  return text.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030|\s*/ig, '')
}

module.exports = getAnsDetails

// 测试
// getAnsDetails(res)
