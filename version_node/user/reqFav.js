// 获取收藏答案数目
const https = require('https')
const conn = require('./connDB')
const options = require('./options')

// const USER_TABLE = 'zhihu_live.live_ended_hosts'
const USER_TABLE = 'zhihu_live.user_detail'

// 建立数据库连接
conn.open()

let idList = []
const SELECT_SQL = `SELECT DISTINCT id FROM ${USER_TABLE} WHERE favorite_answer_count is null LIMIT 0,2000;`
const UPDATE_SQL = `UPDATE ${USER_TABLE} SET favorite_answer_count = ? WHERE id = ?`

// 查询live主办人的id列表
conn.select(SELECT_SQL, cb)

async function cb(res) {
  // res为RowDataPacket数组，取出其中的hostId字段
  idList = res.map(item => item.id)
  console.log(`共${idList.length}个举办者`)

  // 循环id列表爬取每个用户数据, 延时发请求，避免请求过快流量异常导致403
  for (let i = 0; i < idList.length; i++) {
    let id = idList[i]
    let count = 0
    options.path = `/people/${id}/collections_v2?limit=20&offset=0`

    // await sleep(1000)
    // console.log('sleep 1000ms')
    reqFav((favCount) => {
      save2db(favCount, id)
    }, count)
  }
} 

function reqFav(callback, count) {
  let favCount = count
  const req = https.request(options, (res) => {
    if (res.statusCode !== 200) {
      console.log(`接口返回错误, 状态码：${res.statusCode}，${req.path}`)
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
        body = { data: [] }
        console.log(error)
      }

      favCount += getFavDetails(body)

      // 递归爬取
      let page = body.paging || {}
      if (page.is_end || body.data.length < 20) {
        // 全部爬取完成后执行callback
        callback(favCount)
      } else if (page.next) {
        // 还有下一页的话继续请求
        options.path = page.next.replace('https://api.zhihu.com', '')
        reqFav(callback, favCount)
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

function save2db(favCount, id) {
  let closeCb = () => console.log(`数据插入成功，${id}，${favCount}`)
  // 接口返回时间不一致，如何保证在最后一条插入完成后关闭连接呢？

  // 插入到数据库中
  try {
    conn.insert(UPDATE_SQL, [favCount, id], closeCb)
  } catch (error) {
    console.log(`数据插入失败：${error}`)
  }
}
