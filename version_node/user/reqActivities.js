// 获取用户动态，此处只抽取了用户送出赞同数据
const https = require('https')
const conn = require('./connDB')
const options = require('./options')

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
    }, 5000 * i);
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
        }, 5000);
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
