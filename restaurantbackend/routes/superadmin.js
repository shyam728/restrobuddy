var express = require('express');
var router = express.Router();
var pool = require('./pool')
var jwt = require('jsonwebtoken')


// router.post('/chktoken', function(req,res){

//    jwt.verify(req.body.token, 'shhhh' ,function(err , decoded){
//     console.log(decoded.foo);
//     res.decode(200).json(decoded)
//    })
//    res.decode(200).json({'status':'invaild token'})
   
// })
/* post check login. */

router.post('/checklogin',function(req,res,next){
    console.log(req.body);
    pool.query('select * from superadmin where emailid=? and password=?',[req.body.emailid,req.body.password],function(error,result){
      if(result.error)
      {
        res.status(200).json({status:false,data:[],message:'Server Error....'})
      }
      else
      {
       if(result.length==1)
       { 
       var token = jwt.sign({data:result[0] }, 'shhhh' , {expiresIn:1000*60})
       console.log(token);
         res.status(200).json({status:true,data:result[0],message:'Login Successful....',token});
        }
        else
        {
          res.status(202).json({status:false,data:[],message:'Invalid userid/password'});
        }
      }
    })
  });

module.exports = router;
