'use strict;'
const http = require('http');
const ejs = require('ejs');
var fs = require('fs');
var qs = require('querystring');
var mongoose = require('mongoose');
var Memo = require('./schema/Memo');//スキーマのインポート
//var config = require('./config');

//ファイルの読み込み
var topPage = fs.readFileSync(__dirname + '/index.ejs', 'utf-8');
const style = fs.readFileSync(__dirname + '/common.css', 'utf-8');

//グローバル変数
var posts = '';
var msg = '';
var savedMemo =[];
/**
 * mongodbに接続
 */
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/memolist',{useNewUrlParser: true},
    function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('接続成功!');
        }
});
/**
 * ejsでメモリストを作る関数
 */
function renderList(res) {
    //10個までデータベースを検索する
    Memo.find({},{content:10},function(err){
        if(err){
            console.log(err);
        }else{
            console.log('検索できました');
            Memo.find({}, function(err, docs) {
                if(err)throw err;
                for (var i=0, size=docs.length; i<size; i++) {
                    savedMemo[i]=docs[i].content;
                    console.log(docs[i].content);
                }
            });
        }
    });
    var data = ejs.render(topPage, {
        savedMemo: savedMemo,
        posts:posts,
        msg : msg,
    });
    console.log(savedMemo);
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
        case '/common.css':
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
                posts = query.memo;
                //メモをデータベースに保存する
                var newMemo = new Memo({
                    content: query.memo,
                    createdDate : Date.now()
                });
                newMemo.save((err)=>{
                    if(err){
                        console.log(err);
                    }else{
                        console.log(newMemo + 'が保存されました');
                    }
                })
            }else{
                msg = '文字が入力されていません';
            }
            renderList(res);
        });
    } else {
        renderList(res);
    }
})
/**
 *　サーバーを起動
 */
const port = 8000;
server.listen(process.env.PORT || port,() => {
    console.log('Listening on ' + port);
})

