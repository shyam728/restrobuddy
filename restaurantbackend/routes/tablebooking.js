var express = require('express');
var router = express.Router();
var pool = require('./pool')




router.post('/tablebooking_submit' , function(req, res, next) {
    console.log(req.body)
    pool.query('insert into tablebooking(restaurantid, tableno, noofchairs, floor) values(?,?,?,?)',[req.body.restaurantid, req.body.tableno, req.body.noofchairs, req.body.floor],function(err,result){
        if(err){
            console.log(err)
            res.status(200).json({status:false, message:'database error'})
        }else{
            res.status(200).json({status:true, message:'table Added Sucessfully'})
    
        }
    
    })


    });



    router.post('/fetch_all_tablebooking',function(req,res){
        pool.query('select * from tablebooking where restaurantid=?',  [req.body.restaurantid]    ,function(error,result){
            if(error){
                console.log("error in fetch data",error)
                res.status(200).json({status:false, message:'database error',data:[]})
            }else{
                res.status(200).json({status:true, message:'tablebooking fetch  Sucessfully' , data:result})
                 console.log(result)
            }  
        })
    })

    router.post('/fetch_all_floor',function(req,res){
        pool.query('select floor from tablebooking where restaurantid=? group by floor',  [req.body.restaurantid]    ,function(error,result){
            if(error){
                console.log("error in fetch data",error)
                res.status(200).json({status:false, message:'database error',data:[]})
            }else{
                res.status(200).json({status:true, message:'tablebooking fetch  Sucessfully' , data:result})
                 console.log(result)
            }  
        })
    })

    router.post('/fetch_all_table_by_floor',function(req,res){
        pool.query('select * from tablebooking where restaurantid=? and floor=?',  [req.body.restaurantid, req.body.floor]    ,function(error,result){
            if(error){
                console.log("error in fetch data",error)
                res.status(200).json({status:false, message:'database error',data:[]})
            }else{
                res.status(200).json({status:true, message:'tablebooking floor table fetch  Sucessfully' , data:result})
                 console.log(result)
            }  
        })
    })

    router.post('/tablebooking_edit_data', function(req, res, next) {
      


        pool.query('update tablebooking set restaurantid=? , tableno=? , noofchairs=? , floor=? where tableid=?',[req.body.restaurantid , req.body.tableno,  req.body.noofchairs , req.body.floor  , req.body.tableid],function(err,result){
            if(err){
                console.log(err)
                res.status(200).json({status:false, message:'database error'})
            }else{
                res.status(200).json({status:true, message:'Tablebooking Updated Sucessfully'})
        
            }
        });

    });


    router.post('/tablebooking_delete' , function(req, res, next) {
        pool.query('delete from tablebooking  where tableid=?' ,[ req.body.tableid],function(err,result){
            if(err){
                console.log(err)
                res.status(200).json({status:false, message:'database error'})
            }else{
                res.status(200).json({status:true, message:'table Deleted Sucessfully'})
        
            }
        
        })
        });

   
module.exports = router;