var express = require('express');
var router = express.Router();
var model=require('../model/model');
var web3 =require('web3');
var myweb=new web3(new web3.providers.HttpProvider('http://localhost:3002'));




// var ethbase = require('blockapps-js').ethbase;
// var lib=require('blockapps-js');
// var Transaction = ethbase.Transaction;
// var Int = ethbase.Int;
// var ethValue = ethbase.Units.ethValue;

// var TestRPC = require("ethereumjs-testrpc");
// var testweb=web3.setProvider(TestRPC.provider());
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/register', function(req, res, next) {

  res.render('register');
});
// router.get('/welcome',function(req,res,next){
//   var details={
//     addr:myweb.eth.coinbase,
//     value:myweb.eth.getBalance(myweb.eth.coinbase)
//   };
//   // res.render('details',{det : details});
// })
router.post('/register',function(req, res, next){
  //console.log('ok');

  //  console.log(coinbase);
    model.findOne({name:req.body.name},(err,out)=>{
     console.log(out);
       if(err)
        {
      console.log(err);
        }

      else
         if(out==null){
        var coinbase=myweb.personal.newAccount(req.body.password);
            myweb.eth.defaultAccount=coinbase;
           var mywallet = new model({
           name : req.body.name ,
           email:req.body.email,
           password:req.body.password,
           address:coinbase,
           });
            console.log(mywallet);
            mywallet.save((err,out)=>{
               if(err){
                 console.log('error');
                 }else{
                    console.log('saved'+out);
                   res.redirect('/login');
                       }
           });

         }
         else
          {
         console.log('username already exists');
         res.redirect('/register');
            }
  });
});

router.post('/login',function(req,res,next){
 model.findOne({name:req.body.username,password:req.body.password},(err,out)=>{

  //console.log(out);
    if(err)
    {
      console.log('error!!!!!!'+err);

    }
    else if(out==null){
      console.log('invalid login')
      res.render('../views/login');
    }
    else {
      //myweb3.eth.start();
      var details={
        addr : out.address,
        value :myweb.eth.getBalance(out.address),
        phrase:out.password
      };

      res.render('details',{det :details});
    }
    // var welcome={
    //   name:out.name,
    //   passwd:out.password,
    //   addr:out.address,
    //   phrasse:out.pass
    // };
    //
    //
    // res.render('welcome',{wel: welcome});
});
});
router.post('/welcome/:add/:ph',(req,res,next)=>{

    model.findOne({name:req.body.to},(err,output)=>{
     console.log(output);
      if(err)
      {
      console.log(err);
      }
    else
        if(output==null){
            console.log('username not exists');
         }
    else{
      console.log(req.params.ph);
      console.log(req.params.add);
      console.log(output.password);
        myweb.personal.unlockAccount(req.params.add,req.params.ph);
        myweb.personal.unlockAccount(output.address,output.password);
        myweb.personal.unlockAccount(myweb.eth.coinbase,"jatin");

        myweb.eth.sendTransaction({
          from:req.params.add,
          to: output.address,
          value:myweb.toWei(req.body.ether,"ether"),

        });
        // myweb.eth.sendTransaction({
        //   from:myweb.eth.coinbase,
        //   to:req.params.add,
        //   value:myweb.toWei(21000*myweb.eth.gasPrice,"ether"),
        // });
        console.log("Done");
        var info ={
        addr:  req.params.add,
        value: myweb.eth.getBalance(req.params.add)
      };
      var info1={
        addr: req.body.to,
        value:myweb.eth.getBalance(req.body.to)
      };
      res.render('account',{ myinfo:info,
      yourinfo:info1});
    }
  });
});
   //console.log(result);
   router.get('/welcome/:add/:ph',(req,res,next)=>{
     res.render('welcome');
   });
router.get('/details',(req,res,next)=>{
//  myweb.miner.start();

  res.render('details');
})
module.exports = router;
