var express = require('express');
var router = express.Router();
var User = require('../models/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/login', function(req, res, next) {
  let param = {
    userName:req.body.userName,
    userPwd:req.body.userPwd
  }
  console.log('param',param)
  User.findOne(param,(err,doc)=>{
    if(err){
      res.json({
          status:'1',
          msg:err.message
      })
    }else{
      if(doc){
        //cookie存放
        res.cookie('userId',doc.userId,{
          path:'/',
          maxAge:1000*60*60
        })
        res.cookie('userName',doc.userName,{
          path:'/',
          maxAge:1000*60*60
        })
        //session存放
        // req.session.user = doc
        res.json({
            status:'0',
            msg:'',
            result:{
              userName:doc.userName
            }
        })
      }else{
        res.json({
            status:'0',
            msg:'',
            result:doc
        })
      }
      
    }
  })
});

// 登出接口
router.post('/logout',(req,res,next)=>{
  res.cookie('userId','',{
    path:'/',
    maxAge:-1
  })
  res.json({
    status:'0',
    msg:'',
    result:''
  })
})
 
//是否已经登陆
router.get('/checkLogin',(req,res,next)=>{
  if(req.cookies.userId){
    res.json({
      status:'0',
      msg:'',
      result: req.cookies.userName
    })
  }else{
    res.json({
      status:'1',
      msg:'未登陆',
      result:''
    })
  }
})

//购物车
router.get('/cartList',(req,res,next)=>{
  User.findOne({userId:req.cookies.userId},(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      if(doc){
        res.json({
          status:'0',
          msg:'',
          result:doc.cartList
        })
      }
    }
  })
})
//删除购物车中的某一项
router.post('/deleteProduct',(req,res,next)=>{
  User.update({userId:req.cookies.userId},{$pull:{'cartList':{'productId':req.body.productId}}},(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      if(doc){
        res.json({
          status:'0',
          msg:'',
          result: 'success'
        })
      }
    }
  }); 
})
//购物车数量增减
router.post('/cartEdit',(req,res,next)=>{
  User.update({userId:req.cookies.userId,'cartList.productId':req.body.productId},{'cartList.$.productNum':req.body.productNum},(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      if(doc){
        res.json({
          status:'0',
          msg:'',
          result: 'success'
        })
      }
    }
  })
})
module.exports = router;
