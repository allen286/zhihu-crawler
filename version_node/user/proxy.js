var domain = require('domain');
var request = require('request')
var iconv = require('iconv-lite')
var Promise = require('bluebird')
var options = require('./options')

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


getProxyList()
  .then(function (proxyList) {
    proxyList.forEach(function (proxyurl) {
      console.log(`proxy：${proxyurl}`)

      targetOptions = Object.assign({}, options)
      targetOptions.proxy = 'http://' + proxyurl
      targetOptions.uri = 'https://api.zhihu.com/people/75251b2a1356728b4e2b990ccee252d2'

      var d = domain.create()
      d.on('error', function (err) {
        console.error('Error caught by domain: ', err)
      })
      d.run(() => {
        request(targetOptions, function (error, response, body) {
          try {
            if (error) throw error

            body = body.toString()
            // console.log(body)
            eval(`var ret = ${body}`)

            if (ret) {
              console.log(`验证成功==>> ${proxyurl}`)
            }
          } catch (e) {
            console.error(e)
          }
        })
      })

    })

  }).catch(e => {
    console.log(e)
  })

process.on('uncaughtException', function (er) {
  console.error("process.on('uncaughtException')", er);
})
