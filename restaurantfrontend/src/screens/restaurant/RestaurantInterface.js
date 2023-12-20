import { useState, useEffect } from "react";

import { Avatar, Grid, TextField, Button, Select , FormHelperText } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { display } from "@mui/system";
import Heading from "../../components/heading/Heading";
import { Restaurant, UploadFile } from "@mui/icons-material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import UploadFileIcon from "@mui/icons-material/UploadFile";
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
export default function RestaurantInterface() {
  var classes = useStyles();
  
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [stateid, setStateId] = useState("");

  const [cityid, setCityId] = useState("");

  const [restaurantName, setRestaurantName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailid, setEmailid] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [url, setUrl] = useState("");
  const [gstNo, setGstNo] = useState("");
  const [fssai, setFssai] = useState("");
  const [gstType, setGstType] = useState("");
  const [fileFssai, setFileFssai] = useState({ url: "", bytes: "" });
  const [fileShopAct, setFileShopAct] = useState({ url: "", bytes: "" });
  const [fileLogo, setFileLogo] = useState({ url: "", bytes: "" });
  const [address, setAddress] = useState("");
  const [password , setPassword] = useState("")
  
  const [resError,setResError] = useState({})

  const handleReset = () =>{
   setRestaurantName('')
   setOwnerName('')
   setStateId('-Select State-')
   setCityId('-Select City-')
   setPhoneNumber('')
   setMobileNumber('')
   setAddress('')
   setEmailid('')

  }

const generatePassword = () =>{
var pwd = parseInt((Math.random()*8999)+1000)
return pwd
}

  const handleError = (error, input,message)=>{
    setResError(prevState => ({...prevState,[input]:{'error':error,'message':message}}))
    console.log("CC",resError)
  }

// validation 
const validation = ()=>{
      var  submitRecord= true
      if(restaurantName.trim().length==0){
        handleError(true,'restaurantName','Pls Input Restaurant Name')
        console.log(resError);
        submitRecord=false
      }
      if(ownerName.trim().length==0){
        handleError(true,'ownerName','Pls Input Owner Name')
        console.log(resError);
        submitRecord=false
      }
      if(!mobileNumber || !(/^[0-9]{10}$/).test(mobileNumber)){
        handleError(true,'mobileNumber','Pls Input correct Mobile Number')
        submitRecord=false
      }
      if(!emailid || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailid))) 
    {
      handleError(true,'emailid',"Pls Input Correct Email Address")
       
      submitRecord=false
    }
    if(!address){
      handleError(true,'address','Pls Input Address')
     
      submitRecord=false
    }
    if(!stateid){
      handleError(true,'stateid','Pls Input State')
     
      submitRecord=false
    }
    if(!cityid){
      handleError(true,'cityid','Pls Input City')
     
      submitRecord=false
    }
    if(!fileFssai.url){
      handleError(true,'fileFssai','Pls Upload Fssai File')
     
      submitRecord=false
    }





    if(!fssai){
      handleError(true,'fssai','Pls Input Fssai Number')
      submitRecord=false
    }
    if(!fileShopAct.url){
      handleError(true,'fileShopAct','Pls Upload Logo')
      submitRecord=false
    }
    if(!fileLogo.url){
      handleError(true,'fileLogo','Pls Upload Logo')
      submitRecord=false
    }
     
      return submitRecord

}











  const fetchAllStates = async () => {
    var result = await getData("statecity/fetch_all_states");
    console.log(result);
 
    setStates(result.data);
  };
  useEffect(function () {
    fetchAllStates();
  }, []);

  const fillState = () => {
    return states.map((item) => {
      return <MenuItem value={item.stateid}>{item.statename}</MenuItem>;
    });
  };

  const fetchAllCities = async (stateid) => {
    var body = { stateid: stateid };
    var result = await postData("statecity/fetch_all_cities", body);
    setCities(result.data);
  };

  const fillCities = () => {
    return cities.map((item) => {
      return <MenuItem value={item.cityid}>{item.cityname}</MenuItem>;
    });
  };

  const handleStateChange = (event) => {
    setStateId(event.target.value);
    fetchAllCities(event.target.value);
  };

  const handleFssai = (event) => {
    setFileFssai({
      url: URL.createObjectURL(event.target.files[0]),
      bytes: event.target.files[0],
    });
  };
  const handleShopAct = (event) => {
    setFileShopAct({
      url: URL.createObjectURL(event.target.files[0]),
      bytes: event.target.files[0],
    });
  };
  const handleLogo = (event) => {
    setFileLogo({
      url: URL.createObjectURL(event.target.files[0]),
      bytes: event.target.files[0],
    });
  };

  const handleSubmit = async () => {
    var error = validation()
    if(error){

  
    var formData = new FormData();
    formData.append("restaurantname", restaurantName);
    formData.append("ownername", ownerName);
    formData.append("phonenumber", phoneNumber);
    formData.append("emailid", emailid);
    formData.append("mobilenumber", mobileNumber);
    formData.append("address", address);
    formData.append("stateid", stateid);
    formData.append("cityid", cityid);
    formData.append("url", url);
    formData.append("fssai", fssai);
    formData.append("gstno", gstNo);
    formData.append("gsttype", gstType);
    formData.append('password', generatePassword())
    formData.append("filelogo", fileLogo.bytes);
    formData.append("fileshopact", fileShopAct.bytes);
    formData.append("filefssai", fileFssai.bytes);
    var d = new Date();
    var cd = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    formData.append("createdat", cd);
    formData.append("updatedat", cd);
    var result = await postData("restaurants/restaurant_submit", formData);
    if (result.status) {
      Swal.fire({
        icon: "success",
        title: "Restaurant Registration",
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

  return (
    <div className={classes.root}>
      <div className={classes.box}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Heading title={"Restaurant Register"} />
          </Grid>
          <Grid item xs={6}>
            <TextField
              onChange={(event) => setRestaurantName(event.target.value)}
              label="Restaurant Name"
              fullWidth
              onFocus={()=> handleError(false,'restaurantName','')}
              error={resError?.restaurantName?.error}
              helperText={resError?.restaurantName?.message}
              value={restaurantName}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              onChange={(event) => setOwnerName(event.target.value)}
              label="Owner Name"
              fullWidth
              onFocus={()=> handleError(false,'ownerName','')}
              error={resError?.ownerName?.error}
              helperText={resError?.ownerName?.message}
              value={ownerName}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              onChange={(event) => setMobileNumber(event.target.value)}
              label="Mobile Number"
              fullWidth
              onFocus={()=> handleError(false,'mobileNumber','')}
              error={resError?.mobileNumber?.error}
              helperText={resError?.mobileNumber?.message}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              onChange={(event) => setPhoneNumber(event.target.value)}
              label="Phone Number"
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              onChange={(event) => setEmailid(event.target.value)}
              label="Email Address"
              fullWidth
              onFocus={()=> handleError(false,'emailid','')}
              error={resError?.emailid?.error}
              helperText={resError?.emailid?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address"
              onChange={(event) => setAddress(event.target.value)}
              fullWidth
              onFocus={()=> handleError(false,'address','')}
              error={resError?.address?.error}
              helperText={resError?.address?.message}
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>State</InputLabel>
              <Select
                label="State"
                value={stateid}
                onChange={handleStateChange}

                onFocus={()=> handleError(false,'stateid','')}
                error={resError?.stateid?.error}
                helperText={resError?.stateid?.message}


              >
                <MenuItem>-Select State-</MenuItem>
                {fillState()}
              </Select>
              <FormHelperText style={{color:'#d32f2f'}} >{resError?.stateid?.message}</FormHelperText>
            </FormControl>
           { 
           //resError?.stateid?.error?<div>{resError?.stateid?.message}</div>:<></> 
          }
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>City</InputLabel>
              <Select
                label="City"
                value={cityid}
                onChange={(event) => setCityId(event.target.value)}

                onFocus={()=> handleError(false,'cityid','')}
                error={resError?.cityid?.error}
                helperText={resError?.cityid?.message}

              >
                <MenuItem>-Select City-</MenuItem>
                {fillCities()}
              </Select>
              <FormHelperText style={{color:'#d32f2f'}} >{resError?.cityid?.message}</FormHelperText>

            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="URL"
              onChange={(event) => setUrl(event.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Fssai Number"
              onChange={(event) => setFssai(event.target.value)}
              fullWidth
              onFocus={()=> handleError(false,'fssai','')}
              error={resError?.fssai?.error}
              helperText={resError?.fssai?.message}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="GST Number"
              onChange={(event) => setGstNo(event.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>GST Type</InputLabel>
              <Select
                onChange={(event) => setGstType(event.target.value)}
                label="GST Type"
                value={gstType}
              >
                <MenuItem>-Select Gst type-</MenuItem>
                <MenuItem value="5 star">5 Star</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <Button
              fullWidth
              component="label"
              variant="contained"
              endIcon={<UploadFileIcon />}
              onFocus={()=> handleError(false,'fileFssai','')}
            >
              <input
                multiple
                onChange={handleFssai}
                hidden
                accept="image/*"
                type="file"

               
                // error={resError?.fileFssai?.error}
                // helperText={resError?.fileFssai?.message}
              />
              Upload Fssai
            </Button>
            { 
           resError?.fileFssai?.error?<div style={{color: 'rgb(211, 47, 47)', fontSize:'0.75rem' , margin:5 ,fontWeight:400}}>{resError?.fileFssai?.message}</div>:<></> 
          }
          </Grid>
          <Grid item xs={4}>
            <Button
              fullWidth
              component="label"
              variant="contained"
              endIcon={<UploadFileIcon />}

              onFocus={()=> handleError(false,'fileShopAct','')}
            >
              <input
                multiple
                onChange={handleShopAct}
                hidden
                accept="image/*"
                type="file"
              />
              Upload Shop Act
            </Button>
            { 
           resError?.fileShopAct?.error?<div style={{color: 'rgb(211, 47, 47)', fontSize:'0.75rem' , margin:5 ,fontWeight:400}}>{resError?.fileShopAct?.message}</div>:<></> 
          }
          </Grid>
          <Grid item xs={4}>
            <Button
              fullWidth
              component="label"
              variant="contained"
              endIcon={<UploadFileIcon />}
              onFocus={()=> handleError(false,'fileLogo','')}
            >
              <input
                multiple
                onChange={handleLogo}
                hidden
                accept="image/*"
                type="file"
               
              />
              Upload Logo
            </Button>
            { 
           resError?.fileLogo?.error?<div style={{color: 'rgb(211, 47, 47)', fontSize:'0.75rem' , margin:5 ,fontWeight:400}}>{resError?.fileLogo?.message}</div>:<></> 
          }
          </Grid>

          <Grid item xs={4} className={classes.center}>
            <Avatar
              variant="rounded"
              alt="Remy Sharp"
              src={fileFssai.url}
              sx={{ width: 56, height: 56 }}
            />
          </Grid>
          <Grid item xs={4} className={classes.center}>
            <Avatar
              variant="rounded"
              alt="Remy Sharp"
              src={fileShopAct.url}
              sx={{ width: 56, height: 56 }}
            />
          </Grid>
          <Grid className={classes.center} item xs={4}>
            <Avatar
              variant="rounded"
              alt="Remy Sharp"
              src={fileLogo.url}
              sx={{ width: 56, height: 56 }}
            />
          </Grid>

          <Grid item xs={6}>
            <Button fullWidth onClick={handleSubmit} variant="contained">
              Submit
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button onClick={handleReset} fullWidth variant="contained">
              Reset
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
