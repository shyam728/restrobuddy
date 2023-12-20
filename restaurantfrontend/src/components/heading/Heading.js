import logo from "../../assets/logo.png"
import list from '../../assets/list.png'
import { margin } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'


export default function Heading({title , myroute}){
    var navigate=useNavigate()
    return(
        <div  style={{  fontFamily:'kanit',
        fontWeight:'bold',
        fontSize:20,
        letterSpacing:1,
        display:'flex',
        alignItems:'center'}}>
        <img src={logo} style={{width:60}} alt=""/>
               <div>{title}</div>
               <img src={list} width="40" style={{marginLeft:'auto'}} onClick={()=>navigate(`${myroute}`)} alt=""/>
       
        </div>
    )
}