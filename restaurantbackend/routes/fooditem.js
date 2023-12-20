var express = require("express");
var router = express.Router();
var pool = require("./pool");
var upload = require("./multer");

router.post("/fooditem_submit", upload.any(), function (req, res, next) {
  console.log(req.body);
  pool.query(
    "insert into fooditems(restaurantid, categoryid, fooditemname, foodtype, ingredients, price, offerprice, fileicon) values(?,?,?,?,?,?,?,?)",
    [
      req.body.restaurantid,
      req.body.categoryid,
      req.body.fooditemname,
      req.body.foodtype,
      req.body.ingredients,
      req.body.price,
      req.body.offerprice,
      req.files[0].filename,
    ],
    function (err, result) {
      if (err) {
        console.log(err);
        res.status(200).json({ status: false, message: "database error" });
      } else {
        res
          .status(200)
          .json({ status: true, message: "Category Added Sucessfully" });
      }
    }
  );
});

// router.post('/fetch_all_fooditem',function(req,res){
//     pool.query('select * from fooditems where  restaurantid=?'  , [req.body.restaurantid],function(error,result){
//         if(error){
//             console.log("error in fetch data",error)
//             res.status(200).json({status:false, message:'database error',data:[]})
//         }else{
//             res.status(200).json({status:true, message:'fooditem fetch  Sucessfully' , data:result})
//              console.log(result)
//         }
//     })
// })

router.post("/fetch_all_fooditem", function (req, res) {
  pool.query(
    "select F.*, (select C.categoryname from category C where C.categoryid=F.categoryid) as categoryname from fooditems F where F.restaurantid=?",
    [req.body.restaurantid],
    function (error, result) {
      if (error) {
        console.log(error);
        res
          .status(200)
          .json({ status: false, message: "Database Error", data: [] });
      } else {
        console.log(result);
        res
          .status(200)
          .json({
            status: true,
            data: result,
            message: "Fooditems Get Successfully",
          });
      }
    }
  );
});

router.post("/fooditem_edit_data", upload.any(), function (req, res, next) {
  pool.query(
    "update fooditems set  restaurantid=? , categoryid=?,  fooditemname=? , foodtype=?  , ingredients=? , price=? , offerprice=? where fooditemid=?",
    [
      req.body.restaurantid,
      req.body.categoryid,
      req.body.fooditemname,
      req.body.foodtype,
      req.body.ingredients,
      req.body.price,
      req.body.offerprice,
      req.body.fooditemid,
    ],
    function (err, result) {
      if (err) {
        console.log(err);
        res.status(200).json({ status: false, message: "database error" });
      } else {
        res
          .status(200)
          .json({ status: true, message: "Category Updated Sucessfully" });
      }
    }
  );
});

router.post("/fooditem_edit_icon", upload.any(), function (req, res, next) {
  pool.query(
    "update fooditems set fileicon=? where fooditemid=?",
    [req.files[0].filename, req.body.fooditemid],
    function (err, result) {
      if (err) {
        console.log(err);
        res.status(200).json({ status: false, message: "database error" });
      } else {
        res
          .status(200)
          .json({ status: true, message: "Icon Updated Sucessfully" });
      }
    }
  );
});

router.post("/fooditem_delete", function (req, res, next) {
  pool.query(
    "delete from fooditems  where fooditemid=?",
    [req.body.fooditemid],
    function (err, result) {
      if (err) {
        console.log(err);
        res.status(200).json({ status: false, message: "database error" });
      } else {
        res
          .status(200)
          .json({ status: true, message: "fooditem Deleted Sucessfully" });
      }
    }
  );
});

router.post("/fetch_all_fooditem_categorywise", function (req, res) {
  pool.query(
    "select F.*, (select C.categoryname from category C where C.categoryid=F.categoryid) as categoryname from fooditems F where F.restaurantid=? and F.categoryid=?",
    [req.body.restaurantid, req.body.categoryid],
    function (error, result) {
      if (error) {
        console.log(error);
        res
          .status(200)
          .json({ status: false, message: "Database Error", data: [] });
      } else {
        console.log(result);
        res
          .status(200)
          .json({
            status: true,
            data: result,
            message: "Fooditems Get Successfully",
          });
      }
    }
  );
});

module.exports = router;
