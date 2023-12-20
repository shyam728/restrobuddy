import MaterialTable from "@material-table/core"
import { makeStyles } from "@mui/styles";
import Button from '@mui/material/Button';
import { useState, useEffect } from "react";
import { serverURL, getData, postData } from "../../services/FetchNodeService";
import Swal from "sweetalert2";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {Snackbar , Avatar, Grid, TextField,  Select , FormHelperText } from "@mui/material";

import { display } from "@mui/system";
import Heading from "../../components/heading/Heading";
import { Restaurant, UploadFile } from "@mui/icons-material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { assignNestedKeys } from "@mui/system/cssVars/cssVarsParser";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  displayRoot: {
    width: "auto",
    height: "auto",
    background: "#dfe4ea",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
   
  },
  displayBox: {
    width: "100%",
    height: "auto",
    borderRadius: 10,
    background: "#fff",
    padding: 15,
  },
  root: {
   
    background: "#dfe4ea",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
   
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
export default function DisplayAllRestaurant(){
  var classes = useStyles();
  const navigate=useNavigate();
  const [listRestaurant, setListRestaurant] = useState([])
  const [open,setOpen] = useState(false)
/////////////////////////////  Restaurant Data ///////////////////////////
const [states, setStates] = useState([]);
const [cities, setCities] = useState([]);

const [stateid, setStateId] = useState("");

const [cityid, setCityId] = useState("");
const [restaurantId, setRestaurantId] = useState("");
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
const [tempFile , setTempFile]= useState({fssai:'', shopAct:'' , logo:''})
const [fileLogo, setFileLogo] = useState({ url: "", bytes: "" });
const [address, setAddress] = useState("");
const [resError,setResError] = useState({})
const [btnStatus,setBtnStatus] = useState({fssai:false, shopAct:false, logo:false})

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
  setBtnStatus((prev)=>({...prev,fssai:true}))
};
const handleShopAct = (event) => {
  setFileShopAct({
    url: URL.createObjectURL(event.target.files[0]),
    bytes: event.target.files[0],
  });
  setBtnStatus((prev)=>({...prev,shopAct:true}))
};
const handleLogo = (event) => {
  setFileLogo({
    url: URL.createObjectURL(event.target.files[0]),
    bytes: event.target.files[0],
  });
  setBtnStatus((prev)=>({...prev,logo:true}))
};

const handleSubmit = async () => {
  var error = validation()
  if(error){
    var d = new Date();
    var cd = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
var body={
  "restaurantname":restaurantName,
  "ownername": ownerName,
  "phonenumber": phoneNumber,
  "emailid": emailid,
  "mobilenumber": mobileNumber,
  "address": address,
  "stateid": stateid,
  "cityid": cityid,
  "url": url,
  "fssai": fssai,
  "gstno": gstNo,
  "gsttype": gstType,
  "updatedat": cd,
  "restaurantid":restaurantId
}
  var result = await postData("restaurants/restaurant_edit_data", body);
  if (result.status) {
    Swal.fire({
      icon: "success",
      title: "Restaurant Registration",
      text: result.message,
      position:'top-end',
         timer: 5000,
         showConfirmButton: false,
         toast:true
      
    });
    // setOpen(false)
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: result.message,
      position:'top-end',
      timer: 5000,
      showConfirmButton: false,
      toast:true
    });
    setOpen(false)
  }

}

};


//////////////////////////////////////////////////////////////////////////////////////////

const handleCancel= (imgStutus)=>{
  if(imgStutus == 1){
    setBtnStatus((prev)=>({...prev,fssai:false}))
    setFileFssai({url:tempFile.fssai, bytes:''})
  }else  if(imgStutus == 2){
    setBtnStatus((prev)=>({...prev,shopAct:false}))
    setFileShopAct({url:tempFile.shopAct, bytes:''})
  }else  if(imgStutus == 3){
    setBtnStatus((prev)=>({...prev,logo:false}))
    setFileLogo({url:tempFile.logo, bytes:''})
  }
  
     
}

