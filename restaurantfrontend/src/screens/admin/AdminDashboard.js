import { useState } from "react";
import { useStyles } from "./AdminDashboardCss";
import { Avatar,AppBar,Box,Toolbar,Typography,Grid,Paper } from "@mui/material";

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon  from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import DashboardIcon from '@mui/icons-material/Dashboard';


import CategoryInterface from "../category/CategoryInterface";
import DisplayAllCategory from "../category/DisplayAllCategory";
import FoodItemInterface from "../fooditem/FoodItemInterface";
import DisplayAllFoodItem from "../fooditem/DisplayAllFoodItem";
import TableBookingInterface from "../tablebooking/TableBookingInterface";
import DisplayAllTableBooking from "../tablebooking/DisplayAllTableBooking"
import WaiterInterface from "../waiter/WaiterInterface";
import DisplayAllWaiter from "../waiter/DisplayAllWaiter";
import WaiterTableInterface from "../waitertable/WaiterTableInterface";
import DisplayAllWaiterTable from "../waitertable/DisplayAllWaiterTable";
import FoodBooking from "../FoodBooking/FoodBooking";
import AllSales  from "../allsales/AllSales"
import Summary from "./Summary"

import { Routes,Route , Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { serverURL } from "../../services/FetchNodeService";


export default function AdminDashboard(props){
  const classes=useStyles();
  const navigate=useNavigate();
  var admin=JSON.parse(localStorage.getItem('ADMIN'))
  const  handleLogout = () =>{
    localStorage.clear()
    navigate('/adminlogin')
   }
  return(
    <Box sx={{ flexGrow: 1 }} >
        <AppBar position="sticky"> 
          <Toolbar variant="dense"> 
            <Typography variant="h6" color="inherit" sx={{cursor:"pointer"}} component="div" onClick={()=>navigate('/admindashboard')}>
              {admin.restaurantname}
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid container spaces={3} style={{paddingInlineStart:5}} >
          <Grid item xs={2.2} >
            <Paper >
              <div className={classes.leftBarStyle}>
                <Avatar src={`${serverURL}/images/${admin.filelogo}`} variant="rounded" style={{width:80,height:80 , cursor:'pointer'}} onClick={()=>navigate('/admindashboard')}/> 
                <div className={classes.nameStyle}>{admin.ownername}</div>
                <div className={classes.emailStyle}>{admin.emailid}</div>
                <div className={classes.phoneStyle}>+91{admin.mobilenumber}</div>
              </div>
              <div className={classes.menuStyle}>
                <List>
                  <Divider />

                  <ListItem disablePadding>
                    <ListItemButton onClick={()=>navigate('/admindashboard/summary')}>
                      <ListItemIcon>
                        <DashboardIcon />
                      </ListItemIcon>
                      <ListItemText primary={<span className={classes.menuItemStyle}>Dashboard</span>} />
                    </ListItemButton>
                  </ListItem>
                  
                  <ListItem disablePadding>
                    <ListItemButton onClick={()=>navigate('/admindashboard/displayallcategory')}>
                      <ListItemIcon>
                        <DraftsIcon />
                      </ListItemIcon>
                      <ListItemText primary={<span className={classes.menuItemStyle}>Category List</span>} />
                    </ListItemButton>
                  </ListItem>

                 
                  <ListItem disablePadding>
                    <ListItemButton onClick={()=>navigate('/admindashboard/displayallfooditem')}>
                      <ListItemIcon>
                        <DraftsIcon />
                      </ListItemIcon>
                      <ListItemText primary={<span className={classes.menuItemStyle}>Food Item List</span>} />
                    </ListItemButton>
                  </ListItem>

                  
                  <ListItem disablePadding>
                    <ListItemButton onClick={()=>navigate('/admindashboard/displayalltablebooking')}>
                      <ListItemIcon>
                        <DraftsIcon />
                      </ListItemIcon>
                      <ListItemText primary={<span className={classes.menuItemStyle}>Table List</span>} />
                    </ListItemButton>
                  </ListItem>

                 
                  <ListItem disablePadding>
                    <ListItemButton onClick={()=>navigate('/admindashboard/displayallwaiter')}>
                      <ListItemIcon>
                        <DraftsIcon />
                      </ListItemIcon>
                      <ListItemText primary={<span className={classes.menuItemStyle}>Waiter List</span>} />
                    </ListItemButton>
                  </ListItem>

                  
                  <ListItem disablePadding>
                    <ListItemButton onClick={()=>navigate('/admindashboard/displayallwaitertable')}>
                      <ListItemIcon>
                        <DraftsIcon />
                      </ListItemIcon>
                      <ListItemText primary={<span className={classes.menuItemStyle}>WaiterTable List</span>} />
                    </ListItemButton>
                  </ListItem>

                  <ListItem disablePadding>
                    <ListItemButton onClick={()=>navigate('/admindashboard/allsales')}>
                      <ListItemIcon>
                        <DraftsIcon />
                      </ListItemIcon>
                      <ListItemText primary={<span className={classes.menuItemStyle}>Sales Report</span>} />
                    </ListItemButton>
                  </ListItem>

                  <ListItem disablePadding>
                    <ListItemButton onClick={()=>navigate('/admindashboard/foodbooking')}>
                      <ListItemIcon>
                        <DraftsIcon />
                      </ListItemIcon>
                      <ListItemText primary={<span className={classes.menuItemStyle}>Billing</span>} />
                    </ListItemButton>
                  </ListItem>


                  <Divider />
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleLogout}>
                      <ListItemIcon>
                        <DraftsIcon />
                      </ListItemIcon>
                      <ListItemText primary={<span className={classes.menuItemStyle}>Logout</span>} />
                    </ListItemButton>
                  </ListItem>
                </List>
              </div> 
            </Paper>
          </Grid> 
          <Grid item xs={9.8} style={{padding:20}}>
         
            <Routes>
            <Route path="/" element={<Navigate to="/admindashboard/Summary" replace={true} />}/>

              <Route element={<CategoryInterface/>} path='/categoryinterface'/>
              <Route element={<DisplayAllCategory/>} path='/displayallcategory'/>
              <Route element={<FoodItemInterface/>} path='/fooditeminterface'/>
              <Route element={<DisplayAllFoodItem/>} path='/displayallfooditem'/>

              <Route element={<TableBookingInterface/>} path='/tablebookinginterface'/>
              <Route element={<DisplayAllTableBooking/>} path='/displayalltablebooking'/>

              <Route element={<WaiterInterface/>} path='/waiterinterface'/>
              <Route element={<DisplayAllWaiter/>} path='/displayallwaiter'/>
              <Route element={<WaiterTableInterface/>} path='/waitertableinterface'/>
              <Route element={<DisplayAllWaiterTable/>} path='/displayallwaitertable'/>
              <Route element={<FoodBooking/>} path='/foodbooking'/>
              <Route element={<AllSales/>} path='/allsales'/>
              <Route element={<Summary/>} path='/summary'/>
            </Routes> 
          </Grid>
        </Grid>
    </Box>
  )
}