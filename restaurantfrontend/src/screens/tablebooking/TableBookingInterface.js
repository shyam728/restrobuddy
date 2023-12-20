import { useState, useEffect } from "react";
import { display } from "@mui/system";
import {  Grid, TextField, Button, Select , FormHelperText , FormControl } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Heading from "../../components/heading/Heading";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { serverURL, getData, postData } from "../../services/FetchNodeService";
import Swal from "sweetalert2";


const useStyles = makeStyles({
    root: {
      width: "auto",
      height: "80vh",
      background: "#dfe4ea",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    box: {
      width: "60%",
      height: "auto",
      borderRadius: 10,
      background: "#fff",
      padding: 15,
    },
    center: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  });


export default function TableBookingInterface() {
    var classes = useStyles();
    var  admin = JSON.parse(localStorage.getItem('ADMIN'))


   
    const [restaurantId, setRestaurantId] = useState(admin.restaurantid);
    const [tableNo , setTableNo] =  useState("")
    const [noOfChairs , setNoOfChairs] = useState("")
    const [floor , setFloor] = useState("")
    const [resError,setResError] = useState({})

    const handleError = (error, input,message)=>{
      setResError(prevState => ({...prevState,[input]:{'error':error,'message':message}}))
      console.log("CC",resError)
    }


   

// validation 
const validation = ()=>{
  var  submitRecord= true
 
  if(tableNo.trim().length==0){
    handleError(true,'tableNo','Pls Input Table No')
    console.log(resError);
    submitRecord=false
  }
  if(noOfChairs.trim().length==0){
    handleError(true,'noOfChairs','Pls Input No of Chairs')
    console.log(resError);
    submitRecord=false
  }
  if(floor.trim().length==0){
    handleError(true,'floor','Pls Input Floor Number')
    console.log(resError);
    submitRecord=false
  }
 
  return submitRecord
}



const handleSubmit = async () => {
    var error = validation()
    if(error){
  var body={
    "restaurantid":restaurantId,
    "tableno":tableNo,
    "noofchairs":noOfChairs,
    "floor":floor
  }
    var result = await postData("tablebookings/tablebooking_submit", body);
    if (result.status) {
      Swal.fire({
        icon: "success",
        title: "Table Booked",
        text: result.message,
      });
     
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: result.message,
      });
     
    }
  
  }

  };

   

    

return(
    <div>


    <div className={classes.root}>
      <div className={classes.box}>
      <Grid container spacing={2}>
      <Grid item xs={12}>
            <Heading title={"Table Booking Registation"} myroute={'/admindashboard/displayalltablebooking'} />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Restaurant Id"
             value={restaurantId}
             disabled
              fullWidth
             
            />
          </Grid>

          <Grid item xs={6}>
          <FormControl fullWidth>
              <InputLabel>Floor</InputLabel>
              <Select
                onChange={(event) => setFloor(event.target.value)}
                label="Floor"
                onFocus={()=> handleError(false,'floor','')}
                error={resError?.floor?.error}
                helperText={resError?.floor?.message}
                value={floor}
              >
                  <MenuItem>-Select Floor-</MenuItem>
                  <MenuItem value="Roof Top">Roof Top</MenuItem>
                  <MenuItem value="Floor 1">Floor 1</MenuItem>
                  <MenuItem value="Floor 2">Floor 2</MenuItem>
                  <MenuItem value="Floor 3">Floor 3</MenuItem>
                  <MenuItem value="Floor 4">Floor 4</MenuItem>
                  <MenuItem value="Floor 5">Floor 5</MenuItem>
                  <MenuItem value="Floor 6">Floor 6</MenuItem>
              </Select>
              <FormHelperText style={{color:'#d32f2f'}} >{resError?.floor?.message}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Table No"
              onChange={(event) => setTableNo(event.target.value)}
              fullWidth
              onFocus={()=> handleError(false,'tableNo','')}
              error={resError?.tableNo?.error}
              helperText={resError?.tableNo?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="No Of Chairs"
              onChange={(event) => setNoOfChairs(event.target.value)}
              fullWidth
              onFocus={()=> handleError(false,'noOfChairs','')}
              error={resError?.noOfChairs?.error}
              helperText={resError?.noOfChairs?.message}
            />
          </Grid>
         

         

          <Grid item xs={6}>
            <Button fullWidth variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button fullWidth variant="contained" >
              Reset
            </Button>
          </Grid>
          


</Grid>
        </div>
        </div>
    </div>
)


}