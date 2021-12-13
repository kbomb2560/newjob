import React, { useState } from "react";
import {
  Grid,
  CircularProgress,
  Typography,
  Button,
  TextField,
  Fade,
  Container,
  Paper,
  Avatar,
  CssBaseline,
} from "@material-ui/core";
import { LockOutlined as LockOutlinedIcon } from "@material-ui/icons";
import { withRouter } from "react-router-dom";
//import classnames from "classnames";
// styles
import useStyles from "./styles";

// logo

// context
import { useUserDispatch, loginUser } from "../../context/UserContext";

function Login(props) {
  var classes = useStyles();

  // global
  var userDispatch = useUserDispatch();

  // local
  var [isLoading, setIsLoading] = useState(false);
  var [error, setError] = useState(null);
  //var [activeTabId, setActiveTabId] = useState(0);
  //var [nameValue, setNameValue] = useState("");
  //var [loginValue, setLoginValue] = useState("admin@flatlogic.com"); //user email
  //var [passwordValue, setPasswordValue] = useState("password"); //password

  var [loginValue, setLoginValue] = useState("571102057117"); //user รหัสนักศึกษา
  var [passwordValue, setPasswordValue] = useState("06092535"); //password ววดดปปปป

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Container
        component={Paper}
        elevation={5}
        maxWidth="xs"
        className={classes.container}
      >
        <div className={classes.div}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>

          <React.Fragment>
            <Typography variant="h1" className={classes.greeting}>
              Login เข้าตอบแบบสอบถาม
            </Typography>

            <Fade in={error}>
              <Typography color="secondary" className={classes.errorMessage}>
                รหัสนักศึกษา/รหัสผ่าน ไม่ถูกต้อง หรือไม่พบข้อมูลในระบบ
              </Typography>
            </Fade>
            <TextField
              id="email"
              InputProps={{
                classes: {
                  underline: classes.textFieldUnderline,
                  input: classes.textField,
                },
              }}
              value={loginValue}
              onChange={(e) => setLoginValue(e.target.value)}
              margin="normal"
              placeholder="รหัสประจำตัวนักศึกษา"
              type="email"
              inputProps={{ maxLength: 12 }}
              fullWidth
            />
            <TextField
              id="password"
              InputProps={{
                classes: {
                  underline: classes.textFieldUnderline,
                  input: classes.textField,
                },
              }}
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
              margin="normal"
              placeholder="วันเดือนปี(พ.ศ.)เกิด เช่น 26052527"
              type="password"
              inputProps={{ maxLength: 8 }}
              fullWidth
            />
            <div className={classes.formButtons}>
              {isLoading ? (
                <CircularProgress size={26} className={classes.loginLoader} />
              ) : (
                <Button
                  disabled={
                    loginValue.length === 0 || passwordValue.length === 0
                  }
                  onClick={() =>
                    loginUser(
                      userDispatch,
                      loginValue,
                      passwordValue,
                      props.history,
                      setIsLoading,
                      setError
                    )
                  }
                  fullWidth
                  variant="contained"
                  color="secondary"
                  //size="large"
                  className={classes.button}
                >
                  เข้าสู่ระบบ
                </Button>
              )}
            </div>
          </React.Fragment>
          <Typography color="secondary" className={classes.copyright}>
            © 2014-{new Date().getFullYear()} , ภาวะการมีงานทำของบัณฑิต -
            ม.รภ.พช.
          </Typography>
        </div>
      </Container>
    </Grid>
  );
}

export default withRouter(Login);
