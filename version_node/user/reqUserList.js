// 获取参与过某live的所有用户
const https = require('https')
const conn = require('./connDB')

const LIVE_ID = '763851343583547392'
const USER_TABLE = 'user_list2'
const cookieLogin = '_zap=8d95cd83-04a6-4dfd-af71-190b1dac66e2; _ga=GA1.2.1516918544.1463121703; l_cap_id="N2E1MTIzYTg4YTc4NDliM2EzZTI0OTFjOWQ4ODcwNzQ=|1508144961|97b922146c87503acb387ef71860f12500a3c422"; r_cap_id="NGVkNzdmYmVmMWUwNGIzMWE5MDQwNzg2Y2Q1NDhmOTM=|1508144961|dcf06fc5230597bc8f039b8c1be8c464fcb7546c"; cap_id="Y2VjNzc4YTJlNDFiNDQxNzlmNzc0NTZkOWJhMmZlM2I=|1508144961|2079889f55fdbcf7dd535345f50e94943933b171"; z_c0=Mi4xRU1FNEJnQUFBQUFBZ0VEcE9FU3VDUmNBQUFCaEFsVk44d1FNV2dCTFlkcVJkZ2VJRnhkMHRRQnFNUlk1SXJhblVR|1508145139|5e7e7a7ace4e60223c88108d4a72f7615970a698; q_c1=780a481fb0f24629822b42a84f80cc6b|1508468587000|1464317015000; aliyungf_tc=AQAAAOiW4HWT9A4AOEJyyo32njmK/5Ax; __utma=155987696.1516918544.1463121703.1509083392.1509083392.1; __utmc=155987696; __utmz=155987696.1509083392.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); _xsrf=eebea36b1da847708a6e47e98ab460d9; d_c0="AIBA6ThErgmPTh4hnJf153U2A4vEDIFwfdQ=|1459093649;'
const options = {
  hostname: 'api.zhihu.com',
  port: 443,
  path: `/lives/${LIVE_ID}/members?limit=1000&offset=0`,
  method: 'GET',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Cookie': cookieLogin,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2763.0 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest'
  }
}
const audList = []

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
    // console.log('请求头：', JSON.stringify(res.headers))
    res.setEncoding('utf8')

    let body = ''
    res.on('data', (chunk) => {
      // console.log(`BODY: ${chunk}`)
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
