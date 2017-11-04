const https = require('https')

const cookieLogin = '_zap=8d95cd83-04a6-4dfd-af71-190b1dac66e2; _ga=GA1.2.1516918544.1463121703; l_cap_id="N2E1MTIzYTg4YTc4NDliM2EzZTI0OTFjOWQ4ODcwNzQ=|1508144961|97b922146c87503acb387ef71860f12500a3c422"; r_cap_id="NGVkNzdmYmVmMWUwNGIzMWE5MDQwNzg2Y2Q1NDhmOTM=|1508144961|dcf06fc5230597bc8f039b8c1be8c464fcb7546c"; cap_id="Y2VjNzc4YTJlNDFiNDQxNzlmNzc0NTZkOWJhMmZlM2I=|1508144961|2079889f55fdbcf7dd535345f50e94943933b171"; z_c0=Mi4xRU1FNEJnQUFBQUFBZ0VEcE9FU3VDUmNBQUFCaEFsVk44d1FNV2dCTFlkcVJkZ2VJRnhkMHRRQnFNUlk1SXJhblVR|1508145139|5e7e7a7ace4e60223c88108d4a72f7615970a698; q_c1=780a481fb0f24629822b42a84f80cc6b|1508468587000|1464317015000; aliyungf_tc=AQAAAOiW4HWT9A4AOEJyyo32njmK/5Ax; __utma=155987696.1516918544.1463121703.1509083392.1509083392.1; __utmc=155987696; __utmz=155987696.1509083392.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); _xsrf=eebea36b1da847708a6e47e98ab460d9; d_c0="AIBA6ThErgmPTh4hnJf153U2A4vEDIFwfdQ=|1459093649;'
const options = {
  hostname: 'api.zhihu.com',
  port: 443,
  // path: '/lives/hot/monthly?limit=100&offset=0', // 本月热门live，只能获取到43条
  path: '/lives/homefeed?includes=live&limit=1000&offset=0', // 全部live，只能获取到125条
  method: 'GET',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Cookie': cookieLogin
  }
}
const liveList = []

const main = {
  sendReq: function (callback) {
    // options.path = option.path + '?' + url.split('?')[1]
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
        // if (body.paging && body.paging.is_end) {
        let data = body.data // 对象数组
        console.log(`共获得${data.length}条数据`)
        data && data.forEach((item) => {
          //全部live接口和热门live接口数据嵌套层次不一样
          if (item.live && item.object_type === 'live') item = item.live

          let newItem = {}
          newItem.id = item.id || 0
          newItem.liveName = item.subject || ''
          newItem.liveHost = (item.speaker && item.speaker.member.name) || ''
          liveList.push(newItem)
        })
        callback(liveList)

        // 还有下一页的话继续请求
        // console.log(body.paging.next)
        // }
      })
    })

    req.on('error', (e) => {
      console.error(e)
    })
    req.end()
  }
}

module.exports = main
