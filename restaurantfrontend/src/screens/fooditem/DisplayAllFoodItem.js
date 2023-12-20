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
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
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
    height: "auto",
    background: "#dfe4ea",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: "85%",
    height: "auto",
    borderRadius: 10,
    background: "#fff",
    padding: 15,
    marginBlock:'40px',
    boxShadow:"0 0 15px #222"
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
export default function DisplayAllFoodItem()
{  var classes = useStyles();
  var  admin = JSON.parse(localStorage.getItem('ADMIN'))
  var navigate=useNavigate()
    const [listFoodItem,setListFoodItem]=useState([])
    const [open,setOpen] = useState(false)
   

    const fetchAllFoodItem=async()=>{
     var result=await postData('fooditems/fetch_all_fooditem' , {restaurantid:admin.restaurantid})
    
     setListFoodItem(result.data)


    }


    /////////////////////////////  FoodItem data///////////////////////

    const [foodItemId, setFoodItemId] = useState("");
    const [restaurantId, setRestaurantId] = useState("");
    const [categoryName, setCategoryName] = useState([]);
    const [categoryId , setCategoryId] = useState("")
    const [foodItemName, setFoodItemName] = useState("");
    const [foodType , setFoodType] = useState("")
    const [ingredients , setIngredients] = useState('')
    const [price , setPrice] = useState('')
    const [offerPrice , setOfferPrice] = useState('')
      const [fileIcon, setFileIcon] = useState({ url: "", bytes: "" });
      const [resError,setResError] = useState({})
      const [btnStatus,setBtnStatus] = useState({icon:false})
      const [tempFile , setTempFile]= useState({icon:''})
  
      const handleError = (error, input,message)=>{
          setResError(prevState => ({...prevState,[input]:{'error':error,'message':message}}))
          console.log("CC",resError)
        }
  
  
        const fetchAllCategory = async () => {
          var result=await postData('categorys/fetch_all_category' , {restaurantid:admin.restaurantid})
          console.log(result);
         
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
          setBtnStatus((prev)=>({...prev,icon:true}))
        };
        
  
  // validation 
  const validation = ()=>{
      var  submitRecord= true
      if(!restaurantId){
        handleError(true,'restaurantId','Pls Input Restaurant Id')
        console.log(resError);
        submitRecord=false
      }
      if(!categoryId){
          handleError(true,'categoryId','Pls Selected Category Name')
         
          submitRecord=false
        }
        if(!foodItemName){
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
        handleError(true,'fileIcon','Pls Upload Icon')
        submitRecord=false
      }
      return submitRecord
    }
  
  
  
  
  
  
        const handleSubmit = async () => {
          var error = validation()
          if(error){
            var body={
              "categoryid":categoryId,
              "restaurantid":restaurantId,
              "fooditemid":foodItemId,
              "fooditemname" : foodItemName,
              "foodtype" : foodType ,
             "ingredients" :ingredients , 
             "price" :price,
             "offerprice" : offerPrice
            }




         
          
          var result = await postData("fooditems/fooditem_edit_data", body);
          if (result.status) {
            Swal.fire({
              icon: "success",
              title: "Category Added",
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
       fetchAllFoodItem()
        }




    /////////////////////////////////////////////////////////////////
  



    const handleEdit = (rowData)=>{
      setRestaurantId(rowData.restaurantid)
      setFoodItemId(rowData.fooditemid)
     
      setCategoryId(rowData.categoryid)
      setFoodItemName(rowData.fooditemname)
      setFoodType(rowData.foodtype)
      setIngredients(rowData.ingredients)
      setPrice(rowData.price)
      setOfferPrice(rowData.offerprice)

     
      setFileIcon({url:`${serverURL}/images/${rowData.fileicon}`,bytes:''})
      setTempFile({icon:`${serverURL}/images/${rowData.fileicon}`})

      setOpen(true)
    
    }


    // edit image 
const editDeleteButton=(imgStutus)=>{
  return(
    <div>
      <Button onClick={()=>editImage(imgStutus)}>Edit</Button>
      <Button onClick={()=>handleCancel(imgStutus)}>Cancel</Button>
    </div>
  )
}

    const editImage= async ()=>{
     
      var formData = new FormData()
      formData.append('fooditemid' , foodItemId)
      formData.append('fileicon' , fileIcon.bytes)
   
      var result = await postData('fooditems/fooditem_edit_icon',formData)
      if (result.status) {
       Swal.fire({
         icon: 'success',
         title: 'Category Registration',
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
     setBtnStatus((prev)=>({...prev,icon:false}))
     fetchAllCategory()
   }


   const handleCancel= ()=>{
     
    setBtnStatus((prev)=>({...prev,icon:false}))
    setFileIcon({url:tempFile.icon, bytes:''})

}









// show data
const handleDialogClose = ()=>{
  setOpen(false)
}

const showData = () =>{
  return (
    <div>
     
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Heading title={"Update Food"} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Restaurant Id"
                onChange={(event) => setRestaurantId(event.target.value)}
                onFocus={()=> handleError(false,'restaurantId','')}
                error={resError?.restaurantId?.error}
                helperText={resError?.restaurantId?.message}
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
              value={foodItemName}
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
                  defaultValue={foodType}
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
               value={ingredients}
               />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Price" fullWidth
               onChange={(event) => setPrice(event.target.value)}
               onFocus={()=> handleError(false,'price','')}
               error={resError?.price?.error}
               helperText={resError?.price?.message}
               value={price}
               />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Offer Price"
               onChange={(event) => setOfferPrice(event.target.value)}
               onFocus={()=> handleError(false,'offerPrice','')}
               error={resError?.offerPrice?.error}
               helperText={resError?.offerPrice?.message}
              fullWidth
              value={offerPrice}
              />
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
           resError?.fileIcon?.error?<div style={{color: 'rgb(211, 47, 47)', fontSize:'0.75rem' , margin:5 ,fontWeight:400}}>{resError?.fileIcon?.message}</div>:<></> 
          }
          </Grid>
          <Grid item xs={12} className={classes.center}>
            <Avatar
              variant="rounded"
              alt="Remy Sharp"
              src={fileIcon.url}
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
            <Button fullWidth variant="contained" >
              Reset
            </Button>
          </Grid>

          </Grid>
       
    </div>
  );
}





    // dailogue box
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



    useEffect(function(){
      fetchAllFoodItem()
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
        var body={'fooditemid':rowData.fooditemid} 
        var result=await postData('fooditems/fooditem_delete',body)
         if(result.status)      
    {      Swal.fire('Deleted!', '', result.message)
         fetchAllFoodItem()
    }
         else
         Swal.fire('Fail!', '', result.message)

      } else if (result.isDenied) {
        Swal.fire('FoodItem not Delete', '', 'info')
      }
    })

  }
    function DisplayAll() {
      return (
        <MaterialTable
          title="FoodItem List"
          columns={[
            { title: 'RestaurantId', field: 'restaurantid' },
            { title: 'Category Name', field: 'categoryname' },

            { title: 'Food Name', 
            render:rowData=><><b>{rowData.fooditemname}</b><> ({rowData.foodtype})</></> },

            { title: 'Ingredients', field: 'ingredients' },
         
            { title: 'Price',
            render:rowData=><><s>{rowData.price}</s>/<>{rowData.offerprice}</></>},
            { title: 'Icon', render:(rowData)=><><div><img style={{width:50, height:50, borderRadius:10}} src={`${serverURL}/images/${rowData.fileicon}`} /></div></>},


            
          ]}
          data={listFoodItem}        
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
              onClick: (event, rowData) => navigate('/admindashboard/fooditeminterface')
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