import { useEffect, useState } from "react";
import { Grid, Divider , Button, TextField} from "@mui/material";
import { postData ,serverURL } from "../../services/FetchNodeService";
import { useNavigate  } from "react-router-dom";
import {  useSelector , useDispatch } from "react-redux";
import Plusminus from "../Plusminus/Plusminus";
import Swal from "sweetalert2";
import { useCallback } from "react";
import useRazorpay from "react-razorpay";

export default function TableCart(props){
  var admin=JSON.parse(localStorage.getItem('ADMIN'))
  var gst=parseInt(admin.gsttype/2)
  const [Razorpay] = useRazorpay();
 
  const  [customername , setCustomerName] = useState('');
  const  [mobileno , setMobileNo]  = useState('')

  var dispatch=useDispatch()
    var navigate = useNavigate();
    var foodOrder = useSelector((state)=>state.orderData);

    const getCurrentDate = () =>{
      var date = new Date()
      var cd = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()
      return cd
     
  }
  const getCurrentTime = () =>{
      var time = new Date()
      var ct = time.getHours()+":"+time.getMinutes()
      return ct
  }

  //////////////////////////////////Razorpay api (payment api) /////////////////////////

  const handlePayment = useCallback(async(na) => {
     
      
    const options = {
      key: "rzp_test_GQ6XaPC6gMPNwH",
      amount: na*100,
      currency: "INR",
      name: admin.restaurantname,
      description: "Online Payments",
      image: `${serverURL}/images/${admin.filelogo}`,
     
      handler: (res) => {
        console.log("Payment Details",res);
      },
      prefill: {
        name: customername,
        email: "youremail@example.com",
        contact: mobileno,
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzpay = new Razorpay(options);
    rzpay.open();
  }, [Razorpay]);




  //////////////////////////////////////////////////////////////

 
    const handleSave = async ()=>{
          var body = {billtime:getCurrentTime(), billdate:getCurrentDate(), tableno:props.tableNo, server:props.waiterName, fssai:admin.fssai, cnote:'', gst:admin.gstno, billingdetails:JSON.stringify(foodOrder[props.tableNo]), totalamount:(totalAmount-totalOffer)+((totalAmount-totalOffer)*admin.gsttype/100), customername, mobileno}
          var response = await postData('billing/bill_submit', body)
        
          if(response.status){
            Swal.fire({
              title: 'Are you sure to Save the Bill?',
              text: "You won't be able to revert this!",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes!'
            }).then((result) => {
              if (result.isConfirmed) {
                Swal.fire(
                  'Saved!',
                  'Your Bill has been saved.',
                  'success'
                )
                dispatch({type:'DEL_ORDER' , payload:[props.tableNo]})
                props.setRefresh(!props.refresh)
              }
            })
          }
         
        }

 
   
    var foodList=[]
    if(props.tableNo.length!=1)
    {
    var cart = foodOrder[props.tableNo]
    if(cart!=undefined)
     foodList = Object.values(cart)
    }
  
    var totalAmount =foodList.reduce(calculateTotal,0)
    var totalOffer =foodList.reduce(calculateTotalOffer,0)
    function calculateTotal(item1 ,item2){
      return item1+(item2.price*item2.qty)
    }

    function calculateTotalOffer(item1,item2){
      var price=item2.offerprice>0?item2.price*item2.qty:0
      return item1+(price-(item2.offerprice*item2.qty))
    }
  


  var admin = JSON.parse(localStorage.getItem("ADMIN"));


  const handleQtyChange=(v,item)=>{
    var foodlist=foodOrder[props.tableNo]
    if(v==0)
    {
      delete foodlist[item.fooditemid]
      foodOrder[props.tableNo]=foodlist
      
    }
    else
    {
    foodlist[item.fooditemid].qty=v
    foodOrder[props.tableNo]=foodlist
    
    }
    console.log("CART",foodOrder)
    dispatch({type:'ADD_ORDER',payload:[props.tableNo,foodOrder[props.tableNo]]})
    props.setRefresh(!props.refresh)
    
    } 

  const showFoodList = ()=>{
     return foodList.map((item , index)=>{
      
        return(
       
       <> 
           
           <Grid item xs={1} >{index+1}</Grid>
   <Grid item xs={3}  >{item?.fooditemname}</Grid>
   <Grid item xs={2} style={{textAlign:'right'}} >&#8377;{item?.price}</Grid>
   <Grid item xs={2} style={{textAlign:'right'}}>&#8377;{item?.offerprice}</Grid>
   <Grid item xs={2} style={{display:'flex',justifyContent:'right'}}><Plusminus onChange={(v)=>handleQtyChange(v , item)} qty={item?.qty} /></Grid>
   <Grid item xs={2} style={{textAlign:'right',fontWeight:'bold'}}>&#8377;{item?.offerprice>0?item?.offerprice*item?.qty:item?.price*item?.qty}</Grid>
           
            </>
           
            )
     })
  }

  const showTotalBill=()=>{
    return(<>


    <Grid item xs={12}><Divider/></Grid>
    <Grid item xs={6}  style={{fontWeight:'bold'}}>Amount:</Grid>
    <Grid item xs={6}  style={{fontWeight:'bold', textAlign:'right'}}>&#8377;{totalAmount}</Grid>
    <Grid item xs={6}  style={{fontWeight:'bold'}}>DisCount:</Grid>
    <Grid item xs={6}  style={{fontWeight:'bold', textAlign:'right'}}>&#8377;{totalOffer}</Grid>
    <Grid item xs={6}  style={{fontWeight:'bold'}}>Total Amount:</Grid>
    <Grid item xs={6}  style={{fontWeight:'bold', textAlign:'right'}}>&#8377;{totalAmount-totalOffer}</Grid>
    <Grid item xs={6}  style={{fontWeight:'bold'}}>CGST:</Grid>
    <Grid item xs={6}  style={{fontWeight:'bold', textAlign:'right'}}>&#8377;{(totalAmount-totalOffer)*gst/100}</Grid>
    <Grid item xs={6}  style={{fontWeight:'bold'}}>SGST:</Grid>
    <Grid item xs={6}  style={{fontWeight:'bold', textAlign:'right'}}>&#8377;{(totalAmount-totalOffer)*gst/100}</Grid>
    <Grid item xs={6}  style={{fontWeight:'bold'}}>NET AMOUNT:</Grid>
    <Grid item xs={6}  style={{fontWeight:'bold', textAlign:'right'}}>&#8377;{(totalAmount-totalOffer)+((totalAmount-totalOffer)*admin.gsttype/100)}</Grid>
    
    <Grid item xs={12}><Divider/></Grid>

    <Button onClick={()=>handlePayment((totalAmount-totalOffer)+((totalAmount-totalOffer)*admin.gsttype/100))} variant="contained" style={{display:'flex',marginLeft:'auto'}} color="primary" >Payment Online</Button>
    <Grid item xs={6}>
      <Button onClick={handleSave} variant="contained" style={{display:'flex', marginLeft:'auto'}} color="primary">Print Bill & Save</Button>
    </Grid>
    </>)
  }

  const heading = ()=>{
    return(<div>
      <Grid container spacing={1} style={{fontFamily:'kanit' }}>
      <Grid item xs={6} >
  <TextField label="Customer Name" variant="standard" onChange={(e)=>setCustomerName(e.target.value)} />
</Grid>
<Grid item xs={6} >
  <TextField label="Mobile" variant="standard" onChange={(e)=> setMobileNo(e.target.value)} />
</Grid>
      <Grid item xs={12}><Divider /></Grid> 
   <Grid item xs={1} style={{fontWeight:'bold'}} >Sn</Grid>
   <Grid item xs={3} style={{fontWeight:'bold'}}>Name</Grid>
   <Grid item xs={2} style={{fontWeight:'bold',textAlign:'right'}}>Rate</Grid>
   <Grid item xs={2} style={{fontWeight:'bold',textAlign:'right'}}>Offer</Grid>
   <Grid item xs={2} style={{fontWeight:'bold',textAlign:'right'}}>Qty</Grid>
   <Grid item xs={2} style={{fontWeight:'bold',textAlign:'right'}}>Amount</Grid>
   <Grid item xs={12}><Divider /></Grid>
    {showFoodList()}
    {showTotalBill()}
    </Grid>
   
       
    </div>)
  }

    return(<div>
           {heading()}
    </div>)
}