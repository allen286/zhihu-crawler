// 获取用户详细数据
const https = require('https')
const conn = require('./connDB')
const getUserDetails = require('./getUserDetails')

const cookieLogin = '_zap=8d95cd83-04a6-4dfd-af71-190b1dac66e2; _ga=GA1.2.1516918544.1463121703; l_cap_id="N2E1MTIzYTg4YTc4NDliM2EzZTI0OTFjOWQ4ODcwNzQ=|1508144961|97b922146c87503acb387ef71860f12500a3c422"; r_cap_id="NGVkNzdmYmVmMWUwNGIzMWE5MDQwNzg2Y2Q1NDhmOTM=|1508144961|dcf06fc5230597bc8f039b8c1be8c464fcb7546c"; cap_id="Y2VjNzc4YTJlNDFiNDQxNzlmNzc0NTZkOWJhMmZlM2I=|1508144961|2079889f55fdbcf7dd535345f50e94943933b171"; z_c0=Mi4xRU1FNEJnQUFBQUFBZ0VEcE9FU3VDUmNBQUFCaEFsVk44d1FNV2dCTFlkcVJkZ2VJRnhkMHRRQnFNUlk1SXJhblVR|1508145139|5e7e7a7ace4e60223c88108d4a72f7615970a698; q_c1=780a481fb0f24629822b42a84f80cc6b|1508468587000|1464317015000; aliyungf_tc=AQAAAOiW4HWT9A4AOEJyyo32njmK/5Ax; __utma=155987696.1516918544.1463121703.1509083392.1509083392.1; __utmc=155987696; __utmz=155987696.1509083392.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); _xsrf=eebea36b1da847708a6e47e98ab460d9; d_c0="AIBA6ThErgmPTh4hnJf153U2A4vEDIFwfdQ=|1459093649;'
const options = {
  hostname: 'api.zhihu.com',
  port: 443,
  // path: '',
  method: 'GET',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Cookie': cookieLogin,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2763.0 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest'
  }
}
// const ID_TABLE = 'zhihu_live.live_ended_1107'
// const USER_TABLE = 'zhihu_live.live_ended_hosts3'
const ID_TABLE = 'zhihu_live.user_list'
const USER_TABLE = 'zhihu_live.user_detail'
const INTERVAL = 1000

// 建立数据库连接
conn.open()

let idList = []
// const SELECT_SQL = `SELECT DISTINCT hostId FROM ${ID_TABLE};`
const SELECT_SQL = `select distinct id from ${ID_TABLE} where id not in(select distinct id from ${USER_TABLE});`
const INSERT_SQL = `INSERT INTO ${USER_TABLE} SET ?`
// 查询live主办人的id列表
conn.select(SELECT_SQL, cb)

async function cb(res) {
  // res为RowDataPacket数组，取出其中的id字段（live表时为hostId字段）
  idList = res.map(item => item.id)
  console.log(`共${idList.length}个用户`)

  // 循环id列表爬取每个用户数据, 延时发请求，避免请求过快流量异常导致403
  for (let i = 0; i < idList.length; i++) {
    options.path = `/people/${idList[i]}`
    console.log(`sleep ${INTERVAL}ms`)
    await sleep(INTERVAL)
    reqUser(i)
  }
}

function reqUser(index) {
  const req = https.request(options, (res) => {
    if (res.statusCode !== 200) {
      console.log(`${req.path}接口返回错误, 状态码：${res.statusCode}`)
      return
    }
    console.log(`${req.path}, 状态码：${res.statusCode}`)
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

      let userData = getUserDetails(body)
      let closeCb = () => console.log(`第${index + 1}条数据插入成功`)
      // 接口返回时间不一致，如何保证在最后一条插入完成后关闭连接呢？
      // if (index === idList.length - 1) closeCb = closeWhenLast

      try {
        // 插入到数据库中
        conn.insert(INSERT_SQL, userData, closeCb)
      } catch (error) {
        console.log(`第${index + 1}条数据插入失败：${error}`)
      }
    })
  })

  req.on('error', (e) => {
    console.error(e)
  })
  req.end()
}

function closeWhenLast() {
  conn.close()
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
