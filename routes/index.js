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
  var mywallet = new model({
    name : req.body.name ,
    email:req.body.email,
    password:req.body.password
  });
  console.log(mywallet);
mywallet.save((err,out)=>{
if(err){
  console.log('error');
}else{
  console.log('saved'+out);
}
});
  res.redirect('/login');
});

router.post('/login',function(req,res,next){
 model.findOne({name:req.body.username,password:req.body.password},(err,out)=>{
 var invalid={
   h3 : "invalid login"
 };

    if(err)
    {
      console.log('error'+err);

    }
    else if(out==null){
      console.log('invalid login')
      res.redirect('/login',{in:invalid});
    }
    else {
      console.log(out);
      res.redirect('/welcome');
    }
});
});
router.post('/welcome',(req,res,next)=>{
  //console.log('hello');
  // myweb.personal.unlockAccount(req.body.from);
  //console.log(myweb.eth.getBalance(JSON.stringify(myweb.eth.coinbase)));
 console.log(req.body.from);
 console.log(req.body.to);
console.log(req.body.ether);
console.log(myweb.toWei(req.body.ether,"ether"));
  myweb.personal.unlockAccount(myweb.eth.coinbase,"jatin");
  myweb.personal.unlockAccount(req.body.to,"shubh");
    myweb.eth.sendTransaction({
      from:req.body.from,
      to: req.body.to,
      value:myweb.toWei(req.body.ether,"ether"),

    });
    console.log("Done");
  var info ={
    addr: req.body.from,
    value: myweb.eth.getBalance(req.body.from)
  }  ;
  var info1={
    addr:req.body.to,
    value:myweb.eth.getBalance(req.body.to)
  }
  res.render('account',{ myinfo:info,
  yourinfo:info1});
  //console.log(info);

//console.log(myweb.eth.getTransaction())

  // var addressTo = req.body.to;
  // var privkeyFrom = req.body.from;
  //
  // // This statement doesn't actually send a transaction; it just sets it up.
  // var value = Transaction({"value" : ethValue(req.body.ether).in("ether")});
  //
  // value.send(privkeyFrom, addressTo).then(function(err,Result) {
  //   if(err)
  //   {
  //     console.log('insufficient balance');
  //   }
  //   else{
  //     console.log(Result);
  //     //res.render('/account',{res:Result});
  //   }
    // txResult.message is either "Success!" or an error message
    // For this transaction, the error would be about insufficient balance.
  // });

});
   //console.log(result);




router.get('/welcome',(req,res,next)=>{
  res.render('welcome');
});
router.get('/details',(req,res,next)=>{
  var details={
    addr:myweb.eth.coinbase,
    value:myweb.eth.getBalance(myweb.eth.coinbase)
  };
  res.render('details',{det:details});
})

module.exports = router;
