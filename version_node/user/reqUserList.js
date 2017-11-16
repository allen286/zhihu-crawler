// 获取参与过某live的所有用户
const https = require('https')
const conn = require('./connDB')
const options = require('./options')

const LIVE_ID = '763851343583547392'
const USER_TABLE = 'user_list'
const audList = []
options.path = `/lives/${LIVE_ID}/members?limit=1000&offset=0`

// 建立数据库连接
conn.open()

// 请求数据
sendReq(data => save2db(data))

function sendReq(callback) {
  const req = https.request(options, (res) => {
    if (res.statusCode !== 200) {
      console.log(`接口请求出错，状态码${res.statusCode}`)
      return
    }
    console.log('状态码：', res.statusCode)
    res.setEncoding('utf8')

    let body = ''
    res.on('data', (chunk) => {
      body += chunk
    })

    res.on('end', () => {
      try {
        body = JSON.parse(body)
      } catch (error) {
        body = {}
        console.log(error)
      }

      let data = body.data || [] // 对象数组
      console.log(`${req.path}，获取${data.length}条数据，累计${audList.length + data.length}条`)
      data && data.forEach((item) => {
        let live = getAudience(item)
        audList.push(live)
      })

      if (body.paging.is_end) {
        // 全部爬取完成后执行callback
        callback(audList)
      } else {
        // 还有下一页的话继续请求
        options.path = body.paging.next.replace('https://api.zhihu.com', '')
        sendReq(callback)
      }
    })
  })

  req.on('error', (e) => {
    console.error(e)
  })
  req.end()
}

function getAudience(aud = {}) {
  let { id, name, url_token, is_followed, is_following, gender } = aud.member || {}
  let badge_id = aud.badge && aud.badge.id
  let badge_name = aud.badge && aud.badge.name
  let role = aud.role || ''

  return {
    id,
    name,
    url_token,
    is_followed,
    is_following,
    gender,
    badge_id,
    badge_name,
    role
  }
}

function save2db(data) {
  const sql = `INSERT INTO zhihu_live.${USER_TABLE} SET ?`
  for (let i = 0; i < audList.length; i++) {
    // 存入数据库
    try {
      conn.insert(sql, audList[i], () => {
        console.log(`第${i + 1}条数据插入成功`)
      })
    } catch (error) {
      console.log(`第${i + 1}条数据插入失败！${error}`)
    }
  }
}
