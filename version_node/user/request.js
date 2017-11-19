// 获取用户动态，从中提取出送出赞同数
// 不再用node自带的https模块，改用request包
const request = require('request')
const domain = require('domain')
const iconv = require('iconv-lite')
const Promise = require('bluebird')
const conn = require('./connDB')
const options = require('./options')

const USER_TABLE = 'zhihu_live.user_detail'
const SELECT_SQL = `SELECT DISTINCT id FROM ${USER_TABLE} WHERE give_voteup_count is null;`
const UPDATE_SQL = `UPDATE ${USER_TABLE} SET give_voteup_count = ? WHERE id = ?`
const TIME_OUT = 1000
const seqIndex = 0
let idList = []
let proxyList = []

// 设置初始代理地址
options.proxy = 'http://188.166.204.221:8118'

// 建立数据库连接
conn.open()

// 查询live主办人的id列表
conn.select(SELECT_SQL, cb)

function cb(res) {
  idList = res.map(item => item.id)
  console.log(`共${idList.length}个用户`)

  getProxyList().then((proxys) => {
    proxyList = proxys
    chooseIp(proxyList)
  }).catch(e => {
    console.log(e)
  })
}

async function chooseIp(proxyList) {
  let count = 0
  let id = idList.shift()
  let proxyurl = proxyList.shift()
  let targetOptions = Object.assign({}, options)
  const d = domain.create()

  d.on('error', (err) => {
    console.error('Error caught by domain: ', err)
  })

  proxyList.push(proxyurl) // 循环利用代理ip

  targetOptions.proxy = 'http://' + proxyurl
  targetOptions.uri = `https://api.zhihu.com/people/${id}/activities?limit=10&after_id=${parseInt(new Date().getTime() / 1000)}&desktop=True`

  // await sleep(TIME_OUT)
  // console.log(`sleep ${TIME_OUT}ms`)

  d.run(() => {
    console.log(`切换proxy: ${proxyurl}`)
    sendReq(actCount => save2db(actCount, id), count, targetOptions)
  })
}

function sendReq(callback, count, targetOptions) {
  request(targetOptions, (err, res, body) => {
    if (err) {
      console.log(err)
      // 继续请求？
      return
    }
    if (res.statusCode !== 200) {
      console.log(`接口请求出错，状态码：${res.statusCode}，${req.path}`)
      return
    }
    console.log(`${req.path}，状态码${res.statusCode}`)

    try {
      body = JSON.parse(body)
    } catch (error) {
      body = {}
      console.log(error)
    }

    let data = body.data || [] // 对象数组
    data && data.forEach(act => {
      if (act.verb === 'ANSWER_VOTE_UP') {
        count += 1
      }
    })

    let page = body.paging || {}
    if (page.is_end) {
      // 全部爬取完成后执行callback
      callback(count)
    } else if (page.next) {
      // 还有下一页的话继续请求
      setTimeout(() => {
        console.log(`sleep ${TIME_OUT}ms, count: ${count}`)
        targetOptions.uri = page.next
        sendReq(callback, count, targetOptions)
      }, TIME_OUT)
    }
  })
}

function save2db(actCount, id) {
  // 插入到数据库中
  try {
    conn.insert(UPDATE_SQL, [actCount, id], () => console.log(`第${++seqIndex}条数据插入成功，id: ${id}, count: ${actCount}`))
  } catch (error) {
    console.log(`第${++seqIndex}条数据插入失败：${error}，id: ${id}`)
  }

  if (idList.length > 0) {
    chooseIp(proxyList)
  } else {
    console.log('数据爬取完成')
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function getProxyList() {
  const apiURL = 'http://www.66ip.cn/mo.php?sxb=&tqsl=100&port=&export=&ktip=&sxa=&submit=%CC%E1++%C8%A1&textarea=http%3A%2F%2Fwww.66ip.cn%2F%3Fsxb%3D%26tqsl%3D100%26ports%255B%255D2%3D%26ktip%3D%26sxa%3D%26radio%3Dradio%26submit%3D%25CC%25E1%2B%2B%25C8%25A1'

  return new Promise((resolve, reject) => {
    const ipOptions = {
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

    request(ipOptions, (error, res, body) => {
      try {
        if (error) throw error
        console.log(body)

        if (/meta.*charset=gb2312/.test(body)) {
          body = iconv.decode(body, 'gbk')
        }

        const ret = body.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,4}/g)

        resolve(ret)
      } catch (e) {
        return reject(e)
      }
    })
  })
}
