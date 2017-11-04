var mysql = require('mysql');
var req = require("./request.js");

//创建连接  
var client = mysql.createConnection({
  user: 'root',
  password: 'root',
  database: 'zhihu_live'
});
client.connect();

// 获取接口数据
req.sendReq(function (result) {
  console.log('数据接收完毕');
  result.forEach((row, index) => {
    client.query('insert into live_all_1104 set ?', row, (err, result) => {
      // if (err) throw err;
      if (err) {
        console.log(`第${index + 1}条数据插入失败`);
        console.log(err);
      }

      console.log(`inserted ${index + 1}条数据`);
      console.log(row)
      // console.log(result);
      // console.log('\n');
    });
  });
});

// 查
// client.query(
//   'SELECT * FROM zhihu_live.live_all_1104'
//   function selectCb(err, results, fields) {
//     if (err) {
//       throw err;
//     }

//     if (results) {
//       for (var i = 0; i < results.length; i++) {
//         console.log("%d\t%s\t%s", results[i].id, results[i].liveName, results[i].liveHost);
//       }
//     }
//     client.end();
//   }
// );


