let mongoose = require('mongoose')
let userSchema = new mongoose.Schema({
    "userId":{type:String},
    "userName":String,
    "userPwd":String,
    "orderList":Array,
    "cartList":[{
        "productId":String,
        "productName":String,
        "salePrice":String,
        "productImage":String,
        "checked":String,
        "productNum":String,
    }],//购物车
    "addressList":Array,
})
module.exports = mongoose.model('User',userSchema,'users')