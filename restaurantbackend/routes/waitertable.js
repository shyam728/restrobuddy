var express = require("express");
var router = express.Router();
var pool = require("./pool");

router.post("/waitertable_submit", function (req, res, next) {
  pool.query(
    "insert into waitertable ( restaurantid, waiterid, tableid, currentdate)values(?,?,?,?)",
    [
      req.body.restaurantid,
      req.body.waiterid,
      req.body.tableid,
      req.body.currentdate,
    ],
    function (error, result) {
      if (error) {
        console.log("Errorrr", error);
        res.status(200).json({ status: false, message: "Database Error" });
      } else {
        res
          .status(200)
          .json({ status: true, message: "WaiterTable Added Successfully" });
      }
    }
  );
});

router.get("/fetch_all_waitertable", function (req, res) {
  pool.query(
    "select WT.*,(select W.waitername from waiters W where W.waiterid=WT.waiterid) as waitername, (select T.tableno from tablebooking T where T.tableid=WT.tableid) as tableno ,(select T.floor from tablebooking T where T.tableid=WT.tableid) as floor  from waitertable WT",
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
            message: "WaiterTable Get Successfully",
          });
      }
    }
  );
});

router.post("/waitertable_edit_data", function (req, res, next) {
  console.log("Datammmmm", req.body);
  pool.query(
    "update waitertable set restaurantid=?, tableid=?, waiterid=?, currentdate=? where waitertableid=?",
    [
      req.body.restaurantid,
      req.body.tableid,
      req.body.waiterid,
      req.body.currentdate,
      req.body.waitertableid,
    ],
    function (error, result) {
      if (error) {
        console.log("Errorrr", error);
        res.status(200).json({ status: false, message: "Database Error" });
      } else {
        res
          .status(200)
          .json({ status: true, message: "WaiterTable Updated Successfully" });
      }
    }
  );
});

router.post("/waitertable_delete", function (req, res, next) {
  pool.query(
    "delete from waitertable where waitertableid=?",
    [req.body.waitertableid],
    function (error, result) {
      if (error) {
        console.log("Errorrr", error);
        res.status(200).json({ status: false, message: "Database Error" });
      } else {
        res
          .status(200)
          .json({ status: true, message: "WaiterTable Deleted Successfully" });
      }
    }
  );
});

module.exports = router;