const editImage= async (imgStutus)=>{
  if(imgStutus == 1){
   var formData = new FormData()
   formData.append('restaurantid' , restaurantId)
   formData.append('filefssai' , fileFssai.bytes)

   var result = await postData('restaurants/restaurant_edit_fssai',formData)
   if (result.status) {
    Swal.fire({
      icon: 'success',
      title: 'Restaurant Registration',
      text: result.message,
      position:'top-end',
      timer: 5000,
      showConfirmButton: false,
      toast:true
      
    })
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: result.message,
      position:'top-end',
      timer: 5000,
      showConfirmButton: false,
      toast:true
    });
    setOpen(false)
  }
  setBtnStatus((prev)=>({...prev,fssai:false}))
} else  if(imgStutus == 2){
  var formData = new FormData()
  formData.append('restaurantid' , restaurantId)
  formData.append('fileshopact' , fileShopAct.bytes)

  var result = await postData('restaurants/restaurant_edit_shopact',formData)
  if (result.status) {
   Swal.fire({
     icon: "success",
     title: "Restaurant Registration",
     text: result.message,
     position:'top-end',
     timer: 5000,
     showConfirmButton: false,
     toast:true
   });
   setOpen(false)
 } else {
   Swal.fire({
     icon: "error",
     title: "Oops...",
     text: result.message,
     position:'top-end',
     timer: 5000,
     showConfirmButton: false,
     toast:true
   });
   setOpen(false)
 }
 setBtnStatus((prev)=>({...prev,shopAct:false}))
} else  if(imgStutus == 3){
  var formData = new FormData()
  formData.append('restaurantid' , restaurantId)
  formData.append('logo' , fileLogo.bytes)

  var result = await postData('restaurants/restaurant_edit_logo',formData)
  if (result.status) {
   Swal.fire({
     icon: "success",
     title: "Restaurant Registration",
     text: result.message,
     position:'top-end',
     timer: 5000,
     showConfirmButton: false,
     toast:true
   });
   setOpen(false)
 } else {
   Swal.fire({
     icon: "error",
     title: "Oops...",
     text: result.message,
     position:'top-end',
     timer: 5000,
     showConfirmButton: false,
     toast:true
   });
   setOpen(false)
 }
 setBtnStatus((prev)=>({...prev,logo:false}))
}

}

  





const editDeleteButton=(imgStutus)=>{
  return(
    <div>
      <Button onClick={()=>editImage(imgStutus)}>Edit</Button>
      <Button onClick={()=>handleCancel(imgStutus)}>Cancel</Button>
    </div>
  )
}

  const fetchAllRestaurant = async()=>{
    var result = await getData('restaurants/fetch_all_restaurant')
    setListRestaurant(result.data)
  }

const handleEdit = (rowData)=>{
  fetchAllCities(rowData.stateid)
  setRestaurantId(rowData.restaurantid)
  setRestaurantName(rowData.restaurantname)
  setOwnerName(rowData.ownername)
  setMobileNumber(rowData.mobilenumber)
  setPhoneNumber(rowData.phonenumber)
  setEmailid(rowData.emailid)
  setAddress(rowData.address)
  setStateId(rowData.stateid)
  setCityId(rowData.cityid)
  setUrl(rowData.url)
  setFssai(rowData.fssai)
  setGstNo(rowData.gstno)
  setGstType(rowData.gsttype)
  setFileFssai({url:`${serverURL}/images/${rowData.filefssai}`,bytes:''})
  setFileShopAct({url:`${serverURL}/images/${rowData.fileshopact}`,bytes:''})
  setFileLogo({url:`${serverURL}/images/${rowData.filelogo}`,bytes:''})
  setTempFile({fssai:`${serverURL}/images/${rowData.filefssai}`, shopAct:`${serverURL}/images/${rowData.fileshopact}`,logo:`${serverURL}/images/${rowData.filelogo}`})
  setOpen(true)

}


const handleDialogClose = ()=>{
  setOpen(false)
  fetchAllRestaurant()
}

