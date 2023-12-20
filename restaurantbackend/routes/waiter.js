var express = require('express');
var router = express.Router();
var pool = require('./pool')
var upload = require('./multer')


router.post('/waiter_submit', upload.any() , function(req, res, next) {
    console.log(req.body)
    pool.query('insert into waiters(restaurantid, waitername, gender, dob, mobileno, emailid, address, picture) values(?,?,?,?,?,?,?,?)',[req.body.restaurantid , req.body.waitername, req.body.gender, req.body.dob, req.body.mobileno, req.body.emailid, req.body.address,  req.files[0].filename],function(err,result){
        if(err){
            console.log(err)
            res.status(200).json({status:false, message:'database error'})
        }else{
            res.status(200).json({status:true, message:'Waiter Added Sucessfully'})
    
        }
    
    })


    });


    router.post('/fetch_all_waiter',function(req,res){
        pool.query('select * from waiters where restaurantid=?' ,[req.body.restaurantid],function(error,result){
            if(error){
                console.log("error in fetch data",error)
                res.status(200).json({status:false, message:'database error',data:[]})
            }else{
                res.status(200).json({status:true, message:'Waiter fetch  Sucessfully' , data:result})
                 console.log(result)
            }  
        })
    })

    router.post('/waiter_edit_data',upload.any(), function(req, res, next) {
        pool.query("update waiters set restaurantid=?, waitername=?, gender=?, dob=?, mobileno=?, emailid=?, address=? where waiterid=?",[ req.body.restaurantid, req.body.waitername, req.body.gender, req.body.dob, req.body.mobileno, req.body.emailid, req.body.address,req.body.waiterid],function(error,result){
        if(error)
        {
            console.log("Errorrr",error);
            res.status(200).json({status:false,message:'Database Error'}) 
        }
        else
        {
            res.status(200).json({status:true,message:'Waiter Updated Successfully'})
        }
        
        })
      });


      router.post('/waiter_edit_icon',upload.any(), function(req, res, next) {
        pool.query("update waiters set picture=? where waiterid=?",[ req.files[0].filename,req.body.waiterid],function(error,result){
        if(error)
        {
            console.log("Errorrr",error);
            res.status(200).json({status:false,message:'Database Error'}) 
        }
        else
        {
            res.status(200).json({status:true,message:'Picture Updated Successfully'})
        }
        
        })
      });
  
  
      router.post('/waiter_delete',upload.any(), function(req, res, next) {
        pool.query("delete from waiters where waiterid=?",[ req.body.waiterid],function(error,result){
        if(error)
        {
            console.log("Errorrr",error,req.body);
            res.status(200).json({status:false,message:'Database Error'})
        
        }
        else
        {
            res.status(200).json({status:true,message:'Waiter Deleted Successfully'})
        }
        
        })
      });


module.exports = router;
