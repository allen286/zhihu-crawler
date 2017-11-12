const mysql = require('mysql')

//创建连接  
const client = mysql.createConnection({
  user: 'root',
  password: 'root',
  database: 'zhihu_live'
})

const main = {
  open: () => {
    client.connect()
  },
  insert: (table, row, cb) => {
    client.query(`insert into ${table} set ?`, row, (err, result) => {
      if (err) {
        throw err
      } else {
        // console.log(result)
        cb && cb(result)
      }
    })
  },
  select: (table, sql, cb) => {
    client.query(sql, (err, results, fields) => {
      if (err) {
        throw err
      } else {
        // console.log(results)
        cb && cb(results)
      }
    })
  },
  close: () => client.end()
}

module.exports = main
