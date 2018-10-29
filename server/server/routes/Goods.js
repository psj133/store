var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var goods = require('../models/goods')
var user=require('../models/user')

mongoose.connect('mongodb://localhost/store',{useMongoClient:true})
mongoose.connection.on("connected",function () {
  console.log("connect success")
})
mongoose.connection.on("error",function () {
  console.log('connect error')
})
mongoose.connection.on("disconnected",function () {
  console.log("disconnected")
})
router.get("/list",function (req,res,next) {
  let page = parseInt(req.param('page'))
  let pageSize = parseInt(req.param("pageSize"))
  let priceLevel = req.param('priceChecked')
  let sort = req.param("sort")
  let skip = (page-1)*pageSize
  let params ={}
  let priceGt='',priceLte=''
  if(priceLevel==='all') {
  }else {
    switch (priceLevel) {
      case '0':
        priceGt = 0;
        priceLte = 100;
        break
      case '1':
        priceGt = 100;
        priceLte = 500;
        break
      case '2':
        priceGt = 500;
        priceLte = 1000;
        break
      case '3':
        priceGt = 1000;
        priceLte = 5000;
        break
    }
    params={
      salePrice:{
        $gt:priceGt,
        $lte:priceLte
      }
    }
  }
  let goodmodel = goods.find(params).skip(skip).limit(pageSize)
  goodmodel.sort({'salePrice':sort})
    goodmodel.exec(function (err,doc) {
      if(err){
        res.json({
          status:'1',
          message:'error'
        })
      }else {
        res.json({
          status:'0',
          message:'',
          result:{
            count:doc.length,
            list:doc
          }
        })
      }
    })
})
//加入购物车
router.post("/addCart",function (req,res,next) {
  let userId='100000077'
  let productId=req.body.productId
  user.findOne({userId},function (err,userdoc) {
    if(err){
      res.json({
        status:1,
        msg:err.message
      })
    }else {
      if(userdoc){
        let productItem=""
        userdoc.cartList.forEach((item)=>{
          if(item.productId===productId){
            productItem=item
            item.productNum+=1
          }
        })
        if(productItem){
          userdoc.save(function (err,doc) {
            if(err){
              res.json({
                status:1,
                msg:err.message
              })
            }else{
              res.json({
                status:0,
                msg:'',
                result:'suc'

              })
            }
          })
        }else {
          goods.findOne({productId},function (err,doc) {
            if(err){
              res.json({
                status:1,
                msg:err.message
              })
            }else {
              if(doc){
                doc.productNum=1
                doc.checked=1
                console.log(doc)
                console.log("11")
                userdoc.cartList.push(doc)
                userdoc.save(function (err,doc) {
                  if(err){
                    res.json({
                      status:1,
                      msg:err.message
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
        }
      }
    }

  })

})
module.exports=router
