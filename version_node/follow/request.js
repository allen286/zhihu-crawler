const https = require('https')
const options = require('../user/options')
// options.path = '/people/d91eedbbdc600092d7a3152b566aade7/followees?limit=20&offset=0'
let followingList = []

const main = {
  sendReq: function (callback, originId, realPath) {
    if (!realPath) {
      // 起始页面
      options.path = `/people/${originId}/followees?limit=20&offset=0`
    } else {
      options.path = realPath
    }
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
        let conMsg = `${req.path}，获取${data.length}条数据，单人累计${followingList.length + data.length}条`
        console.log(conMsg)
        data && data.forEach(item => {
          //全部live接口和热门live接口数据嵌套层次不一样
          const { id, name } = item || {}
          followingList.push([
            originId,
            id,
            name,
          ])
          // followingList.push({
          //   hostId: originId,
          //   followingId: id,
          //   followingName: name,
          // })
        })

        if (body.paging.is_end) {
          // 全部爬取完成后执行callback
          callback(followingList)
          followingList = []
        } else {
          // 还有下一页的话继续请求
          let nextPath = body.paging.next.replace('https://api.zhihu.com', '')
          main.sendReq(callback, originId, nextPath)
        }
      })
    })

    req.on('error', (e) => {
      console.error(e)
    })
    req.end()
  }
}

function GenNonDuplicateID(randomLength) {
  let idStr = Date.now().toString(36)
  idStr += Math.random().toString(36).substr(3, randomLength)
  return idStr
}

module.exports = main

// 测试
// main.sendReq(function (data) {
//   console.log(data.length)
// })
