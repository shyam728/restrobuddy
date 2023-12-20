var express = require('express');
var router = express.Router();
var pool = require('./pool')
var upload = require('./multer')



router.post('/category_submit', upload.any() , function(req, res, next) {
    console.log(req.body)
    pool.query('insert into category(restaurantid, categoryname, icon) values(?,?,?)',[req.body.restaurantid , req.body.categoryname ,  req.files[0].filename],function(err,result){
        if(err){
            console.log(err)
            res.status(200).json({status:false, message:'database error'})
        }else{
            res.status(200).json({status:true, message:'Category Added Sucessfully'})
    
        }
    
    })


    });


    router.post('/fetch_all_category',function(req,res){
        pool.query('select * from category where restaurantid=?', [req.body.restaurantid] ,function(error,result){
            if(error){
                console.log("error in fetch data",error)
                res.status(200).json({status:false, message:'database error',data:[]})
            }else{
                res.status(200).json({status:true, message:'Restaurent fetch  Sucessfully' , data:result})
                 console.log(result)
            }  
        })
    })




    router.post('/category_edit_data', upload.any() , function(req, res, next) {
      


        pool.query('update category set categoryname=?, restaurantid=? where categoryid=?',[req.body.categoryname, req.body.restaurantid , req.body.categoryid],function(err,result){
            if(err){
                console.log(err)
                res.status(200).json({status:false, message:'database error'})
            }else{
                res.status(200).json({status:true, message:'Category Updated Sucessfully'})
        
            }
        });

    });

        router.post('/category_edit_icon', upload.any() , function(req, res, next) {
            pool.query('update category set icon=? where categoryid=?' ,[req.files[0].filename, req.body.categoryid],function(err,result){
                if(err){
                    console.log(err)
                    res.status(200).json({status:false, message:'database error'})
                }else{
                    res.status(200).json({status:true, message:'Icon Updated Sucessfully'})
            
                }
            
            })
            });



            router.post('/category_delete' , function(req, res, next) {
                pool.query('delete from category  where categoryid=?' ,[ req.body.categoryid],function(err,result){
                    if(err){
                        console.log(err)
                        res.status(200).json({status:false, message:'database error'})
                    }else{
                        res.status(200).json({status:true, message:'Category Deleted Sucessfully'})
                
                    }
                
                })
                });

module.exports = router;