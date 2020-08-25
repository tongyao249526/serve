var express = require('express')
var router = express.Router();
var mongoose = require('mongoose')
var Goods = require('../models/goods')
var User = require('../models/user')
//连接mongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/dumall')
mongoose.connection.on("connected",function(){
    console.log('连接成功')
})
mongoose.connection.on("error",function(){
    console.log('连接失败')
})
mongoose.connection.on("disconnected",function(){
    console.log('连接断开')
})
//查询商品列表
router.get('/',(req,res,next)=>{
    // res.send('恭喜你')
    //req.param express获得get请求传过来的参数（req.url是node原生获得个体请求参数的方式）
    let page = parseInt(req.param('page'))
    let pageSize = parseInt(req.param('pageSize'))
    let priceLevel = req.param('priceLevel')
    let params = {}
    let priceGt = ''  
    let priceLte = ''
    if(priceLevel !== 'all'){
        switch(priceLevel){
            case '0':priceGt = 0, priceLte=100;break;
            case '1':priceGt = 100, priceLte=500;break;
            case '2':priceGt = 500, priceLte=1000;break;
            case '3':priceGt = 1000, priceLte=5000;break;
        }
        params = {
            salePrice:{
                $gt: priceGt,
                $lte: priceLte
            }
        }
    }
    let sort = req.param('sort')
    let skip = (page - 1)*pageSize
    let goodsModel = Goods.find(params)
    let total = ''
    Goods.find(params,(err,doc)=>{
        if(err){
            total = 1
        }else{
            total = doc.length
        }
    })
    //skip() 跳过多少条，limit() 获取多少条
    goodsModel.sort({'salePrice':sort}).skip(skip).limit(pageSize)
    goodsModel.exec((err,doc)=>{
        if(err){
            res.json({
                status:'1',
                msg:err.message
            })
        }else{
            res.json({
                status:'0',
                msg:'',
                result:{
                    count: doc.length,
                    list:doc,
                    total: total
                }
            })
        }
    })
})
//加入购物车
router.post('/addCart',(req,res,next)=>{
    let userId = req.cookies.userId
    let productId = req.body.productId // post请求取参
    User.findOne({userId:userId},(err,userDoc)=>{
        if(err){
            res.json({
                status:'1',
                msg:err.message
            })
        }else{
            console.log(userDoc.cartList)
            if(userDoc){
                let goodsItem = ''
                userDoc.cartList.forEach((item)=>{
                    if(item.productId === productId){
                        goodsItem = item
                        item.productNum++
                    }
                })
                if(goodsItem){//购物车里面存在这个商品
                    userDoc.save((err2,doc2)=>{
                        if(err2){
                            res.json({
                                status:'1',
                                msg:err2.message
                            })
                        }else{
                            res.json({
                                status:'0',
                                msg:'',
                                result:'success'
                            })
                        }
                    })
                }else{//购物车里面不存在这个商品（将商品的基本信息从goods集合中拿出来）
                    Goods.findOne({productId:productId},(err,doc)=>{
                        if(err){
                            res.json({
                                status:'1',
                                msg:err.message
                            })
                        }else{
                            if(doc){
                                doc.productNum = 1
                                doc.checked = 1
                                userDoc.cartList.push(doc)
                                userDoc.save((err2,doc2)=>{
                                    if(err2){
                                        res.json({
                                            status:'1',
                                            msg:err2.message
                                        })
                                    }else{
                                        res.json({
                                            status:'0',
                                            msg:'',
                                            result:'success'
                                        })
                                    }
                                })
                            }
                        }
                    })
                }
                
            }
        }
    })
})
module.exports = router