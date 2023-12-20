
import CategoryInterface from "./screens/category/CategoryInterface";


import FoodItemInterface from "./screens/fooditem/FoodItemInterface"

import {BrowserRouter as Router , Routes , Route  } from "react-router-dom";
import LoginPage from "./screens/superadmin/LoginPage";
import Dashboard from "./screens/superadmin/Dashboard";
import TableBookingInterface from "./screens/tablebooking/TableBookingInterface";
import DisplayAllTableBooking from "./screens/tablebooking/DisplayAllTableBooking";
import AdminLogin from "./screens/admin/AdminLogin";
import AdminDashboard from "./screens/admin/AdminDashboard";
import FoodBooking from "./screens/FoodBooking/FoodBooking";


function App() {
  return (
    <div>
      <Router>
        <Routes>
        
         
       
          <Route element={<LoginPage/>} path="/loginpage"/>
          <Route element={<Dashboard/>} path="/dashboard/*"/>
          <Route element={<AdminLogin/>} path='/adminlogin'/> 
         <Route element={<AdminDashboard/>} path='/admindashboard/*'/>  
          <Route element={<TableBookingInterface/>} path="/tablebookinginterface"/>
          <Route element={<FoodBooking/>} path="foodbooking" />
        
         
       
  
        </Routes>
      </Router>
    </div>
  )
  }

export default App;
