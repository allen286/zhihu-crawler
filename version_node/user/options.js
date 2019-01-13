const cookieLogin = `__DAYU_PP=iUEUUZuYmVNEFqfi62Vaffffffff924cdd19bfbf; _zap=88af3f9b-12a7-436c-8ec5-704bddaf5a00; __utma=51854390.26288509.1530457053.1530457053.1530457053.1; __utmv=51854390.100-1|2=registration_date=20130626=1^3=entry_date=20130626=1; z_c0="2|1:0|10:1535989933|4:z_c0|92:Mi4xRTJnUEFBQUFBQUFBZ0VEcE9FU3VDU1lBQUFCZ0FsVk5yYVo2WEFDcHFSR1lTWmhSOWhHYmJoQk9VZG5OWndaREx3|028df745cb2974fe8a1ff3522191ed9cc4609e39690dbee37d7c48e1487744ef"; q_c1=780a481fb0f24629822b42a84f80cc6b|1535989933000|1464317015000; _xsrf=GL6LRLM3mCgjJi0pDHUX6hlLZn7XUszc; tst=r; tgw_l7_route=f2979fdd289e2265b2f12e4f4a478330; d_c0="AIBA6ThErgmPTh4hnJf153U2A4vEDIFwfdQ=|1459093649"`
const auth = 'Bearer Mi4xRU1FNEJnQUFBQUFBZ0VEcE9FU3VDUmNBQUFCaEFsVk51MVQ1V2dDNnJzd0RObHE4aEZSQmM1TVRua3VZUldzS01R|1510737595|0ce28109685dd772c20756f406e0f89a23d53b48'

const options = {
  host: 'api.zhihu.com',
  port: 443,
  // path: '',
  method: 'GET',
  timeout: 15000,
  headers: {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    // 'Accept-Language': 'zh-CN,zh;q=0.9',
    // 'Accept-Encoding': 'gzip, deflate, br',
    // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    // 'Origin': 'https://www.zhihu.com',
    // 'Authorization': auth,
    'Cookie': cookieLogin,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': 1,
    // 'x-api-version': '3.0.40',
    // 'x-udid': 'AIBA6ThErgmPTh4hnJf153U2A4vEDIFwfdQ=',
  }
}

module.exports = options
