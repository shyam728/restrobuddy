import Chart  from "../../components/DashboardComponent/Chart"
import { Grid,Paper } from "@mui/material"
import Deposits  from "../../components/Deposits"
import Title from "../../components/Title"
export default function Summary(props)
{
  return(<div>
    {/* Chart */}
    <Grid container spacing={3}>
    <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  <Title>Monthwise Sales</Title>
                  <Chart />
                </Paper>
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  <Deposits />
                </Paper>
              </Grid>
          </Grid>    

  </div>)

}