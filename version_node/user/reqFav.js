// 获取收藏答案数目
const https = require('https')
const conn = require('./connDB')
const options = require('./options')

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
    await sleep(1000)
    console.log('sleep 1000ms')
    reqFav(idList[i], i)
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

      const UPDATE_SQL = `UPDATE zhihu_live.${LIVE_HOST_TABLE} SET favorite_answer_count = ? WHERE id = ?`
      let favData = getFavDetails(body)
      let closeCb = () => console.log(`第${index + 1}条数据插入成功`)
      // 接口返回时间不一致，如何保证在最后一条插入完成后关闭连接呢？
      // if (index === idList.length - 1) closeCb = closeWhenLast

      // 插入到数据库中
      try {
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
