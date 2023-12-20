import {useState,useEffect} from 'react'
import MaterialTable from "@material-table/core"
import { makeStyles } from "@mui/styles";
import { getData ,serverURL ,postData } from '../../services/FetchNodeService';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {Snackbar , Avatar, Grid, TextField,  Select , FormHelperText, Button } from "@mui/material";

import { display } from "@mui/system";
import Heading from "../../components/heading/Heading";
import { Restaurant, UploadFile } from "@mui/icons-material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
const useStyles = makeStyles({
  root: {
    width: "auto",
    height: "100%",
    background: "#dfe4ea",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding:20
  },
  box: {
    width: "90%",
    height: "auto",
    borderRadius: 10,
    background: "#fff",
    padding:10,
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
export default function DisplayAllCategory()
{  var classes = useStyles();
  var admin =  JSON.parse(localStorage.getItem('ADMIN'))
  var navigate=useNavigate()
 
    const [listCategory,setListCategory]=useState([])
    const [open,setOpen] = useState(false)
   

    const fetchAllCategory=async()=>{
     var result=await postData('categorys/fetch_all_category' , {restaurantid:admin.restaurantid})
     setListCategory(result.data)


    }


/////////////////////////////  Category data///////////////////////


const [categoryName, setCategoryName] = useState("");
const [categoryId, setCategoryId] = useState("");
    const [restaurantId, setRestaurantId] = useState("");
    const [icon,setIcon]=useState({url:'',bytes:''});
    const [resError,setResError] = useState({})
    const [btnStatus,setBtnStatus] = useState(false)
    const [tempFile,setTempFile]=useState({})

    const handleError = (error, input,message)=>{
      setResError(prevState => ({...prevState,[input]:{'error':error,'message':message}}))
      console.log("CC",resError)
    }


   

// validation 
const validation = ()=>{
  var  submitRecord= true
  // if(restaurantId.trim().length==0){
  //   handleError(true,'restaurantId','Pls Input Restaurant Id')
  //   console.log(resError);
  //   submitRecord=false
  // }
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
  setBtnStatus(true) 
};


const handleSubmit = async () => {
    var error = validation()
    if(error){
  var body={
    "categoryname":categoryName,
    "categoryid":categoryId,
    "restaurantid":restaurantId
  }
    var result = await postData("categorys/category_edit_data", body);
    if (result.status) {
      Swal.fire({
        icon: "success",
        title: "Category Registration",
        text: result.message,
      });
      setOpen(false)
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: result.message,
      });
      setOpen(false)
    }
  
  }
  fetchAllCategory()
  };




    

    ///////////////////////////////////////////////////////////////////////

    const handleCancel= ()=>{
     
      setBtnStatus(false);
      setIcon(tempFile)
    }
    const editImage= async ()=>{
     
       var formData = new FormData()
       formData.append('categoryid' , categoryId)
       formData.append('icon' , icon.bytes)
    
       var result = await postData('categorys/category_edit_icon',formData)
       if (result.status) {
        Swal.fire({
          icon: 'success',
          title: 'Icon Update',
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
      setBtnStatus(false)
      fetchAllCategory()
    }

    const handleEdit = (rowData)=>{
       
        setRestaurantId(rowData.restaurantid)
        setCategoryName(rowData.categoryname)
        setCategoryId(rowData.categoryid)
        setIcon({url:`${serverURL}/images/${rowData.icon}`,bytes:''})
        setTempFile({url:`${serverURL}/images/${rowData.icon}`,bytes:''})


        setOpen(true)
      
      }

      const editDeleteButton=()=>{
        return(
          <div>
           <Button onClick={editImage}>Edit</Button>
       <Button onClick={handleCancel}>Cancel</Button>
          </div>
        )
      }


    const handleDialogClose = ()=>{
        setOpen(false)
      }

      const showData = () =>{
        return (
            <div>


         
              <Grid container spacing={2}>
              <Grid item xs={12}>
                    <Heading title={"Restaurant Category Register"} />
                  </Grid>
                  <Grid item xs={12}>
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
                  <Grid item xs={12}>
                    <TextField
                      label="Category Name"
                      onChange={(event) => setCategoryName(event.target.value)}
                      fullWidth
                      onFocus={()=> handleError(false,'categoryName','')}
                      error={resError?.categoryName?.error}
                      helperText={resError?.categoryName?.message}
                      value={categoryName}
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
                      <div>{btnStatus?editDeleteButton():<></>}</div>
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
        fetchAllCategory()
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
          var body={'categoryid':rowData.categoryid} 
          var result=await postData('categorys/category_delete',body)
           if(result.status)      
      {      Swal.fire('Deleted!', '', result.message)
           fetchAllCategory()
      }
           else
           Swal.fire('Fail!', '', result.message)
  
        } else if (result.isDenied) {
          Swal.fire('Category not Delete', '', 'info')
        }
      })
  
    }

    function DisplayAll() {
        return (
          <MaterialTable
            title="Category List"
            columns={[
              { title: 'RestaurantId', field: 'restaurantid' },
              { title: 'CategoryName', field: 'categoryname' },
              { title: 'CategoryId', field: 'categoryid' },
              { title: 'Icon', 
              render:rowData=><div><img src={`${serverURL}/images/${rowData.icon}`}  style={{width:50,height:50,borderRadius:10}} /></div> }
              
            ]}
            data={listCategory}        
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
                tooltip: 'Add Category',
                onClick: (event, rowData) => navigate('/admindashboard/categoryinterface')
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