import {useState,useEffect} from 'react'
import MaterialTable from "@material-table/core"
import { makeStyles } from "@mui/styles";
import { getData ,serverURL ,postData } from '../../services/FetchNodeService';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
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
  } from "@mui/material"
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { display } from "@mui/system";
import Heading from "../../components/heading/Heading";
import { Restaurant, UploadFile } from "@mui/icons-material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import Swal from "sweetalert2";
const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "100%",
    background: "#dfe4ea",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: "90%",
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
export default function DisplayAllWaiter()
{  var classes = useStyles();
  var admin=JSON.parse(localStorage.getItem('ADMIN'))
  var navigate=useNavigate()
    const [listWaiter,setListWaiter]=useState([])
    const [open,setOpen] = useState(false)
   

    const fetchAllWaiter=async()=>{
     var result=await postData('waiters/fetch_all_waiter',{restaurantid:admin.restaurantid})
     setListWaiter(result.data)


    }


    //////////////////////////////////////////waiter data///////////////////////////////////////////////////
    const [restaurantId, setRestaurantId] = useState("");
    const [waiterId,setWaiterId]=useState("");
    const [waiterName, setWaiterName] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [emailId, setEmailId] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [address, setAddress] = useState("");
    const [picture, setPicture] = useState({});
    const [resError, setResError] = useState({});
    const [btnStatus,setBtnStatus] = useState({icon:false})
    const [tempFile , setTempFile]= useState({icon:''})

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
      if (restaurantId.length == 0) {
        handleError(true, "restaurantId", "Pls Input Restaurant Id");
        console.log(resError);
        submitRecord = false;
      }
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
      setBtnStatus((prev)=>({...prev,icon:true}))
    };
  
    const handleDate=(event)=>{
      const m=String(Number(event.$M)+1);
      const d=String(event.$D);
      const y=String(event.$y);
      setDob(y+"-"+m+"-"+d);   
    }
  
    const handleSubmit=async()=>{
        if(validation()){
    
          const body={'restaurantid':restaurantId,
                      'waiterid':waiterId,
                     'waitername':waiterName,
                     'gender':gender,
                     'dob':dob,
                     'mobileno':mobileNumber,
                     'emailid':emailId,
                     'address':address}
    
          const result=await postData('waiters/waiter_edit_data',body);
          
          if(result.status)
          {
            Swal.fire({
              icon: 'success',
              title: 'Waiter Registration',
              text: result.message,
              position:'top-end',
              timer:5000,
              showConfirmButton:false,
              toast:true
            })
            setOpen(false)
          }
          else
          {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: result.message,
              position:'top-end',
              timer:5000,
              showConfirmButton:false,
              toast:true
            })
            setOpen(false)
          }
        }  
        fetchAllWaiter()  
      }




 
   /////////////////////////////////////////////////////////////////////////////////////////////////////////////
       const handleCancel=()=>{
        setBtnStatus((prev)=>({...prev,icon:false}))
      setPicture(tempFile);   
  }

  const editImage=async()=>{
    var formData=new FormData()
    formData.append('waiterid',waiterId)
    formData.append('picture',picture.bytes)

    var result=await postData('waiters/waiter_edit_icon',formData)
    if(result.status)
    {
      Swal.fire({
        icon: 'success',
        title: 'Picture Update',
        text: result.message,
        position:'top-end',
        timer:5000,
        showConfirmButton:false,
        toast:true
        
      })
      
    }
    else
    {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: result.message,
        position:'top-end',
        timer:5000,
        showConfirmButton:false,
        toast:true

      })
      setOpen(false)
    }
     setBtnStatus((prev)=>({...prev,icon:false}))
      fetchAllWaiter()
}
   
   const editDeleteButton=(imgStutus)=>{
    return(
      <div>
        <Button onClick={()=>editImage(imgStutus)}>Edit</Button>
        <Button onClick={()=>handleCancel(imgStutus)}>Cancel</Button>
      </div>
    )
  }



   const handleEdit=(rowData)=>{
     setRestaurantId(rowData.restaurantid);
     setWaiterId(rowData.waiterid);
     setWaiterName(rowData.waitername);
     setGender(rowData.gender);
     setDob(rowData.dob);
     setMobileNumber(rowData.mobileno);
     setEmailId(rowData.emailid);
     setAddress(rowData.address);
     setPicture({url:`${serverURL}/images/${rowData.picture}`,bytes:''});
     setTempFile({url:`${serverURL}/images/${rowData.picture}`,bytes:''});
     
     setOpen(true);
   }

 

