var express = require('express');
var router = express.Router();
var User = require('../models/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//登陆
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
//购物车全选
router.post('/checkedAll',(req,res,next)=>{
  let checkedAll = req.body.checkedAll?'1':'0'
  User.findOne({userId:req.cookies.userId},(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      if(doc){
        doc.cartList.forEach((item)=>{
          item.checked = checkedAll
        })
        doc.save((err1,doc1)=>{
          if(err1){
            res.json({
              status:'1',
              msg:err.message,
              result:''
            })
          }else{
            res.json({
              status:'0',
              msg:'',
              result: 'success'
            })
          }
        })
      }
    }
  })
})
//购物车单选
router.post('/checkedOne',(req,res,next)=>{
  User.update({userId:req.cookies.userId,'cartList.productId':req.body.productId},{'cartList.$.checked':'0'},(err,doc)=>{
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
//地址列表查询
router.get('/address',(req,res,next)=>{
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
          result: doc.addressList
        })
      }
    }
  })
})
// 设置默认地址接口
router.post('/setDefault',(req,res,next)=>{
  if(!req.body.addressId){
    res.json({
      status:'1003',
      msg:'addressId is null',
      result:''
    })
  }else{
    User.findOne({userId:req.cookies.userId},(err,doc)=>{
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        })
      }else{
        if(doc){
          let addressList = doc.addressList
          addressList.forEach((item)=>{
            if(req.body.addressId === item.addressId){
              item.isDefault = true
            }else{
              item.isDefault = false
            }
          })
          doc.save((err,doc)=>{
            if(err){
              res.json({
                status:'1',
                msg:err.message,
                result:''
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
})
// 添加一个新的地址
router.post('/addAddress',(req,res,next)=>{
  let param = req.body
  User.findOne({userId:req.cookies.userId},(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      if(doc){
        doc.addressList.push(param)
        doc.save((err2,doc2)=>{
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
})
//删除一个地址
router.post('/deleteAddress',(req,res,next)=>{
  User.update({userId:req.cookies.userId},{$pull:{'addressList':{'addressId':req.body.addressId}}},(err,doc)=>{
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
