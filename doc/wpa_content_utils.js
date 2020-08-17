const fs = require("fs")
const http = require('http')
const https = require('https')
const iconv = require('iconv-lite')
const zlib = require('zlib')

module.exports = {
  writeToJsonFile(list, fileName, mode) {
    // 打开目标文件
    return new Promise(resolve=>{
      fs.open(`/Users/jienhui/WeChatProjects/man-power-ai-wx/doc/init/mpa_content/${fileName}.json`, mode || 'w', function (err, fd) {
        // 一行行写入
        var item = null
        const listLength = list.length
        while (item = list.shift()) {
          if(list.length == 0 || list.length == listLength - 1){
            console.log(`+++whiting ${list.length} : ${item.content}`)
          }
          fs.writeFileSync(fd, JSON.stringify(item) + '\n', {
            flag: 'a'
          })
        }
        fs.close(fd, function () {
          console.log('写入文件完成')
          resolve()
        })
      })
    })
  },
  request(url, encoding, options = {}, pipe) {
    console.log(url)
    const proc = url.startsWith('https') ? https : http
    return new Promise((resolve, reject) => {
      proc.get(url, options, function (res) {
        if (encoding) {
          res.setEncoding(encoding)
        }
        var str = "";
        res.on("data", function (chunk) {
          str += chunk; //监听数据响应，拼接数据片段
        })
        res.on("end", function () {
          if (pipe) {
            pipe(str).then(result => {
              resolve(result)
            })
          } else {
            resolve(str)
          }
        })
      })
    })
  },
  iconvDecode(type) {
    return function (gzipData) {
      return Promise.resolve(iconv.decode(Buffer.from(gzipData, 'binary'), type))
    }
  },
  unGzip(gzipData) {
    return new Promise((resolve, reject) => {
      zlib.gunzip(Buffer.from(gzipData, 'binary'), (err, result) => {
        resolve(result.toString())
      })
    })
  }
}