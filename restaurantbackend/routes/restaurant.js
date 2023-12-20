var express = require("express");
var router = express.Router();
var pool = require("./pool");
var upload = require("./multer");

/* GET home page. */
router.post("/restaurant_submit", upload.any(), function (req, res, next) {
  pool.query(
    "insert into restaurants(restaurantname, ownername, phonenumber, emailid, mobilenumber, url, fssai, gstno, gsttype, filefssai, fileshopact, filelogo, address, stateid, cityid, createdat, updatedat, password) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      req.body.restaurantname,
      req.body.ownername,
      req.body.phonenumber,
      req.body.emailid,
      req.body.mobilenumber,
      req.body.url,
      req.body.fssai,
      req.body.gstno,
      req.body.gsttype,
      req.files[0].filename,
      req.files[1].filename,
      req.files[2].filename,
      req.body.address,
      req.body.stateid,
      req.body.cityid,
      req.body.createdat,
      req.body.updatedat,
      req.body.password,
    ],
    function (err, result) {
      if (err) {
        console.log(err);
        res.status(200).json({ status: false, message: "database error" });
      } else {
        res
          .status(200)
          .json({ status: true, message: "Restaurent Added Sucessfully" });
      }
    }
  );
});

router.get("/fetch_all_restaurant", function (req, res) {
  pool.query(
    "select R.*,(select S.statename from states S where S.stateid=R.stateid) as statename, (select C.cityname from city C where C.cityid=R.cityid) as cityname  from restaurants R",
    function (error, result) {
      if (error) {
        console.log(error);
        res
          .status(200)
          .json({ status: false, message: "database error", data: [] });
      } else {
        res
          .status(200)
          .json({
            status: true,
            message: "Restaurent fetch  Sucessfully",
            data: result,
          });
        console.log(result);
      }
    }
  );
});

router.post("/restaurant_edit_data", upload.any(), function (req, res, next) {
  pool.query(
    "update restaurants set restaurantname=?, ownername=?, phonenumber=?, emailid=?, mobilenumber=?, url=?, fssai=?, gstno=?, gsttype=?, address=?, stateid=?, cityid=?,  updatedat=? where restaurantid=?",
    [
      req.body.restaurantname,
      req.body.ownername,
      req.body.phonenumber,
      req.body.emailid,
      req.body.mobilenumber,
      req.body.url,
      req.body.fssai,
      req.body.gstno,
      req.body.gsttype,
      req.body.address,
      req.body.stateid,
      req.body.cityid,
      req.body.updatedat,
      req.body.restaurantid,
    ],
    function (err, result) {
      if (err) {
        console.log(err);
        res.status(200).json({ status: false, message: "database error" });
      } else {
        res
          .status(200)
          .json({ status: true, message: "Restaurent Updated Sucessfully" });
      }
    }
  );
});

router.post("/restaurant_edit_fssai", upload.any(), function (req, res, next) {
  pool.query(
    "update restaurants set filefssai=? where restaurantid=?",
    [req.files[0].filename, req.body.restaurantid],
    function (err, result) {
      if (err) {
        console.log(err);
        res.status(200).json({ status: false, message: "database error" });
      } else {
        res
          .status(200)
          .json({
            status: true,
            message: "Fssai Certificate Updated Sucessfully",
          });
      }
    }
  );
});
router.post(
  "/restaurant_edit_shopact",
  upload.any(),
  function (req, res, next) {
    pool.query(
      "update restaurants set fileshopact=? where restaurantid=?",
      [req.files[0].filename, req.body.restaurantid],
      function (err, result) {
        if (err) {
          console.log(err);
          res.status(200).json({ status: false, message: "database error" });
        } else {
          res
            .status(200)
            .json({
              status: true,
              message: "ShopAct Certificate Updated Sucessfully",
            });
        }
      }
    );
  }
);
router.post("/restaurant_edit_logo", upload.any(), function (req, res, next) {
  pool.query(
    "update restaurants set filelogo=? where restaurantid=?",
    [req.files[0].filename, req.body.restaurantid],
    function (err, result) {
      if (err) {
        console.log(err);
        res.status(200).json({ status: false, message: "database error" });
      } else {
        res
          .status(200)
          .json({ status: true, message: "Logo Updated Sucessfully" });
      }
    }
  );
});

router.post("/restaurant_delete", function (req, res, next) {
  pool.query(
    "delete from restaurants  where restaurantid=?",
    [req.body.restaurantid],
    function (err, result) {
      if (err) {
        console.log(err);
        res.status(200).json({ status: false, message: "database error" });
      } else {
        res
          .status(200)
          .json({ status: true, message: "Restaurant Deleted Sucessfully" });
      }
    }
  );
});

module.exports = router;
