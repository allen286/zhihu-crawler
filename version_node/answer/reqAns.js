// 获取用户详细数据
const request = require('request')
const conn = require('./connDB')
const getUserDetails = require('./getAnsDetails')
const options = require('./options')

const ID_TABLE = 'zhihudata.xxx'
const ANS_TABLE = 'zhihudata.ans_list'
const urlTokenList = []
// const TIME_OUT = 0

// 建立数据库连接
conn.open()

let idList = []
// const SELECT_SQL = `SELECT DISTINCT hostId FROM ${ID_TABLE};`
const SELECT_SQL = `select hostId from ${ID_TABLE} where hostId not in(select distinct author_id from ${ANS_TABLE});`
const INSERT_SQL = `INSERT INTO ${ANS_TABLE} SET ?`
// 查询live主办人的id列表
conn.select(SELECT_SQL, cb)

function cb(res) {
  // res为RowDataPacket数组，取出其中的id字段（live表时为hostId字段）
  idList = res.map(item => item.hostId)
  console.log(`共${idList.length}个用户`)
  nextUserAns(idList)
  
}

function nextUserAns(list) {
  let targetOptions = Object.assign({}, options)
  let id = list.shift()
  // 由用户id拿到用户的为url_token
  id && getUrlToken(id, (urlToken) => {
    console.log(urlToken)
    targetOptions.url = `https://www.zhihu.com/api/v4/members/${urlToken}/answers?include=data%5B*%5D.is_normal%2Cadmin_closed_comment%2Creward_info%2Cis_collapsed%2Cannotation_action%2Cannotation_detail%2Ccollapse_reason%2Ccollapsed_by%2Csuggest_edit%2Ccomment_count%2Ccan_comment%2Ccontent%2Cvoteup_count%2Creshipment_settings%2Ccomment_permission%2Cmark_infos%2Ccreated_time%2Cupdated_time%2Creview_info%2Cquestion%2Cexcerpt%2Crelationship.is_authorized%2Cvoting%2Cis_author%2Cis_thanked%2Cis_nothelp%3Bdata%5B*%5D.author.badge%5B%3F(type%3Dbest_answerer)%5D.topics&offset=0&limit=20&sort_by=created`
    sendReq(nextUserAns, targetOptions)
  });
}

function getUrlToken(id, cbReq) {
  console.log(id);
  options.url = `https://www.zhihu.com/api/v4/members/${id}`
  request(options, (err, res, body) => {
    if (err) {
      console.log(err)
      return
    }
    if (res.statusCode !== 200) {
      console.log(`接口请求出错，状态码：${res.statusCode}`)
      return
    }

    try {
      body = JSON.parse(body)
    } catch (error) {
      body = {}
      console.log(error)
    }

    urlTokenList.push(body.url_token)
    cbReq(body.url_token)
  })
}

function sendReq(callback, targetOptions) {
  request(targetOptions, (err, res, body) => {
    if (err) {
      console.log(err)
      return
    }
    if (res.statusCode !== 200) {
      console.log(`接口请求出错，状态码：${res.statusCode}`)
      return
    }

    try {
      body = JSON.parse(body)
    } catch (error) {
      body = {}
      console.log(error)
    }

    let data = body.data || [] // 对象数组
    data && data.forEach(ans => {
      let ansData = getUserDetails(ans)
      // let closeCb = () => console.log(`数据插入成功`)
      let closeCb = () => {}
      try {
        conn.insert(INSERT_SQL, ansData, closeCb)
      } catch (error) {
        console.log(`数据插入失败：${error}`)
      }
    })

    let page = body.paging || {}
    if (page.is_end) {
      // 全部爬取完成后执行callback
      callback(idList)
    } else if (page.next) {
      // 还有下一页的话继续请求
      // setTimeout(() => {
        // console.log(`sleep ${TIME_OUT}ms`)
        targetOptions.url = page.next.replace('https://www.zhihu.com/members/','https://www.zhihu.com/api/v4/members/')
        console.log(targetOptions.url);
        sendReq(callback, targetOptions)
      // }, TIME_OUT)
    } 
  })
}

function closeWhenLast() {
  conn.close()
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
