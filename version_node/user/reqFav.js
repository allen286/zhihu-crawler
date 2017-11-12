// 获取收藏答案数目
const https = require('https')
const conn = require('./connDB')

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
const LIVE_HOST_TABLE = 'live_ended_hosts3'

// 建立数据库连接
conn.open()

let idList = []
const SELECT_SQL = `SELECT DISTINCT id FROM zhihu_live.${LIVE_HOST_TABLE};`

// 查询live主办人的id列表
conn.select(SELECT_SQL, cb)

async function cb(res) {
  // res为RowDataPacket数组，取出其中的hostId字段
  idList = res.map(item => item.id)
  console.log(`共${idList.length}个举办者`)

  // 循环id列表爬取每个用户数据, 延时发请求，避免请求过快流量异常导致403
  for (let i = 0; i < idList.length; i++) {
    reqFav(idList[i], i)
    // await sleep(1000)
    // console.log('sleep 1000ms')
  }
}

function reqFav(id, index) {
  options.path = `/people/${id}/collections_v2?limit=100&offset=0`

  const req = https.request(options, (res) => {
    if (res.statusCode !== 200) {
      console.log(`${id}/collections_v2接口返回错误, 状态码：${res.statusCode}`)
      return
    }
    console.log(`${id}, 状态码：${res.statusCode}`)
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

      const UPDATE_SQL = `UPDATE zhihu_live.${LIVE_HOST_TABLE} SET favorite_answer_count = ? WHERE id = ?`
      let favData = getFavDetails(body)
      let closeCb = () => console.log(`第${index + 1}条数据插入成功`)
      // 接口返回时间不一致，如何保证在最后一条插入完成后关闭连接呢？
      // if (index === idList.length - 1) closeCb = closeWhenLast

      try {
        // 插入到数据库中
        conn.insert(UPDATE_SQL, [favData, id], closeCb)
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

function getFavDetails(fav) {
  let result = 0
  if (fav.data && fav.data.length > 0) {
    fav.data.forEach(item => result += (item.answer_count || 0))
  }
  return result
}