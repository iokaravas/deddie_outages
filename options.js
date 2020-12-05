require('dotenv').config()

const options = {
  interval: 30, // minutes
  notify: false, // default option
  dataFile: __dirname + '/.outages.json',
  csvFile: __dirname + '/prefs.munics.csv',
  pushover: {
    user: process.env.PUSHOVER_USER,
    token: process.env.PUSHOVER_TOKEN,
    message: {
      suffix: process.env.PUSHOVER_SUFFIX,
      html: 1,
      sound: process.env.PUSHOVER_SOUND,
      device: process.env.PUSHOVER_DEVICE
    }
  }
}

options.requestOptions = (prefectureID,municipalityID) => ({
  'headers': {
    'accept': '*/*',
      'accept-language': 'en-US,en;q=0.9,el;q=0.8',
      'cache-control': 'no-cache',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'pragma': 'no-cache',
      'sec-ch-ua': '\'Chromium\';v=\'86\', \'\\\'Not\\\\A;Brand\';v=\'99\', \'Google Chrome\';v=\'86\'',
      'sec-ch-ua-mobile': '?0',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'x-requested-with': 'XMLHttpRequest',
  },
  'referrer': 'https://siteapps.deddie.gr/outages2public',
    'referrerPolicy': 'strict-origin-when-cross-origin',
    'body': `PrefectureID=${prefectureID}&MunicipalityID=${municipalityID}&X-Requested-With=XMLHttpRequest`,
    'method': 'POST',
    'mode': 'cors'
})

module.exports = options
