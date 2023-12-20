import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  root: {
    width:"auto",
    height:"auto",
    background:"#dfe4ea",
    display:"flex",
    alignItems:"center",
    justifyContent:"center"
  },
  box:{
    width:"90%",
    height:"auto",
    borderRadius:10,
    background:"#fff",
    padding:15,
    boxShadow:"0 0 15px #222",
    marginBlock:"40px"
  },
  center:{
    display:"flex",
    justifyContent:"center",
    alignItems:"center"
  }
});