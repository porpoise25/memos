var mongoose = require('mongoose');
// スキーマ定義
var Memo = new mongoose.Schema({
    content:String,
    createdDate:Date
  });
  // モデルとして登録
module.exports = mongoose.model('Memo', Memo);