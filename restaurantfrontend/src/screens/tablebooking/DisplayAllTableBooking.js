import {useState,useEffect} from 'react'
import MaterialTable from "@material-table/core"
import { makeStyles } from "@mui/styles";
import { getData ,serverURL ,postData } from '../../services/FetchNodeService';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {  Grid, TextField,  Select , FormHelperText, Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { display } from "@mui/system";
import Heading from "../../components/heading/Heading";
import { Restaurant, UploadFile } from "@mui/icons-material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

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
      width: "90%",
      height: "auto",
      borderRadius: 10,
      background: "#fff",
      padding: 10,
    },
    center: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  });

export default function DisplayAllTableBooking(){
    var classes = useStyles();
    var  admin = JSON.parse(localStorage.getItem('ADMIN'))  
    var navigate=useNavigate()
    const [listTableBooking,setListTableBooking]=useState([])
    const [open,setOpen] = useState(false)
   

    const fetchAllTableBooking=async()=>{
     var result=await postData('tablebookings/fetch_all_tablebooking' , {restaurantid:admin.restaurantid})
     setListTableBooking(result.data)


    }


    ///////////////////////////////////tablebooking data /////////////////////////////////////////

    const [restaurantId, setRestaurantId] = useState("");
    const [tableNo , setTableNo] =  useState("")
    const [noOfChairs , setNoOfChairs] = useState("")
    const [floor , setFloor] = useState("")
    const [tableId , setTableId] = useState("")
    const [resError,setResError] = useState({})

    const handleError = (error, input,message)=>{
      setResError(prevState => ({...prevState,[input]:{'error':error,'message':message}}))
      console.log("CC",resError)
    }


   

// validation 
const validation = ()=>{
  var  submitRecord= true
  if(restaurantId.length==0){
    handleError(true,'restaurantId','Pls Input Restaurant Id')
    console.log(resError);
    submitRecord=false
  }
  if(tableNo.length==0){
    handleError(true,'tableNo','Pls Input Table No')
    console.log(resError);
    submitRecord=false
  }
  if(noOfChairs.length==0){
    handleError(true,'noOfChairs','Pls Input No of Chairs')
    console.log(resError);
    submitRecord=false
  }
  if(floor.length==0){
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
    "floor":floor,
    "tableid":tableId
    
  }
    var result = await postData("tablebookings/tablebooking_edit_data", body);
    if (result.status) {
      Swal.fire({
        icon: "success",
        title: "Table edit",
        text: result.message,
      });
     
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: result.message,
      });
     
    }
    setOpen(false)
  }
fetchAllTableBooking()
  };


    ///////////////////////////////////////////////////////////////////////////////////////////////
    const handleEdit = (rowData)=>{
       
        setRestaurantId(rowData.restaurantid)
        setTableNo(rowData.tableno)
        setTableId(rowData.tableid)
        setNoOfChairs(rowData.noofchairs)
        setFloor(rowData.floor)
        

        setOpen(true)
      
      }


    const handleDialogClose = ()=>{
        setOpen(false)
      }



    const showData = () =>{
        return (
            <div>
                  <Grid container spacing={2}>
      <Grid item xs={12}>
            <Heading title={"Table Booking Registation"} />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Restaurant Id"
              onChange={(event) => setRestaurantId(event.target.value)}
              fullWidth
              onFocus={()=> handleError(false,'restaurantId','')}
              error={resError?.restaurantId?.error}
              helperText={resError?.restaurantId?.message}
              value={restaurantId}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Table No"
              onChange={(event) => setTableNo(event.target.value)}
              fullWidth
              onFocus={()=> handleError(false,'tableNo','')}
              error={resError?.tableNo?.error}
              helperText={resError?.tableNo?.message}
              value={tableNo}
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
              value={noOfChairs}
            />
          </Grid>
          <Grid item xs={6}>
          <FormControl fullWidth>
              <InputLabel>Select Floor</InputLabel>
              <Select
                onChange={(event) => setFloor(event.target.value)}
                label="Floor"
                onFocus={()=> handleError(false,'floor','')}
                error={resError?.floor?.error}
                helperText={resError?.floor?.message}
                 value={floor}
              >
                <MenuItem>-Select Floor-</MenuItem>
                <MenuItem value="rooftop">RoofTop</MenuItem>
                <MenuItem value="1st">1st </MenuItem>
                <MenuItem value="2nd">2nd </MenuItem>
                <MenuItem value="3rd">3rd </MenuItem>
                <MenuItem value="4th">4th </MenuItem>
                <MenuItem value="5th">5th </MenuItem>
              </Select>
              <FormHelperText style={{color:'#d32f2f'}} >{resError?.floor?.message}</FormHelperText>
            </FormControl>
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
            fetchAllTableBooking()
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
                var body={'tableid':rowData.tableid} 
                var result=await postData('tablebookings/tablebooking_delete',body)
                 if(result.status)      
            {      Swal.fire('Deleted!', '', result.message)
                 fetchAllTableBooking()
            }
                 else
                 Swal.fire('Fail!', '', result.message)
        
              } else if (result.isDenied) {
                Swal.fire('Table not Delete', '', 'info')
              }
            })
        
          }

        function DisplayAll() {
            return (
              <MaterialTable
                title="Table Booking List"
                columns={[
                  { title: 'RestaurantId', field: 'restaurantid' },
                  { title: 'TableNo', field: 'tableno' },
                  { title: 'No Of Chairs', field: 'noofchairs' },
                  { title: 'Floor', field: 'floor' },
                ]}
                data={listTableBooking}        
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
                    tooltip: 'Add Table Booking',
                    onClick: (event, rowData) => navigate('/admindashboard/tablebookinginterface')
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