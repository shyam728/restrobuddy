//! showdata =>showDataInDialog ///////////
//? showDataForEdit => showDialogForEdit ////////

import {useState,useEffect} from 'react'
import MaterialTable from "@material-table/core"
import { getData, serverURL,postData } from '../../services/FetchNodeService';
import {Button ,Dialog,DialogActions,DialogContent} from "@mui/material";
import Heading from '../../components/heading/Heading';
import { useStyles } from "./DisplayAllWaiterTableCss";

import {Grid,TextField,Select,InputLabel,MenuItem,FormControl,FormHelperText} from '@mui/material';
import { UploadFile } from "@mui/icons-material";
import Swal from 'sweetalert2';

import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router-dom';
export default function DisplayAllWaiterTable()
{  var classes = useStyles();
  var admin=JSON.parse(localStorage.getItem('ADMIN'))
    var navigate=useNavigate()
    const [listWaiterTable,setListWaiterTable]=useState([]);
    const [open,setOpen]=useState(false);
    const [waiterTableId,setWaiterTableId]=useState("");

    //?table Data/////////////////////////////////////////////////////////////////////////////////

    const [restaurantId,setRestaurantId]=useState("");
    const [waiter,setWaiter]=useState([]);
    const [waiterId,setWaiterId]=useState("");
    const [table,setTable]=useState([]);
    const [tableId,setTableId]=useState("");
    const [currentDate,setCurrentDate]=useState("");
    const [floorNo,setFloorNo]=useState('');
    const [floor,setFloor]=useState([]);

    const handleDate=(event)=>{
     const m=String(Number(event.$M)+1);
     const d=String(event.$D);
     const y=String(event.$y);
     setCurrentDate(y+"-"+m+"-"+d);   
   }
 
   //? Dropdown Filling/////////////////////////////////
   const fetchAllWaiter=async()=>{
      const result=await postData('waiters/fetch_all_waiter',{restaurantid:admin.restaurantid});
      setWaiter(result.data);
   }
 
   useEffect(function(){
       fetchAllWaiter();
       fetchAllTable();  
       fetchAllFloor();
       setRestaurantId(admin.restaurantid)
   },[]);
 
   const fillWaiter=()=>{
     return waiter.map((item)=>{
       return <MenuItem value={item.waiterid}>{item.waitername}</MenuItem>
     });
   }
 
   const fetchAllTable=async()=>{
     const result=await postData('tablebookings/fetch_all_tablebooking',{restaurantid:admin.restaurantid});
     setTable(result.data);
  }
 
  const fillTable=()=>{
    return table.map((item)=>{
      return <MenuItem value={item.tableid}>{item.tableno}</MenuItem>
    });
  }
 
   const handleSubmit=async()=>{
     if(true){
      
       const body={
         'restaurantid':restaurantId,
         'waiterid':waiterId,
         'tableid':tableId,
         'currentdate':currentDate,
         'waitertableid':waiterTableId
       }
       console.log(body,waiterTableId);
 
       const result=await postData('waitertable/waitertable_edit_data',body);
       
       if(result.status)
       {
         Swal.fire({
           icon: 'success',
           title: 'WaiterTable Registration',
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
     }    
 }
 
//     //?.//////////////////////////////////////////////////////////////////////////////////

const handleFloorChange = (event) =>{
  setFloorNo(event.target.value)
  fetchAllTable(event.target.value)
 }

    const fetchAllWaiterTable=async()=>{
     var result=await getData('waitertable/fetch_all_waitertable');
     setListWaiterTable(result.data);

    }

    const fetchAllFloor=async()=>{
      const result=await postData('tablebookings/fetch_all_floor' , {restaurantid:admin.restaurantid});
      setFloor(result.data);
   }

   const fillFloor=()=>{
    return floor.map((item)=>{
     return <MenuItem value={item.floor}>{item.floor}</MenuItem>
  });
}

    const handleEdit=(rowData)=>{
      setRestaurantId(rowData.restaurantid);
      setWaiterId(rowData.waiterid);
      setTableId(rowData.tableid);
      setCurrentDate(rowData.currentdate);
      setWaiterTableId(rowData.waitertableid);
      setOpen(true);
    }

    const handleDialogClose=()=>{
      setOpen(false);
      fetchAllWaiterTable();
     }

    const showDataInDialog=()=>{
      return(<div >
        <div >
          <Grid container spacing={2}>
    
            <Grid item xs={12}>
              <Heading title={"Register Food Item"} />
            </Grid>
            
            <Grid item xs={6}>
               <TextField 
             
               label={"Restaurant Id"} fullWidth 
               onChange={(event)=>setRestaurantId(event.target.value)}
               value={restaurantId}/>
            </Grid>
    
            <Grid item xs={6}>
               <FormControl fullWidth>
                <InputLabel>Waiter Name</InputLabel>
                <Select label={"Category Name"} 
                  
                   onChange={(event)=>setWaiterId(event.target.value)} 
                  value={waiterId}>
                  <MenuItem>-Select Waiter-</MenuItem>
                  {fillWaiter()}
                </Select>
                   
               </FormControl>
            </Grid>

            <Grid item xs={6}>
           <FormControl fullWidth>
            <InputLabel>Floor No</InputLabel>
            <Select label={"Floor no"} 
             
               onChange={(event)=>handleFloorChange(event)} 
              value={floorNo}>
              <MenuItem>-Select Floor-</MenuItem>
              {fillFloor()}
            </Select>
              
           </FormControl>
        </Grid>
    
            <Grid item xs={6}>
               <FormControl fullWidth>
                <InputLabel>Table No</InputLabel>
                <Select label={"Table no"} 
                  
                   onChange={(event)=>setTableId(event.target.value)} 
                  value={tableId}>
                  <MenuItem>-Select Table No-</MenuItem>
                  {fillTable()}
                </Select>
                   
               </FormControl>
            </Grid>
    
            <Grid item xs={6}>
                 <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker', 'DatePicker']}>        
                          <DatePicker
                            label="Current Date"
                            format="DD-MM-YYYY"
                            onChange={handleDate}
                            defaultValue={dayjs(currentDate)}     
                          />
                     </DemoContainer>
                 </LocalizationProvider>
              </Grid>
            
    
          </Grid>
        </div>
      </div>)
    } 

    const showDialogForEdit=()=>{
      return(
        <Dialog
          maxWidth={"sm"}
          open={open}>
            <DialogContent  >
               {showDataInDialog()}
           </DialogContent>
          
           <DialogActions>
             <Button onClick={handleSubmit}>Update</Button>
             <Button onClick={handleDialogClose}>Close</Button>
           </DialogActions>
        </Dialog>
       )}

    useEffect(function(){
        fetchAllWaiterTable()
    },[]);

    const handleDelete=async(rowData)=>{
      Swal.fire({
        title: 'Do you want to delete the record?',
        showDenyButton: true,
        confirmButtonText: 'Delete',
        denyButtonText: `Don't Delete`,
      }).then(async(result) => {
        
        if (result.isConfirmed) {
          const body={'waitertableid':rowData.waitertableid}; 
          const result=await postData('waitertable/waitertable_delete',body)
           if(result.status)      
          {Swal.fire('Deleted!', '', result.message)
          fetchAllWaiterTable()
           }
           else
           Swal.fire('Fail!', '', result.message)
  
        } else if (result.isDenied) {
          Swal.fire('WaiterTable is not Deleted', '', 'info')
        }
      })
    }


    function displayAll() {
        return (
          <MaterialTable
            title="WaiterTable List"
            columns={[
              { title: 'RestaurantId', field: 'restaurantid' },
              { title: 'Waiter Name', field:'waitername'},
              { title: 'Table No', render:(rowData)=><><div>{rowData.tableid}</div><div>F:{rowData.floor}, T:{rowData.tableno}</div></>},
              { title: 'CurrentDate', field:'currentdate'}
        
            ]}
            data={listWaiterTable}        
            actions={[
              {
                icon: 'edit',
                tooltip: 'Edit Table',
                onClick:  (event, rowData) => handleEdit(rowData)
              },
              {
                icon: 'delete',
                tooltip: 'Delete Table',
                onClick: (event, rowData) => handleDelete(rowData)
              },
              {
                icon: 'add',
                tooltip: 'Add Table',
                isFreeAction:true,
                onClick: (event, rowData) => navigate('/admindashboard/waitertableinterface')
              }
            ]}
          />
        )
      }


   return(
    <div className={classes.root}>
      <div className={classes.box}>
       {displayAll()}
    </div>
       {showDialogForEdit()}
    </div>
   )
}