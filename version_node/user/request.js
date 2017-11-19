// 获取收藏答案数目
// 不再用node自带的https模块，改用request包
const request = require('request')
const domain = require('domain')
const iconv = require('iconv-lite')
const Promise = require('bluebird')
const conn = require('./connDB')
const options = require('./options')

const USER_TABLE = 'zhihu_live.user_detail'

// 设置代理地址
options.proxy = 'http://188.166.204.221:8118'

// 建立数据库连接
conn.open()

let idList = []
const SELECT_SQL = `SELECT DISTINCT id FROM ${USER_TABLE} WHERE favorite_answer_count is null;`

// 查询live主办人的id列表
conn.select(SELECT_SQL, cb)

async function cb(res) {
  // res为RowDataPacket数组，取出其中的hostId字段
  idList = res.map(item => item.id)
  console.log(`共${idList.length}个举办者`)

  var d = domain.create()
  d.on('error', function (err) {
    console.error('Error caught by domain: ', err)
  })

  // 循环id列表爬取每个用户数据, 延时发请求，避免请求过快流量异常导致403

  getProxyList().then(function (proxyList) {
    let index = 0
    // while (idList.length > 0) {
    while (index < 2000) {
      index += 1
      let proxyurl = proxyList.shift()
      proxyList.push(proxyurl)
      console.log(`${index}, proxy: ${proxyurl}`)

      let d = domain.create()
      d.on('error', function (err) {
        console.error('Error caught by domain: ', err)
      })

      // 循环id列表爬取每个用户数据, 延时发请求，避免请求过快流量异常导致403
      let id = idList.shift()

      let targetOptions = Object.assign({}, options)
      targetOptions.proxy = 'http://' + proxyurl
      targetOptions.uri = `https://api.zhihu.com/people/${id}/collections_v2?limit=100&offset=0`

      // await sleep(1000)
      // console.log('sleep 1000ms')
      d.run(() => {
        request(targetOptions, (err, res, body) => {
          if (err) {
            console.log(err)
            return
          }
          if (res.statusCode !== 200) {
            console.log(`${id}/collections_v2接口返回错误, 状态码：${res.statusCode}`)
            return
          }
          console.log(`${id}, 状态码：${res.statusCode}`)

          try {
            body = JSON.parse(body)
          } catch (error) {
            body = {}
            console.log(error)
          }

          const UPDATE_SQL = `UPDATE ${USER_TABLE} SET favorite_answer_count = ? WHERE id = ?`
          let favData = getFavDetails(body)
          let closeCb = () => console.log(`第${index + 1}条数据插入成功，${favData}`)
          // 接口返回时间不一致，如何保证在最后一条插入完成后关闭连接呢？
          // if (index === idList.length - 1) closeCb = closeWhenLast

          // 插入到数据库中
          try {
            conn.insert(UPDATE_SQL, [favData, id], closeCb)
          } catch (error) {
            console.log(`第${index + 1}条数据插入失败：${error}`)
          }

        })
      })

    }
  }).catch(e => {
    console.log(e)
  })

}

function reqFav(id, index) {

}

function closeWhenLast() {
  conn.close()
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function getFavDetails(fav) {
  let result = 0
  if (fav.data && fav.data.length > 0) {
    fav.data.forEach(item => result += (item.answer_count || 0))
  }
  return result
}

process.on('uncaughtException', function (er) {
  console.error("process.on('uncaughtException')", er);
})

function getProxyList() {
  var apiURL = 'http://www.66ip.cn/mo.php?sxb=&tqsl=100&port=&export=&ktip=&sxa=&submit=%CC%E1++%C8%A1&textarea=http%3A%2F%2Fwww.66ip.cn%2F%3Fsxb%3D%26tqsl%3D100%26ports%255B%255D2%3D%26ktip%3D%26sxa%3D%26radio%3Dradio%26submit%3D%25CC%25E1%2B%2B%25C8%25A1'

  return new Promise((resolve, reject) => {
    var ipOptions = {
      method: 'GET',
      url: apiURL,
      gzip: true,
      encoding: null,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xmlq=0.9,image/webp,*/*q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zhq=0.8,enq=0.6,zh-TWq=0.4',
        'User-Agent': 'Mozilla/8.0 (Windows NT 6.1 WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36',
        'referer': 'http://www.66ip.cn/'
      },

    }

    request(ipOptions, function (error, res, body) {
      try {
        if (error) throw error
        console.log(body)

        if (/meta.*charset=gb2312/.test(body)) {
          body = iconv.decode(body, 'gbk')
        }

        var ret = body.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,4}/g)

        resolve(ret)
      } catch (e) {
        return reject(e)
      }
    })

  })
}