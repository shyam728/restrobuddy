import { useEffect , useState } from "react"
import { TextField , Grid , MenuItem , FormControl , Select , InputLabel } from "@mui/material"
import { useStyles } from "./FoodBookingCss"
import {postData , serverURL} from "../../services/FetchNodeService"
import TableComponent from "../../components/TableComponent/TableComponent"
import CategoryComponent from "../../components/CategoryComponent/CategoryComponent"
import { style } from "@mui/system"
import TableCart from "../../components/TableCart/TableCart"



export default function FoodBooking(props){
    const classes = useStyles();
    var admin=JSON.parse(localStorage.getItem('ADMIN'))

    const [currentDate , setCurrentDate] = useState('')
    const [waiter,setWaiter]=useState([]);
    const [waiterId,setWaiterId]=useState("")
    const [waiterName,setWaiterName]=useState("");
    const [floorNo , setFloorNo] = useState('')
    const [tableNo , setTableNo] = useState('')
    const [refresh , setRefresh] = useState(false)
    const [foodStatus , setFoodStutus] = useState(false);
   
   
    const getCurrentDate = () =>{
        var date = new Date()
        var cd = date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()
        return cd
       
    }
    const getCurrentTime = () =>{
        var time = new Date()
        var ct = time.getHours()+":"+time.getMinutes()
        return ct
    }

    const fetchAllWaiter=async()=>{
        const result=await postData('waiters/fetch_all_waiter' , {restaurantid:admin.restaurantid});
        setWaiter(result.data);
     }

    useEffect(function(){
          setCurrentDate(getCurrentDate() + " " + getCurrentTime())
          fetchAllWaiter();
    } ,[])

    const fillWaiter=()=>{
        return waiter.map((item)=>{
          return <MenuItem value={item.waiterid}>{item.waitername}</MenuItem>
        });
      }

   const handleWaiter = (event , value) =>{
    // alert(value.props.children)
         setWaiterId(event.target.value)
         setWaiterName(value.props.children)
         
   }




    return(
       <div className={classes.root}>
        <div className={classes.box}>
         <Grid container spacing={3}>
           
            <Grid item xs={4}>
            <TextField  label="Current Date" value={currentDate}  />
            </Grid>
            <Grid item xs={4}>
           <FormControl fullWidth>
            <InputLabel>Waiter Name</InputLabel>
            <Select label={"Category Name"} 
              
               onChange={handleWaiter} 
              value={waiterId}>
              <MenuItem>-Select Waiter-</MenuItem>
              {fillWaiter()}
            </Select>
               
           </FormControl>
        </Grid>
      <Grid item xs={4} sx={{color:'#237c75', textAlign:'right', fontFamily:'kanit' , fontWeight:'bold' , fontSize:36}}>
      {floorNo} {tableNo.length!=0?<>Table {tableNo}</>:<></>}
      </Grid>


         </Grid>
       
        </div>
        <div className={classes.tableBox}>
          <Grid container spacing={1}>
          <Grid item xs={3}>
              <CategoryComponent floorNo={floorNo} tableNo={tableNo} refresh={refresh} setRefresh={setRefresh}/>
            </Grid>
            <Grid item xs={4}>
            <TableComponent floorNo={floorNo} setFloorNo={setFloorNo} tableNo={tableNo} setTableNo={setTableNo}/>
            </Grid>
            <Grid item xs={5}>
        <TableCart waiterName={waiterName} tableNo={`#${floorNo}${tableNo}`}    refresh={refresh} setRefresh={setRefresh} />
       </Grid>
          </Grid>
       
        </div>
      
       </div>
    )
}