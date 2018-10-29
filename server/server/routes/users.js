var express = require('express');
var router = express.Router();
var user=require('../models/user')
var mongoose=require("mongoose")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login',function (req,res,next) {
    let param={
      userName:req.body.userName,
      userPwd:req.body.userPwd
    }
  user.findOne(param,function(err,doc){
      if(err){
        res.json({
          status:1,
          msg:err.message
        })
      }else {
           res.cookie("userId",doc.userId,{
             path:'/',
             maxAge:1000*60*60
           })
        res.cookie("userName",doc.userName,{
          path:'/',
          maxAge:1000*60*60
        })
           // req.session.user=doc
           res.json({
             status:0,
             msg:'',
             result:{
               userName:doc.userName
             }
           })
      }
    })
})

router.post("/logout",function (req,res,next) {
  res.cookie("userId","",{
    path:'/',
    maxAge:-1
  })
  res.json({
    status:0,
    msg:'',
    result:''
  })
})

router.get('/checkLogin',(req,res,next)=>{
  if(req.cookies.userId){
    res.json({
      status:'0',
      msg:'',
      result:req.cookies.userName
    })
  }else{
    res.json({
      status:'1',
      msg:'未登录',
      result:''
    })
  }
})

router.get('/cartList',(req,res,next)=>{
  let userId=req.cookies.userId
  user.findOne({userId},function (err,doc) {
    if(err){
      res.json({
        status:1,
        msg:err.message
      })
    }else {
      if(doc) {
        res.json({
          status:'0',
          msg:'',
          result:doc.cartList
        })
      }
    }
  })
})

router.post("/cartDel",function (req,res,next) {
  let userId=req.cookies.userId
  let productId=req.body.productId
  user.updata(
    {userId},
    {$pull:{
      'cartList':{
        'productId':productId
       }},
    function(err,doc){
      if (err){
          res.json({
            status:1,
            msg:err.message,
            result:''
          })
      }else {
        res.json({
          status:0,
          msg:'',
          result:'suc'
        })
      }
    }})
})

router.post('/cartEdit',function (req,res,next) {
  let userId=req.cookies.userId
  let productId=req.body.productId
  let productNum=req.body.productNum
  let checked=req.body.checked
  user.update({userId,"cartList.productId":productId},{
    "cartList.$.productNum":productNum,
    "cartList.$.checked":checked
  },function (err,doc) {
    if (err){
      res.json({
        status:1,
        msg:err.message,
        result:''
      })
    }else{
      res.json({
        status:0,
        msg:'',
        result:'suc'
      })
    }
  })
})
router.post('/editCheckAll',(req,res,next)=>{
  let userId=req.cookies.userId
  let checkAll=req.body.checkAll?'1':'0'
  user.findOne({userId},(err,user)=>{
    if (err){
      res.json({
        status:1,
        msg:err.message,
        result:''
      })
    }else{
      if(user){
        user.cartList.forEach((item)=>{
          item.check=checkAll
        })
        user.save((err1,doc)=>{
         if(err1){
          res.json({
            status:1,
            msg:err1.message,
            result:''
          })
         }else{
           res.json({
            status:0,
            msg:'',
            result:'suc'
           })
         }
        })
      }
    }
  })
})
router.get('/addressList',(req,res,next)=>{
  let userId=req.cookies.userId
  user.findOne({userId},(err,doc)=>{
    if (err){
      res.json({
        status:1,
        msg:err.message,
        result:''
      })
    }else{
      if(doc){
        res.json({
          status:'0',
          msg:'',
          result:doc.addressList
        })
      }
    }
  })
})
router.post('/setDefault',(req,res,next)=>{
  let userId=req.cookies.userId
  let addressId=req.body.addressId
  user.findOne({userId},(err,doc)=>{
    if (err){
      res.json({
        status:1,
        msg:err.message,
        result:''
      })
    }else{
      let addressList=doc.addressList
      addressList.forEach((item)=>{
       if(item.addressId==addressId){
         item.isDefault=true
       }else{
        item.isDefault=false
       }
      })
      doc.save(function(err,doc){
        if(err){
          res.json({
            status:1,
            msg:err.message,
            result:''
          })
        }else{
          res.json({
            status:0,
            msg:'',
            result:''
          })
        }
      })

    }
  })
})
router.post("/delAddress",(req,res,next)=>{
  let userId=req.cookies.userId
  let addressId=req.body.addressId
  user.update({userId},{$pull:{
    'addressId':addressId
  }},(err,doc)=>{
    if(err){
      res.json({
        status:1,
        msg:err.message,
        result:''
      })
    }else{
      res.json({
        status:1
      })
    }
  })
})
module.exports = router;