const showData = () =>{
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
              value={mobileNumber}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              onChange={(event) => setPhoneNumber(event.target.value)}
              label="Phone Number"
              fullWidth
              value={phoneNumber}
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
              value={emailid}
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
              value={address}
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
              value={url}
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
              value={fssai}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="GST Number"
              onChange={(event) => setGstNo(event.target.value)}
              fullWidth
              value={gstNo}
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
          <Grid item xs={4} >
          
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
          <Grid item xs={4} >
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
             <div>{btnStatus.fssai?editDeleteButton(1):<></>}</div>
          </Grid>
          <Grid item xs={4} className={classes.center}>
            <Avatar
              variant="rounded"
              alt="Remy Sharp"
              src={fileShopAct.url}
              sx={{ width: 56, height: 56 }}
            />
             <div>{btnStatus.shopAct?editDeleteButton(2):<></>}</div>
          </Grid>
          <Grid className={classes.center} item xs={4}>
            <Avatar
              variant="rounded"
              alt="Remy Sharp"
              src={fileLogo.url}
              sx={{ width: 56, height: 56 }}
            />
             <div>{btnStatus.logo?editDeleteButton(3):<></>}</div>
          </Grid>

         
        </Grid>
      </div>
    </div>
  );
}

  const showDataForEdit=()=>{
  return(
  <Dialog 
  maxWidth={'lg'}
  open={open}>
<DialogContent>
  {showData()}
</DialogContent>
<DialogActions>
<Button  onClick={handleSubmit}>Edit</Button>
  <Button onClick={handleDialogClose}>Close</Button>
</DialogActions>
  </Dialog>
  )
  }

  useEffect(function(){
    fetchAllRestaurant()
   
  },[])


  const handleDelete=async(rowData)=>{
    Swal.fire({
      title: 'Do you want to delete the record?',
      showDenyButton: true,
     
      confirmButtonText: 'Delete',
      denyButtonText: `Don't Delete`,
    }).then(async(result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        var body={'restaurantid':rowData.restaurantid} 
        var result=await postData('restaurants/restaurant_delete',body)
         if(result.status)      
    {      Swal.fire('Deleted!', '', result.message)
         fetchAllRestaurant()
    }
         else
         Swal.fire('Fail!', '', result.message)

      } else if (result.isDenied) {
        Swal.fire('Restaurant not Delete', '', 'info')
      }
    })

    
  
  }


    function displayAll() {
        return (
          
          <MaterialTable
            title="Restaurant List"
            columns={[
              { title: 'Restaurant/Ownername', field: 'restaurantname', render:(rowData)=><><div>{rowData.restaurantname}</div><div>{rowData.ownername}</div></> },
              { title: 'Address', field: 'ownername',render:(rowData)=><><div>{rowData.address}</div><div>{rowData.cityname},{rowData.statename}</div></> },
              { title: 'Contact', field: 'phonenumber', render:(rowData)=><><div>{rowData.phonenumber}</div><div>{rowData.mobilenumber}</div><div>{rowData.emailid}</div></>},
              { title: 'Documents',  render:(rowData)=><><div>Gst/Gsttype:{rowData.gstno},{rowData.gsttype}</div><div>Fssai:{rowData.fssai}</div></>},
              { title: 'Website', render:(rowData)=><><div><a href={rowData.url}>Visit</a></div></>},
              { title: 'Logo', render:(rowData)=><><div><img style={{width:50, height:50, borderRadius:10}} src={`${serverURL}/images/${rowData.filelogo}`} /></div></>},
             
            ]}
            data={listRestaurant}        
            actions={[
              {
                icon: 'edit',
                tooltip: 'Edit Restaurant',
                onClick: (event, rowData) => handleEdit(rowData)
              },
              {
                icon: 'delete',
                tooltip: 'Delete Restaurant',
                onClick: (event, rowData) => handleDelete(rowData) 
              },
              {
                icon: 'add',
                isFreeAction: true,
                tooltip: 'Add Restaurant',
                onClick: (event, rowData) => alert("You want to delete " + rowData.name)
              }
            ]}
          />
        )
      }

    return(
      <div className={classes.displayRoot}>
      <div className={classes.displayBox}>
       {displayAll()}
        </div>
        {showDataForEdit()}
        </div>

    )
}