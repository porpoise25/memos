'use strict;'
const http = require('http');
/**サーバーの作成
 * 
 */
const server = http.createServer((req,res) => {
    res.writeHead(200,{
        'Content-Type':'text/plain;charset=utf-8'
    });
    res.write('test');
    res.end();
})
/**
 *　サーバーを起動
 */
const port = 8000;
server.listen(process.env.PORT || port,() => {
    console.log('Listening on ' + port);
})