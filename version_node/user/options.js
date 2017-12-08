const cookieLogin = '_za=7d5a6c7e-9424-4b45-b741-1014d039ea60; _zap=8d95cd83-04a6-4dfd-af71-190b1dac66e2; _ga=GA1.2.1516918544.1463121703; infinity_uid="2|1:0|10:1510225746|12:infinity_uid|24:OTEyMDMzMzA2MDg4OTg0NTc2|fce14ab0c3aa92b65e841bef5e49d10d0e882dd91461f35edb3039fe9d035664"; r_cap_id="YWIwYmYwM2UwNThhNGFiYmI1NDY4MDczNTY5MGQzZTE=|1510737371|9b3af897e56477e7ee37acb56688e9aba2363830"; cap_id="ZWNmZWVmZTM3NmJlNGY2Y2IwZmY4YjY4ZjdlM2IzZjQ=|1510737371|ec318e2e0a110e19d7993a80b7cb2f9a60c3a28f"; z_c0=Mi4xRU1FNEJnQUFBQUFBZ0VEcE9FU3VDUmNBQUFCaEFsVk51MVQ1V2dDNnJzd0RObHE4aEZSQmM1TVRua3VZUldzS01R|1510737595|0ce28109685dd772c20756f406e0f89a23d53b48; q_c1=780a481fb0f24629822b42a84f80cc6b|1511097273000|1464317015000; __utma=51854390.1516918544.1463121703.1511161528.1511162743.7; __utmz=51854390.1511161528.6.6.utmcsr=zhihu.com|utmccn=(referral)|utmcmd=referral|utmcct=/; __utmv=51854390.100--|2=registration_date=20171016=1^3=entry_date=20160527=1; aliyungf_tc=AQAAAP4PL1aBtAkAOEJyym+kw6ft+YZb; _xsrf=eebea36b1da847708a6e47e98ab460d9; d_c0="AIBA6ThErgmPTh4hnJf153U2A4vEDIFwfdQ=|1459093649"; _xsrf=eebea36b1da847708a6e47e98ab460d9'
const auth = 'Bearer Mi4xRU1FNEJnQUFBQUFBZ0VEcE9FU3VDUmNBQUFCaEFsVk51MVQ1V2dDNnJzd0RObHE4aEZSQmM1TVRua3VZUldzS01R|1510737595|0ce28109685dd772c20756f406e0f89a23d53b48'

const options = {
  host: 'api.zhihu.com',
  port: 443,
  // path: '',
  method: 'GET',
  timeout: 8000,
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3',
    // 'Accept-Encoding': 'gzip, deflate',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Origin': 'https://www.zhihu.com',
    'Authorization': auth,
    'Cookie': cookieLogin,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': 1,
    'x-api-version': '3.0.40',
    'x-udid': 'AIBA6ThErgmPTh4hnJf153U2A4vEDIFwfdQ=',
  }
}

module.exports = options
