import { useEffect , useState } from 'react'; 
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import {Avatar , Typography} from '@mui/material';
import DraftsIcon from '@mui/icons-material/Drafts';
import { postData , serverURL } from '../../services/FetchNodeService';
import React from 'react';
import FoodComponent from '../FoodComponent/FoodComponent';

export default function CategoryComponent(props) {
    var admin =  JSON.parse(localStorage.getItem('ADMIN'))
  const [listCategory , setListCategory] = useState([])
  const [categoryId , setCategoryId] = useState('')
  const [open , setOpen] = useState(false)




     // update call for show data
     useEffect(function(){
      fetchAllCategory()
  },[])

    const fetchAllCategory=async()=>{
        var result=await postData('categorys/fetch_all_category' , {restaurantid:admin.restaurantid})
       setListCategory(result.data)
   
   
       }

       const handleFoodListDialoge = (cid) =>{
       setCategoryId(cid)
       setOpen(true)
       }

        
        const showCategoryList=()=>{
            return listCategory.map((item)=>{
            return(
                <div>
                     <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <ListItemButton alignItems="flex-start" onClick={()=>handleFoodListDialoge(item.categoryid)}>
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src={`${serverURL}/images/${item.icon}`} sx={{width:30, height:30}} />
        </ListItemAvatar>
        <ListItemText
          primary={item.categoryname}
         
        />
      </ListItemButton>
      <Divider variant="inset" component="li" />
      </List>
     
                </div>

            )
        })
        }
      

  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {showCategoryList()}
      <FoodComponent categoryid={categoryId} setOpen={setOpen} open={open} tableNo={props.tableNo} floorNo={props.floorNo} refresh={props.refresh} setRefresh={props.setRefresh}/>
    </Box>
  );
}