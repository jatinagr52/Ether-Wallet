const mongoose=require('mongoose');
mongoose.Promise=global.Promise;

mongoose.connect('mongodb://localhost:27017/database',(err,out)=>{
  if(err)
  {
    console.log('error occurs'+err);
  }
  else{
    console.log('connected to database');
  }
});
/* GET home page. */
var schema=mongoose.Schema ;
var myschema=new schema({
  name : String,
  email: String,
  password:String

});
var model= mongoose.model('accounts',myschema);

module.exports=model;
