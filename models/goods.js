var mongoose = require('mongoose')
var Schema = mongoose.Schema
var produtSchema = new Schema({
    "productId":{type:String},
    "productName":String,
    "salePrice":Number,
    "productImage":String,
    "productNum":Number,
    "checked":String
})
//Good导出的名字，goods数据库中集合的名字
module.exports = mongoose.model('Good',produtSchema,'goods')