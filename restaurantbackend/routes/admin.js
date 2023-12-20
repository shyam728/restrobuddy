const express =require('express');
const router = express.Router();
const pool=require('./pool');
var jwt = require('jsonwebtoken')

router.post('/checklogin',function(req,res,next){
  console.log(req.body);
  pool.query('select * from restaurants where emailid=? and password=?',[req.body.emailid,req.body.password],function(error,result){
    if(error)
    {
      res.status(200).json({status:false,data:[],message:'Server Error....'})
    }
    else
    {
     if(result.length==1)
     { 
      var token = jwt.sign({data:result[0] }, 'shhhh' , {expiresIn:1000*60})
       res.status(200).json({status:true,data:result[0],message:'Login Successful....',token});
      }
      else
      {
        res.status(200).json({status:false,data:[],message:'Invalid userid/password'});
      }
    }
  })
});

module.exports=router;