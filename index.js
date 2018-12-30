'use strict;'
const http = require('http');
const ejs = require('ejs');
var fs = require('fs');
var qs = require('querystring');
//ファイルの読み込み
var template = fs.readFileSync(__dirname + '/index.ejs', 'utf-8');
const style = fs.readFileSync(__dirname + '/css/common.css', 'utf-8');
//グローバル変数
var posts = [];
var msg = '';

/**
 * ejsでメモリストを作る関数
 */
function renderList(posts, res) {
    var data = ejs.render(template, {
        posts: posts,
        msg : msg,
    });
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.write(data);
    res.end();
}

/**
 * サーバーの作成
 */
const server = http.createServer((req,res) => {
    //cssの読み込み
    switch(req.url){
        case '/css/common.css':
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.write(style);   
            break;
    }
    //保存ボタンが押されたとき
    if (req.method === 'POST') {
        req.data = '';
        //フォームデータ受信
        req.on('readable', function() {
            req.data += req.read() || '';
            console.log(req.data);
        });
        req.on('end', function() {
            var query = qs.parse(req.data);
            console.log(query);
            //メモ表示:文字入力がないときは表示しない
            if(query.memo){
                msg = '';
                posts.push(query.memo);
            }else{
                msg = '文字が入力されていません'
            }
            renderList(posts,res);
        });
    } else {
        renderList(posts, res);
    }
})
/**
 *　サーバーを起動
 */
const port = 8000;
server.listen(process.env.PORT || port,() => {
    console.log('Listening on ' + port);
})