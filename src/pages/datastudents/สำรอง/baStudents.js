import React, { useState } from "react";
import {
  CircularProgress,
  Typography,
  Button,
  TextField,
  Fade,
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
//import classnames from "classnames";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

//
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AddCircle from "@material-ui/icons/AddCircle";

// styles
import useStyles from "./styles";
// components
import PageTitle from "../../components/PageTitle/PageTitle";
// context
import { useUserDispatch, creatStudents } from "../../context/UserContext";

function Students(props) {
  var classes = useStyles();

  var initialTutorialState = {
    id: null,
    title: "",
    description: "",
    published: false,
  };

  const [tutorial, setTutorial] = useState(initialTutorialState);
  const [submitted, setSubmitted] = useState(false);

  // global
  var userDispatch = useUserDispatch();

  // local
  var [isLoading, setIsLoading] = useState(false);
  var [error, setError] = useState(null);
  //var [activeTabId, setActiveTabId] = useState(0);
  //var [nameValue, setNameValue] = useState("");
  //var [loginValue, setLoginValue] = useState("admin@flatlogic.com"); //user email
  //var [passwordValue, setPasswordValue] = useState("password"); //password

  var [loginValue, setLoginValue] = useState(""); //user email
  var [passwordValue, setPasswordValue] = useState(""); //password

  return (
    <>
      <PageTitle title="ข้อมูลนักศึกษาทุน" />

      <div className={classes.form}>
        <React.Fragment>
          <Fade in={error}>
            <Typography color="secondary" className={classes.errorMessage}>
              ข้อมูลผู้ใช้งาน หรือ รหัสผ่าน ไม่ถูกต้อง
            </Typography>
          </Fade>

          <InputBase
            className={classes.input}
            placeholder="ป้อนรหัสนักศึกษา"
            inputProps={{ "aria-label": "ป้อนรหัสนักศึกษา" }}
          />
          <IconButton
            type="submit"
            className={classes.iconButton}
            aria-label="search"
            color="secondary"
          >
            <AddCircle />
          </IconButton>

          <div>
            <TextField required id="std_code" label="รหัสนักศึกษา" />
            <TextField required id="std_firstname" label="ชื่อ" />
            <TextField required id="std_lastname" label="นามสกุล" />
            <TextField
              id="standard-search"
              label="Search field"
              type="search"
            />
          </div>
          <div>
            <InputLabel id="demo-simple-select-label">Age</InputLabel>
            <Select labelId="demo-simple-select-label" id="demo-simple-select">
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </div>

          <div className={classes.formButtons}>
            {isLoading ? (
              <CircularProgress size={26} className={classes.loginLoader} />
            ) : (
              <Button
                disabled={loginValue.length === 0 || passwordValue.length === 0}
                onClick={() =>
                  creatStudents(
                    userDispatch,
                    loginValue,
                    passwordValue,
                    props.history,
                    setIsLoading,
                    setError,
                  )
                }
                variant="contained"
                color="primary"
                size="large"
              >
                บันทึกข้อมูล
              </Button>
            )}
          </div>
        </React.Fragment>
      </div>
    </>
  );
}

export default withRouter(Students);
