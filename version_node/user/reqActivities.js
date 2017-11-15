// 获取用户动态，此处只抽取了用户送出赞同数据
const https = require('https')
const conn = require('./connDB')

const cookieLogin = '_zap=8d95cd83-04a6-4dfd-af71-190b1dac66e2; _ga=GA1.2.1516918544.1463121703; l_cap_id="N2E1MTIzYTg4YTc4NDliM2EzZTI0OTFjOWQ4ODcwNzQ=|1508144961|97b922146c87503acb387ef71860f12500a3c422"; r_cap_id="NGVkNzdmYmVmMWUwNGIzMWE5MDQwNzg2Y2Q1NDhmOTM=|1508144961|dcf06fc5230597bc8f039b8c1be8c464fcb7546c"; cap_id="Y2VjNzc4YTJlNDFiNDQxNzlmNzc0NTZkOWJhMmZlM2I=|1508144961|2079889f55fdbcf7dd535345f50e94943933b171"; z_c0=Mi4xRU1FNEJnQUFBQUFBZ0VEcE9FU3VDUmNBQUFCaEFsVk44d1FNV2dCTFlkcVJkZ2VJRnhkMHRRQnFNUlk1SXJhblVR|1508145139|5e7e7a7ace4e60223c88108d4a72f7615970a698; q_c1=780a481fb0f24629822b42a84f80cc6b|1508468587000|1464317015000; aliyungf_tc=AQAAAOiW4HWT9A4AOEJyyo32njmK/5Ax; __utma=155987696.1516918544.1463121703.1509083392.1509083392.1; __utmc=155987696; __utmz=155987696.1509083392.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); _xsrf=eebea36b1da847708a6e47e98ab460d9; d_c0="AIBA6ThErgmPTh4hnJf153U2A4vEDIFwfdQ=|1459093649;'
const auth = 'Bearer Mi4xRU1FNEJnQUFBQUFBZ0VEcE9FU3VDUmNBQUFCaEFsVk44d1FNV2dCTFlkcVJkZ2VJRnhkMHRRQnFNUlk1SXJhblVR|1508145139|5e7e7a7ace4e60223c88108d4a72f7615970a698'
const options = {
  hostname: 'api.zhihu.com',
  port: 443,
  // path: ,
  method: 'GET',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Cookie': cookieLogin,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2763.0 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest',
    'authorization': auth,
    'Connection': 'keep-alive',
    'X-UDID': 'AIBA6ThErgmPTh4hnJf153U2A4vEDIFwfdQ='
  }
}
const USER_TABLE = 'live_ended_hosts'
const SELECT_SQL = `SELECT DISTINCT id FROM zhihu_live.${USER_TABLE} WHERE give_voteup_count is null;`
let idList = []
let count = 0

// 建立数据库连接
conn.open()

// 查询live主办人的id列表
conn.select(SELECT_SQL, cb)
function cb(res) {
  idList = res.map(item => item.id)
  console.log(`共计${idList.length}个用户`)

  // 请求用户动态数据
  for (let i = 0; i < idList.length; i++) {
    let id = idList[i]
    setTimeout(() => {
      options.path = `/people/${id}/activities?limit=100&after_id=${parseInt(new Date().getTime() / 1000)}&desktop=False`
      // console.log('sleep 1000ms')
      sendReq(count => save2db(count, id, i))
    }, 1000 * i);
  }
}

function sendReq(callback) {
  const req = https.request(options, (res) => {
    if (res.statusCode !== 200) {
      console.log(`接口请求出错，状态码：${res.statusCode}，${req.path}`)
      return
    }
    // console.log(`${req.path}，状态码${res.statusCode}`)
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
      data && data.forEach(act => {
        if (act.verb === 'ANSWER_CREATE') {
          count += 1
        }
      })

      let page = body.paging || {}
      if (page.is_end) {
        // 全部爬取完成后执行callback
        callback(count)
        count = 0
      } else if (page.next) {
        // 还有下一页的话继续请求
        setTimeout(() => {
          options.path = page.next.replace('https://api.zhihu.com', '')
          // console.log('sleep 1000ms')
          sendReq(callback)
        }, 1000);
      }
    })
  })

  req.on('error', (e) => {
    console.error(e)
  })
  req.end()
}

function save2db(count, id, index) {
  const UPDATE_SQL = `UPDATE zhihu_live.${USER_TABLE} SET give_voteup_count = ? WHERE id = ?`
  // 插入到数据库中
  try {
    conn.insert(UPDATE_SQL, [count, id], () => console.log(`第${index + 1}条数据插入成功，count: ${count}`))
  } catch (error) {
    console.log(`第${index + 1}条数据插入失败：${error}`)
  }
}
