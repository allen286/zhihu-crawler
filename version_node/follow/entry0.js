const conn = require('../user/connDB')
const req = require("./request")

const SELECT_SQL = `SELECT DISTINCT hostId FROM zhihudata.hostids where hostId not in (SELECT DISTINCT hostId FROM zhihudata.follow);`
const TIME_OUT = 200
let idList = []
let errNum = 0
let successNum = 0
let count = 0
let total = 0

// 建立数据库连接
conn.open()

// 查询live主办人的id列表
conn.select(SELECT_SQL, cb)

function cb(res) {
  idList = res.map(item => item.hostId)
  console.log(`共计${idList.length}个用户`)

  // 请求用户动态数据
  toNext()
}

function handleResData(res) {
  total += res.length
  console.log(`第${count}次数据接收完毕, 此次收到${res.length}条数据，总计${total}条数据`)
  if (res.length === 0) {
    return toNext()
  }
  conn.insert('insert into zhihudata.follow (hostId, followingId, followingName) VALUES ?', [res], (result, err) => {
    // if (err) throw err
    if (err) {
      console.log(`数据插入失败${++errNum}`)
      console.log(err)
      // throw err
    } else {
      console.log(`数据插入成功${++successNum}`, result.affectedRows)
    }
    toNext()
  }) 
}

function toNext() {
  let id = idList.pop()
  // let id = '885864cd2ba3fb91eb653a83c1392c73'
  id && setTimeout(() => {
    console.log(`sleep ${TIME_OUT}ms, count: ${++count}`)
    // 获取接口数据
    req.sendReq(handleResData, id)
  }, TIME_OUT)
}
