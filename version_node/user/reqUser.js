// 获取用户详细数据
const https = require('https')
const conn = require('./connDB')
const getUserDetails = require('./getUserDetails')
const options = require('./options')

// const ID_TABLE = 'zhihu_live.live_ended_1107'
// const USER_TABLE = 'zhihu_live.live_ended_hosts3'
const ID_TABLE = 'zhihu_live.user_list'
const USER_TABLE = 'zhihu_live.user_detail'
const INTERVAL = 1000

// 建立数据库连接
conn.open()

let idList = []
// const SELECT_SQL = `SELECT DISTINCT hostId FROM ${ID_TABLE};`
const SELECT_SQL = `select distinct id from ${ID_TABLE} where id not in(select id from ${USER_TABLE});`
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
    // await sleep(INTERVAL)
    // console.log(`sleep ${INTERVAL}ms`)
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
