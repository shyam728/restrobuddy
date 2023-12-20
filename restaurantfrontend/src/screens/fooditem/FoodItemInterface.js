import { useState, useEffect } from "react";
import { display } from "@mui/system";
import {
  Avatar,
  Grid,
  TextField,
  Button,
  Select,
  FormHelperText,
  FormControl,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Heading from "../../components/heading/Heading";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
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

  const [restaurantId, setRestaurantId] = useState(admin.restaurantid);
  const [categoryName, setCategoryName] = useState([]);
  const [categoryId , setCategoryId] = useState("")
  const [foodItemName, setFoodItemName] = useState("");
  const [foodType , setFoodType] = useState("")
  const [ingredients , setIngredients] = useState('')
  const [price , setPrice] = useState('')
  const [offerPrice , setOfferPrice] = useState('')
    const [fileIcon, setFileIcon] = useState({ url: "", bytes: "" });
    const [resError,setResError] = useState({})


    const handleError = (error, input,message)=>{
        setResError(prevState => ({...prevState,[input]:{'error':error,'message':message}}))
        console.log("CC",resError)
      }


      const fetchAllCategory = async () => {
        var result=await postData('categorys/fetch_all_category' , {restaurantid:admin.restaurantid})
       
        setCategoryName(result.data);
      };
      useEffect(function () {
        fetchAllCategory();
      }, []);


      const fillCategory = () => {
        return categoryName.map((item) => {
          return <MenuItem value={item.categoryid}>{item.categoryname}</MenuItem>;
        });
      };


      const handleIcon = (event) => {
        setFileIcon({
          url: URL.createObjectURL(event.target.files[0]),
          bytes: event.target.files[0],
        });
      };
      

// validation 
const validation = ()=>{
    var  submitRecord= true
    
    if(!categoryId){
        handleError(true,'categoryId','Pls Selected Category Name')
       
        submitRecord=false
      }
      if(foodItemName.trim().length==0){
        handleError(true,'foodItemName','Pls Input FoodItem Name')
        submitRecord=false
      }

      if(!foodType){
        handleError(true,'foodType','Pls Selected FoodType')
        submitRecord=false
      }
      if(ingredients.trim().length==0){
        handleError(true,'ingredients','Pls Input ingredients Name')
        submitRecord=false
      }
      if(price.trim().length==0){
        handleError(true,'price','Pls Input price ')
        submitRecord=false
      }
      if(offerPrice.trim().length==0){
        handleError(true,'offerPrice','Pls Input offerPrice ')
        submitRecord=false
      }
    if(!fileIcon.url){
      handleError(true,'icon','Pls Upload Icon')
      submitRecord=false
    }
    return submitRecord
  }






      const handleSubmit = async () => {
        var error = validation()
        if(error){
    
        var formData = new FormData();
        formData.append("restaurantid", restaurantId);
        formData.append("categoryid", categoryId);
        formData.append("fooditemname" ,foodItemName);
        formData.append("foodtype" ,foodType);
        formData.append("ingredients" ,ingredients);
        formData.append("price" ,price);
        formData.append("offerprice" ,offerPrice);
        formData.append("fileicon", fileIcon.bytes);
        var result = await postData("fooditems/fooditem_submit", formData);
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


  return (
    <div>
      <div className={classes.root}>
        <div className={classes.box}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Heading title={"FoodItem Register"} myroute={'/admindashboard/displayallfooditem'} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Restaurant Id"
               value={restaurantId}
               disabled
               fullWidth />
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Category Names</InputLabel>
                <Select label="Category Name"   value={categoryId} 
                  onFocus={()=> handleError(false,'categoryId','')}
                  error={resError?.categoryId?.error}
                  helperText={resError?.categoryId?.message}
                  onChange={(event) => setCategoryId(event.target.value)}
                >   
                  <MenuItem>-Select Categorys-</MenuItem>
                  {fillCategory()}
                </Select>
                <FormHelperText style={{color:'#d32f2f'}} >{resError?.categoryId?.message}</FormHelperText>
              </FormControl>
              {
                // resError?.categoryId?.error?<div>{resError?.categoryId?.message}</div>:<></>
              }
            </Grid>

            <Grid item xs={6}>
              <TextField label="FoodItemName" 
               onChange={(event) => setFoodItemName(event.target.value)}
              onFocus={()=> handleError(false,'foodItemName','')}
              error={resError?.foodItemName?.error}
              helperText={resError?.foodItemName?.message}
              fullWidth
               />

            </Grid>
            <Grid item xs={6}>
              <FormControl>
                <FormLabel>Food Type</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  onFocus={()=> handleError(false,'foodType','')}
                  error={resError?.foodType?.error}
                  helperText={resError?.foodType?.message}
                  onChange={(event) => setFoodType(event.target.value)}
                >
                  <FormControlLabel
                    value="Veg"
                    control={<Radio />}
                    label="Veg"
                  />
                  <FormControlLabel
                    value="Non-Veg"
                    control={<Radio />}
                    label="Non-Veg"
                  />
                </RadioGroup>
                <FormHelperText style={{color:'#d32f2f'}} >{resError?.foodType?.message}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField label="Ingredients Name" fullWidth 
               onChange={(event) => setIngredients(event.target.value)}
               onFocus={()=> handleError(false,'ingredients','')}
               error={resError?.ingredients?.error}
               helperText={resError?.ingredients?.message}
               />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Price" fullWidth
               onChange={(event) => setPrice(event.target.value)}
               onFocus={()=> handleError(false,'price','')}
               error={resError?.price?.error}
               helperText={resError?.price?.message}
               />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Offer Price"
               onChange={(event) => setOfferPrice(event.target.value)}
               onFocus={()=> handleError(false,'offerPrice','')}
               error={resError?.offerPrice?.error}
               helperText={resError?.offerPrice?.message}
              fullWidth />
            </Grid>
            <Grid item xs={12}>
            <Button
              fullWidth
              component="label"
              variant="contained"
              endIcon={<UploadFileIcon />}
              onFocus={()=> handleError(false,'fileIcon','')}
            >
              <input
                multiple
                onChange={handleIcon}
                hidden
                accept="image/*"
                type="file"
               
              />
              Upload FoodItem Icon
            </Button>
            { 
           resError?.fileIcon?.error?<div style={{color: 'rgb(211, 47, 47)', fontSize:'0.75rem' , margin:5 ,fontWeight:400}}>{resError?.icon?.message}</div>:<></> 
          }
          </Grid>
          <Grid item xs={12} className={classes.center}>
            <Avatar
              variant="rounded"
              alt="Remy Sharp"
              src={fileIcon.url}
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
  );
}
