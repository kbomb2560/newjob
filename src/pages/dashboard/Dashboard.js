import React from "react";
import { Grid } from "@material-ui/core";

// styles
//import useStyles from "./styles";

// components
import mock from "./mock";
import PageTitle from "../../components/PageTitle";
import Table from "./components/Table/Table";
//import BigStat from "./components/BigStat/BigStat";

export default function Dashboard(props) {
  // local
  //var [mainChartState, setMainChartState] = useState("monthly");

  return (
    <>
      <PageTitle title="Dashboard" />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Table data={mock.table} />
        </Grid>
      </Grid>
    </>
  );
}
