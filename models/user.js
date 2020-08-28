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
    "addressList":[{
        "addressId" : String,
        "userName" : String,
        "streetName" : String,
        "postCode" : Number,
        "tel" : Number,
        "isDefault" : Boolean
    }],
})
module.exports = mongoose.model('User',userSchema,'users')