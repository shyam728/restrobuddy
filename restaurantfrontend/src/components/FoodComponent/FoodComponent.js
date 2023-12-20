import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { Avatar, Button, TextField } from "@mui/material";
import DraftsIcon from "@mui/icons-material/Drafts";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { postData, serverURL } from "../../services/FetchNodeService";
import React from "react";
import { height } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";


export default function FoodComponent(props) {
  var dispatch = useDispatch();
  var foodOrder = useSelector((state) => state.orderData);

  var admin = JSON.parse(localStorage.getItem("ADMIN"));
  const [listFood, setListFood] = useState([]);
  const [tempListFood, setTempListFood] = useState([]);
  const [order, setOrder] = useState([]);

  // update call for show data
  useEffect(
    function () {
      fetchAllFood();
    },
    [props]
  );

  const fetchAllFood = async () => {
    var result = await postData("fooditems//fetch_all_fooditem_categorywise", {
      restaurantid: admin.restaurantid,
      categoryid: props.categoryid,
    });
    setListFood(result.data);
    setTempListFood(result.data);
  };

  const handleSearchFood = (e) => {
    var temp = tempListFood.filter((item) =>
      item.fooditemname.toLowerCase().includes(e.target.value.toLowerCase())
    );

    setListFood(temp);
  };

  const handleOrder = (item) => {
    var key = `#${props.floorNo}${props.tableNo}`;

    try {
      var foodlist = foodOrder[key];
      try{
        foodlist[item.fooditemid].qty=parseInt( foodlist[item.fooditemid].qty)+1
      }catch(e){
        item.qty=1;
        foodlist[item.fooditemid] = item;
      foodOrder[key] = foodlist;
      }
    
    
    } catch (e) {
      var foodlist = {};
      item.qty = 1;
      foodlist[item.fooditemid] = item;
      foodOrder[key] = { ...foodlist };
    }

    console.log(foodOrder);

    dispatch({ type: "ADD_ORDER", payload: [key, foodOrder[key]] });
    props.setRefresh(!props.refresh);
  };

  const showFoodList = () => {
    return listFood.map((item) => {
      return (
        <div>
          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          >
            <ListItemButton
              onClick={() => handleOrder(item)}
              sx={{
                height: 30,
                display: "flex",
                alignItems: "center",
                padding: 3,
              }}
              alignItems="flex-start"
            >
              <ListItemAvatar>
                <Avatar
                  alt="Remy Sharp"
                  src={`${serverURL}/images/${item.fileicon}`}
                  sx={{ width: 30, height: 30 }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={item.fooditemname}
                secondary={
                  item.offerprice > 0 ? (
                    <span>
                      <s>&#8377;{item.price}</s>
                      <b>&#8377;{item.offerprice}</b>
                    </span>
                  ) : (
                    <b>&#8377; {item.price}</b>
                  )
                }
              />
            </ListItemButton>
          </List>
        </div>
      );
    });
  };

  // show data
  const handleDialogClose = () => {
    props.setOpen(false);
  };

  // dailogue box
  const showFoodDialoge = () => {
    return (
      <Dialog maxWidth={"sm"} open={props.open}>
        <DialogContent>
          <TextField
            onChange={(e) => handleSearchFood(e)}
            label="Search Food Item..."
            variant="standard"
            fullWidth
          />
          {showFoodList()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {showFoodDialoge()}
    </Box>
  );
}
