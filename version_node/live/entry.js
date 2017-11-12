const mysql = require('mysql')
const req = require("./request")

// const TABLE_NAME = 'live_ended_1107'
const TABLE_NAME = 'live_ongoing_1107'
let errNum = 0

//创建连接  
const client = mysql.createConnection({
  user: 'root',
  password: 'root',
  database: 'zhihu_live'
});
client.connect()

// 获取接口数据
req.sendReq((res) => {
  console.log(`数据接收完毕, 共收到${res.length}条数据`);
  res.forEach((row, index) => {
    client.query(`insert into ${TABLE_NAME} set ?`, row, (err, result) => {
      // if (err) throw err
      if (err) {
        errNum += 1
        console.log(`第${index + 1}条数据插入失败`)
        console.log(err)
      } else {
        // console.log(`inserted 第${index + 1}条数据`)
        // console.log(result)
      }

      if (index === res.length - 1) {
        console.log(`数据插入完成，成功${res.length - errNum}条，失败${errNum}条`)
      }
    })
  })
})
