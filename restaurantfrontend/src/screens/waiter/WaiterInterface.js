import { useState, useEffect } from "react";
import { display } from "@mui/system";
import {
  Avatar,
  Radio,
  Grid,
  TextField,
  Button,
  Select,
  FormHelperText,
  FormControl,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Heading from "../../components/heading/Heading";
import UploadFileIcon from "@mui/icons-material/UploadFile";


import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

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

export default function WaiterInterface() {
  var classes = useStyles();
  var  admin = JSON.parse(localStorage.getItem('ADMIN'))
  const [restaurantId, setRestaurantId] = useState(admin.restaurantid);
  const [waiterName, setWaiterName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [emailId, setEmailId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [picture, setPicture] = useState({});
  const [resError, setResError] = useState({});

  const handleError = (error, input, message) => {
    setResError((prevState) => ({
      ...prevState,
      [input]: { error: error, message: message },
    }));
    console.log("CC", resError);
  };

  // validation
  const validation = () => {
    var submitRecord = true;
 
    if (waiterName.trim().length == 0) {
      handleError(true, "waiterName", "Pls Input Waiter Name");
      console.log(resError);
      submitRecord = false;
    }
    if (gender.trim().length == 0) {
      handleError(true, "gender", "Pls Input gender");
      
      submitRecord = false;
    }
    
    if(!mobileNumber || !(/^[0-9]{10}$/).test(mobileNumber))
    {
      handleError(true,'mobileNumber',"Please Input 10 digit Mobile Number")
       
      submitRecord=false
    }
    if(!emailId || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailId)))
    {
      handleError(true,'emailId',"Please Input Correct Email Address")
       
      submitRecord=false 
    }
    if(address.trim().length===0)
    {
      handleError(true,'address',"please input address")

      submitRecord=false;
    }
    if (!picture.url) {
      handleError(true, "picture", "Pls Upload Picture");
      submitRecord = false;
    }
    return submitRecord;
  };

  const handlePicture = (event) => {
    setPicture({
      url: URL.createObjectURL(event.target.files[0]),
      bytes: event.target.files[0],
    });
  };

  const handleDate=(event)=>{
    const m=String(Number(event.$M)+1);
    const d=String(event.$D);
    const y=String(event.$y);
    setDob(y+"-"+m+"-"+d);   
  }

  const handleSubmit = async () => {
    var error = validation();
    if (error) {
      var formData = new FormData();
      formData.append("restaurantid", restaurantId);
      formData.append("waitername", waiterName);
      formData.append("gender", gender);
      formData.append("dob", dob);
      formData.append("mobileno", mobileNumber);
      formData.append("emailid", emailId);
      formData.append("address", address);
      formData.append("picture", picture.bytes);
      var result = await postData("waiters//waiter_submit", formData);
      if (result.status) {
        Swal.fire({
          icon: "success",
          title: "Waiter Added",
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
    <div>
      <div className={classes.root}>
        <div className={classes.box}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Heading title={"Waiter Register"} myroute={'/admindashboard/displayallwaiter'} />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Restaurant Id"
               value={admin.restaurantid}
                fullWidth
                disabled
               
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Waiter Name"
                onChange={(event) => setWaiterName(event.target.value)}
                fullWidth
                onFocus={() => handleError(false, "waiterName", "")}
                error={resError?.waiterName?.error}
                helperText={resError?.waiterName?.message}
              />
            </Grid>

            <Grid item xs={6}>
              <FormControl>
                <FormLabel>Gender</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  onFocus={() => handleError(false, "foodType", "")}
                  error={resError?.gender?.error}
                  helperText={resError?.gender?.message}
                  onChange={(event) => setGender(event.target.value)}
                >
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Male"
                  />
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Female"
                  />
                  <FormControlLabel
                    value="other"
                    control={<Radio />}
                    label="other"
                  />
                </RadioGroup>
                <FormHelperText style={{ color: "#d32f2f" }}>
                  {resError?.gender?.message}
                </FormHelperText>
              </FormControl>
            </Grid>


            <Grid item xs={6}  >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker', 'DatePicker']}>        
                      <DatePicker
                        label="DOB of Waiter"
                        format="DD-MM-YYYY"
                        onChange={handleDate}
                        fullWidth
                      />
                 </DemoContainer>
             </LocalizationProvider>
            </Grid>

            <Grid item xs={6}>
                      <TextField 
                      onFocus={()=>handleError(false,'mobileNumber','')}
                      error={resError?.mobileNumber?.error}
                      helperText={resError?.mobileNumber?.message}
                      onChange={(event)=>setMobileNumber(event.target.value)} 
                      label="Mobile Number" fullWidth/>
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                      onFocus={()=>handleError(false,'emailId','')}
                      error={resError?.emailId?.error}
                      helperText={resError?.emailId?.message}
                      label="Email Address" onChange={(event)=>setEmailId(event.target.value)} fullWidth/>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                      onFocus={()=>handleError(false,'address','')}
                      error={resError?.address?.error}
                      helperText={resError?.address?.message}
                      onChange={(event)=>setAddress(event.target.value)} label="Address" fullWidth/>
                    </Grid>


            <Grid item xs={6}>
              <Button
                fullWidth
                component="label"
                variant="contained"
                endIcon={<UploadFileIcon />}
                onFocus={() => handleError(false, "picture", "")}
              >
                <input
                  multiple
                  onChange={handlePicture}
                  hidden
                  accept="image/*"
                  type="file"
                />
                Upload Picture
              </Button>
              {resError?.picture?.error ? (
                <div
                  style={{
                    color: "rgb(211, 47, 47)",
                    fontSize: "0.75rem",
                    margin: 5,
                    fontWeight: 400,
                  }}
                >
                  {resError?.picture?.message}
                </div>
              ) : (
                <></>
              )}
            </Grid>


            



            <Grid item xs={6} className={classes.center}>
              <Avatar
                variant="rounded"
                alt="Remy Sharp"
                src={picture.url}
                sx={{ width: 56, height: 56 }}
              />
            </Grid>

            <Grid item xs={6}>
              <Button fullWidth variant="contained" onClick={handleSubmit}>
                Submit
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button fullWidth variant="contained">
                Reset
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}
