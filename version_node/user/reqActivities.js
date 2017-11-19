// 获取用户动态，此处只抽取了用户送出赞同数据
const https = require('https')
const conn = require('./connDB')
const options = require('./options')

const USER_TABLE = 'zhihu_live.live_ended_hosts'
const SELECT_SQL = `SELECT DISTINCT id FROM ${USER_TABLE} WHERE give_voteup_count is null;`
const UPDATE_SQL = `UPDATE ${USER_TABLE} SET give_voteup_count = ? WHERE id = ?`
const TIME_OUT = 2000
let seqIndex = 0
let idList = []

// 建立数据库连接
conn.open()

// 查询live主办人的id列表
conn.select(SELECT_SQL, cb)

function cb(res) {
  idList = res.map(item => item.id)
  console.log(`共计${idList.length}个用户`)

  // 请求用户动态数据
  let count = 0
  let id = idList.shift()

  setTimeout(() => {
    console.log(`sleep ${TIME_OUT}ms, count: ${count}`)
    options.path = `/people/${id}/activities?limit=10&after_id=${parseInt(new Date().getTime() / 1000)}&desktop=True`
    sendReq(actCount => save2db(actCount, id), count)
  }, TIME_OUT)
}

function sendReq(callback, count) {
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
        if (act.verb === 'ANSWER_VOTE_UP') {
          count += 1
        }
      })

      let page = body.paging || {}
      if (page.is_end) {
        // 全部爬取完成后执行callback
        callback(count)
      } else if (page.next) {
        // 还有下一页的话继续请求
        setTimeout(() => {
          console.log(`sleep ${TIME_OUT}ms, count: ${count}`)
          options.path = page.next.replace('https://api.zhihu.com', '')
          sendReq(callback, count)
        }, TIME_OUT)
      }
    })
  })

  req.on('error', (e) => {
    console.error(e)
    sendReq(callback, count)
  })
  
  req.end()
}

function save2db(actCount, id) {
  // 插入到数据库中
  try {
    conn.insert(UPDATE_SQL, [actCount, id], () => console.log(`第${++seqIndex}条数据插入成功，id: ${id}, count: ${actCount}`))
  } catch (error) {
    console.log(`第${++seqIndex}条数据插入失败：${error}，id: ${id}`)
  }

  if (idList.length > 0) {
    let count = 0
    let id = idList.shift()

    options.path = `/people/${id}/activities?limit=10&after_id=${parseInt(new Date().getTime() / 1000)}&desktop=True`
    sendReq(actCount => save2db(actCount, id), count)
  } else {
    console.log('数据爬取完成')
  }
}
