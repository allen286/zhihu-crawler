function getLiveDetails(live) {
  let item = {}
  item.liveId = live.id || ''
  item.liveName = live.subject || ''
  item.hostName = (live.speaker && live.speaker.member && live.speaker.member.name) || ''
  item.hostId = (live.speaker && live.speaker.member && live.speaker.member.id) || ''
  item.hostBio = (live.speaker && live.speaker.bio) || ''
  item.hostDesc = (live.speaker && live.speaker.description) || ''

  item.seatsTaken = (live.seats && live.seats.taken) || 0
  item.score = live.feedback_score || 0
  item.fee = (live.fee && live.fee.amount) || 0
  item.descHtml = live.description_html || ''
  item.liveDesc = live.description || ''
  item.outline = live.outline || ''

  item.createdTime = live.created_at || 0
  item.startTime = live.starts_at || 0
  item.endTime = live.ends_at || 0

  item.messageNum = live.speaker_message_count || 0
  item.likedNum = live.liked_num || 0

  // 是否支持退款
  item.refund = live.is_refundable || false
  // 主讲人是否实名认证
  item.auth = live.has_authenticated || false
  // 是否支持试听
  item.audition = live.is_audition_open || false
  item.auditionNum = live.audition_message_count || 0
  item.cospeakerNum = (live.cospeakers && live.cospeakers.length) || 0

  item.reviewStatus = (live.review && live.review.status) || ''
  item.reviewNum = (live.review && live.review.count) || 0
  item.reviewScore = (live.review && live.review.score) || 0

  item.tag = (live.tags && live.tags[0] && live.tags[0].name) || ''

  return item
}

module.exports = getLiveDetails
