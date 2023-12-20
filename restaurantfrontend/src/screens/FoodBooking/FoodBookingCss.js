import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  root: {
    width:"auto",
    height:"auto",
    background:"#dfe4ea",
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    flexDirection:'column',
    paddingBottom:'10px'
  },
  box:{
    width:"90%",
    height:"auto",
    borderRadius:10,
    background:"#fff",
    padding:15,
   marginBottom:10,
   marginTop:10,
    boxShadow:"0 0 15px #222"
  },
  tableBox:{
    width:"90%",
    height:"auto",
    borderRadius:10,
    background:"#fff",
    padding:15,
    boxShadow:"0 0 15px #222"
  },
  center:{
    display:"flex",
    justifyContent:"center",
    alignItems:"center"
  }
});