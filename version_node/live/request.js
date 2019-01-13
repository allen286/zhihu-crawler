const https = require('https')
const getLive = require('./getLiveDetails')
const options = require('../user/options')

const api = {
  ended: '/lives/ended?limit=100&offset=0', // 已举办的live，4929场
  ongoing: '/lives/ongoing?limit=100&offset=0' // 尚未举办的live，157场
}
// options.path = api.ongoing
options.path = api.ended
const liveList = []

const main = {
  sendReq: function (callback) {
    const req = https.request(options, (res) => {
      console.log('状态码：', res.statusCode)
      // console.log('请求头：', JSON.stringify(res.headers))
      res.setEncoding('utf8')

      let body = ''
      res.on('data', (chunk) => {
        // console.log(`BODY: ${chunk}`)
        body += chunk
      })

      res.on('end', () => {
        body = JSON.parse(body)
        let data = body.data // 对象数组
        // console.log(`${req.path}，获取${data.length}条数据，累计${liveList.length + data.length}条`)
        data && data.forEach((item) => {
          //全部live接口和热门live接口数据嵌套层次不一样
          if (item.live && item.object_type === 'live') item = item.live

          let live = getLive(item)
          liveList.push(live)
        })

        if (body.paging.is_end) {
          // 全部爬取完成后执行callback
          callback(liveList)
        } else {
          // 还有下一页的话继续请求
          options.path = body.paging.next.replace('https://api.zhihu.com', '')
          main.sendReq(callback)
        }
      })
    })

    req.on('error', (e) => {
      console.error(e)
    })
    req.end()
  }
}

module.exports = main

// 测试
// main.sendReq(function (data) {
//   console.log(data.length)
// })
