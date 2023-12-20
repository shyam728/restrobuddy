import { useState, useEffect } from "react";
import { display } from "@mui/system";
import { Avatar, Grid, TextField, Button, Select , FormHelperText } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Heading from "../../components/heading/Heading";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import InputLabel from "@mui/material/InputLabel";
import { UploadFile } from "@mui/icons-material";
import MenuItem from "@mui/material/MenuItem";
import { serverURL, getData, postData } from "../../services/FetchNodeService";
import Swal from "sweetalert2";


const useStyles = makeStyles({
    root: {
      width: "auto",
      height: "100%",
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


export default function CategoryInterface() {
    var classes = useStyles();
    var  admin = JSON.parse(localStorage.getItem('ADMIN'))


    const [categoryName, setCategoryName] = useState("");
    const [restaurantId, setRestaurantId] = useState(admin.restaurantid);
    const [icon,setIcon]=useState({url:'',bytes:''});
    const [resError,setResError] = useState({})

    const handleError = (error, input,message)=>{
      setResError(prevState => ({...prevState,[input]:{'error':error,'message':message}}))
      console.log("CC",resError)
    }


   

// validation 
const validation = ()=>{
  var  submitRecord= true

  if(categoryName.trim().length==0){
    handleError(true,'categoryName','Pls Input Category Name')
    console.log(resError);
    submitRecord=false
  }
  if(!icon.url){
    handleError(true,'icon','Pls Upload Icon')
    submitRecord=false
  }
  return submitRecord
}


const handleIcon = (event) => {
  setIcon({
    url: URL.createObjectURL(event.target.files[0]),
    bytes: event.target.files[0],
  });
};


    const handleSubmit = async () => {
      var error = validation()
      if(error){
      var formData = new FormData();
      formData.append("restaurantid", restaurantId);
      formData.append("categoryname", categoryName);
      formData.append("icon", icon.bytes);
      var result = await postData("categorys/category_submit", formData);
      if (result.status) {
        Swal.fire({
          icon: "success",
          title: "Category Added",
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
    }

    

return(
    <div>


    <div className={classes.root}>
      <div className={classes.box}>
      <Grid container spacing={2}>
      <Grid item xs={12}>
            <Heading title={"Restaurant Category Register"} myroute={'/admindashboard/displayallcategory'} />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Restaurant Id"
             value={restaurantId}
             disabled
              fullWidth
            
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Category Name"
              onChange={(event) => setCategoryName(event.target.value)}
              fullWidth
              onFocus={()=> handleError(false,'categoryName','')}
              error={resError?.categoryName?.error}
              helperText={resError?.categoryName?.message}
            />
          </Grid>

         

          <Grid item xs={12}>
            <Button
              fullWidth
              component="label"
              variant="contained"
              endIcon={<UploadFileIcon />}
              onFocus={()=> handleError(false,'icon','')}
            >
              <input
                multiple
                onChange={handleIcon}
                hidden
                accept="image/*"
                type="file"
               
              />
              Upload Category Icon
            </Button>
            { 
           resError?.icon?.error?<div style={{color: 'rgb(211, 47, 47)', fontSize:'0.75rem' , margin:5 ,fontWeight:400}}>{resError?.icon?.message}</div>:<></> 
          }
          </Grid>

 <Grid item xs={12} className={classes.center}>
            <Avatar
              variant="rounded"
              alt="Remy Sharp"
              src={icon.url}
              sx={{ width: 56, height: 56 }}
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