const handleDialogClose = ()=>{
    fetchAllWaiter();
    setOpen(false)
  }

  const showData = () =>{
    return (
        <div>
    
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Heading title={"Waiter Register"} />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Restaurant Id"
                onChange={(event) => setRestaurantId(event.target.value)}
                fullWidth
                onFocus={() => handleError(false, "restaurantId", "")}
                error={resError?.restaurantId?.error}
                helperText={resError?.restaurantId?.message}
                value={restaurantId}
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
                value={waiterName}
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
                  defaultValue={gender}
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
                        defaultValue={dayjs(dob)}
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
                      label="Mobile Number"
                      value={mobileNumber}
                      fullWidth />
                    
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                      onFocus={()=>handleError(false,'emailId','')}
                      error={resError?.emailId?.error}
                      helperText={resError?.emailId?.message}
                      label="Email Address" onChange={(event)=>setEmailId(event.target.value)} 
                      value={emailId}
                      fullWidth />
                      
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                      onFocus={()=>handleError(false,'address','')}
                      error={resError?.address?.error}
                      helperText={resError?.address?.message}
                      onChange={(event)=>setAddress(event.target.value)} label="Address"
                      value={address}
                      fullWidth/>

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
               <div>{btnStatus.icon?editDeleteButton():<></>}</div>
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
    )
  }
   
   
   
  const showDataForEdit=()=>{
    return(
    <Dialog 
    maxWidth={'md'}
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

   
   
   
   
   
   
   
   // update call for show data
        useEffect(function(){
            fetchAllWaiter()
        },[])

        const handleDelete=async(rowData)=>{
            Swal.fire({
              title: 'Do you want to delete the record?',
              showDenyButton: true,
              confirmButtonText: 'Delete',
              denyButtonText: `Don't Delete`,
            }).then(async(result) => {
              
              if (result.isConfirmed) {
                const body={'waiterid':rowData.waiterid}; 
                const result=await postData('waiters/waiter_delete',body);
      
                 if(result.status)      
                {Swal.fire('Deleted!', '', result.message)
                fetchAllWaiter()
                 }
                 else
                 Swal.fire('Fail!', '', result.message)
        
              } else if (result.isDenied) {
                Swal.fire('Waiter is not Deleted', '', 'info')
              }
            })
          }

    function DisplayAll() {
        return (
          <MaterialTable
            title="Waiter List"
            columns={[
                { title: 'Restaurant Id', field: 'restaurantid' },
                { title: 'Waiter Name', field:'waitername'},
                { title: 'Gender/ Birth Date' , render:rowData=><><div>{rowData.gender}/</div><>{rowData.dob}</></>},
                { title: 'Mobile No/ Email Id', render:rowData=><><div>{rowData.mobileno}</div><div>{rowData.emailid}</div></>},
                { title: 'Address' , field:'address'},
                             { title: 'Picture' , render:rowData=><div><img src={`${serverURL}/images/${rowData.picture}`} style={{width:50,height:50,borderRadius:10}} /></div>}

              
            ]}
            data={listWaiter}        
            actions={[
                {
                    icon: 'edit',
                    tooltip: 'Edit Restaurant',
                    onClick: (event, rowData) => handleEdit(rowData)
                  },
              {
                icon: 'delete',
                tooltip: 'Delete Category',
                onClick: (event, rowData) => handleDelete(rowData) 
              },
              {
                icon: 'add',
                isFreeAction: true,
                tooltip: 'Add Restaurant',
                onClick: (event, rowData) => navigate('/admindashboard/waiterinterface')
              }
            ]}
          />
        )
      }

return(
    <div className={classes.root}>
    <div className={classes.box}>
  <DisplayAll/>
  </div>
  {showDataForEdit()}
  </div>
)

}