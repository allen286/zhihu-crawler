const https = require('https')
const getLive = require('./getLiveDetails')

const api = {
  ended: '/lives/ended?limit=100&offset=0', // 已举办的live，4929场
  ongoing: '/lives/ongoing?limit=100&offset=0' // 尚未举办的live，157场
}
const cookieLogin = '_zap=8d95cd83-04a6-4dfd-af71-190b1dac66e2; _ga=GA1.2.1516918544.1463121703; l_cap_id="N2E1MTIzYTg4YTc4NDliM2EzZTI0OTFjOWQ4ODcwNzQ=|1508144961|97b922146c87503acb387ef71860f12500a3c422"; r_cap_id="NGVkNzdmYmVmMWUwNGIzMWE5MDQwNzg2Y2Q1NDhmOTM=|1508144961|dcf06fc5230597bc8f039b8c1be8c464fcb7546c"; cap_id="Y2VjNzc4YTJlNDFiNDQxNzlmNzc0NTZkOWJhMmZlM2I=|1508144961|2079889f55fdbcf7dd535345f50e94943933b171"; z_c0=Mi4xRU1FNEJnQUFBQUFBZ0VEcE9FU3VDUmNBQUFCaEFsVk44d1FNV2dCTFlkcVJkZ2VJRnhkMHRRQnFNUlk1SXJhblVR|1508145139|5e7e7a7ace4e60223c88108d4a72f7615970a698; q_c1=780a481fb0f24629822b42a84f80cc6b|1508468587000|1464317015000; aliyungf_tc=AQAAAOiW4HWT9A4AOEJyyo32njmK/5Ax; __utma=155987696.1516918544.1463121703.1509083392.1509083392.1; __utmc=155987696; __utmz=155987696.1509083392.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); _xsrf=eebea36b1da847708a6e47e98ab460d9; d_c0="AIBA6ThErgmPTh4hnJf153U2A4vEDIFwfdQ=|1459093649;'
const options = {
  hostname: 'api.zhihu.com',
  port: 443,
  path: api.ongoing,
  method: 'GET',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Cookie': cookieLogin
  }
}
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
        console.log(`${options.hostname + options.path}，获取${data.length}条数据，累计${liveList.length + data.length}条`)
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
