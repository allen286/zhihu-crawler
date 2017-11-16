const cookieLogin = '_zap=8d95cd83-04a6-4dfd-af71-190b1dac66e2; _ga=GA1.2.1516918544.1463121703; q_c1=780a481fb0f24629822b42a84f80cc6b|1508468587000|1464317015000; aliyungf_tc=AQAAAJxx3AzhHw4AOEJyyrA5MipLrL83; _alicdn_sec=5a08130e4e624f2488fc6c7370e8afa55c49d635; r_cap_id="YWIwYmYwM2UwNThhNGFiYmI1NDY4MDczNTY5MGQzZTE=|1510737371|9b3af897e56477e7ee37acb56688e9aba2363830"; cap_id="ZWNmZWVmZTM3NmJlNGY2Y2IwZmY4YjY4ZjdlM2IzZjQ=|1510737371|ec318e2e0a110e19d7993a80b7cb2f9a60c3a28f"; __utma=51854390.1516918544.1463121703.1510729107.1510737374.2; __utmb=51854390.0.10.1510737374; __utmc=51854390; __utmz=51854390.1510737374.2.2.utmcsr=zhihu.com|utmccn=(referral)|utmcmd=referral|utmcct=/account/unhuman; __utmv=51854390.000--|2=registration_date=20171016=1^3=entry_date=20160527=1; z_c0=Mi4xRU1FNEJnQUFBQUFBZ0VEcE9FU3VDUmNBQUFCaEFsVk51MVQ1V2dDNnJzd0RObHE4aEZSQmM1TVRua3VZUldzS01R|1510737595|0ce28109685dd772c20756f406e0f89a23d53b48; _xsrf=eebea36b1da847708a6e47e98ab460d9; d_c0="AIBA6ThErgmPTh4hnJf153U2A4vEDIFwfdQ=|1459093649'
const auth = 'Bearer Mi4xRU1FNEJnQUFBQUFBZ0VEcE9FU3VDUmNBQUFCaEFsVk51MVQ1V2dDNnJzd0RObHE4aEZSQmM1TVRua3VZUldzS01R|1510737595|0ce28109685dd772c20756f406e0f89a23d53b48'

const options = {
  host: 'api.zhihu.com',
  // proxy: 'http://114.215.102.168:8081',
  port: 443,
  // path: '',
  method: 'GET',
  timeout: 5000,
  headers: {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Cookie': cookieLogin,
    'authorization': auth,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36',
    'Connection': 'keep-alive',
    'X-UDID': 'AIBA6ThErgmPTh4hnJf153U2A4vEDIFwfdQ=',
    'Upgrade-Insecure-Requests': 1
  }
}

module.exports = options