import axios from "axios";
import React from "react";

var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, isAuthenticated: true };
    case "SIGN_OUT_SUCCESS":
      return { ...state, isAuthenticated: false };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  var [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: !!localStorage.getItem("id_token"),
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  var context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

export {
  UserProvider,
  useUserState,
  useUserDispatch,
  loginUser,
  creatStudents,
  signOut,
};
// ###########################################################
// ######### CreateStudent #####
function creatStudents(
  dispatch,
  login,
  password,
  history,
  setIsLoading,
  setError,
) {
  //const BASE_URL = "http://academic.pcru.ac.th/dev/php-jwt-auth/api/signin.php";
  const BASE_URL = "http://academic.pcru.ac.th/dev/login.php";
  //.post(BASE_URL, { usr: login, pwd: password })

  //console.log("errx");
  try {
    setError(false);
    setIsLoading(true);
    axios
      .get(`${BASE_URL}?usr=${login}&&pwd=${password}`)
      .then(function (response) {
        //console.log(response);
        //console.log(response.status);
        //console.log(response.data.status);
        if (response.data.status === true && response.data.id.status === true) {
          setTimeout(() => {
            localStorage.setItem("id_token", 1);
            localStorage.setItem(
              "dataAuth",
              JSON.stringify(response.data.id.data),
            );
            //localStorage.setItem("StudentData", response.data.id.data);
            setError(false);
            setIsLoading(false);
            dispatch({ type: "LOGIN_SUCCESS" });
            history.push("/app/dashboard");
          }, 2000);
        } else {
          //username ผิด
          //password ผิด
          console.log("wrong username");
          //dispatch({ type: "LOGIN_FAILURE" });
          setError(true);
          setIsLoading(false);
        }
      })
      .catch(function (error) {
        if (error.response) {
          setError(true);
          console.log(error.response.data.message);
          console.log(error.response.data.status);
          //console.log(error.response.headers);
        } else if (error.request) {
          setError(true);
          //console.log(error.request);
        } else {
          setError(true);
          //console.log("Error", error.message);
        }
      });
  } catch (error) {
    console.log("err");
    dispatch({ type: "LOGIN_FAILURE" });
    setError(true);
    setIsLoading(false);
  }

  ///***** จบข้อมูลไม่ถูกต้อง ****/
}

// ######### Login ##########
function loginUser(dispatch, login, password, history, setIsLoading, setError) {
  //const BASE_URL = "http://academic.pcru.ac.th/dev/php-jwt-auth/api/signin.php";
  const BASE_URL = "http://academic.pcru.ac.th/dev/login.php";
  //.post(BASE_URL, { usr: login, pwd: password })

  //console.log("errx");
  try {
    setError(false);
    setIsLoading(true);
    axios
      .get(`${BASE_URL}?usr=${login}&&pwd=${password}`)
      .then(function (response) {
        //console.log(response);
        //console.log(response.status);
        //console.log(response.data.status);
        if (response.data.status === true && response.data.id.status === true) {
          setTimeout(() => {
            localStorage.setItem("id_token", 1);
            localStorage.setItem(
              "dataAuth",
              JSON.stringify(response.data.id.data),
            );
            //localStorage.setItem("StudentData", response.data.id.data);
            setError(false);
            setIsLoading(false);
            dispatch({ type: "LOGIN_SUCCESS" });
            history.push("/app/dashboard");
          }, 2000);
        } else {
          //username ผิด
          //password ผิด
          console.log("wrong username");
          //dispatch({ type: "LOGIN_FAILURE" });
          setError(true);
          setIsLoading(false);
        }
      })
      .catch(function (error) {
        if (error.response) {
          setError(true);
          console.log(error.response.data.message);
          console.log(error.response.data.status);
          //console.log(error.response.headers);
        } else if (error.request) {
          setError(true);
          //console.log(error.request);
        } else {
          setError(true);
          //console.log("Error", error.message);
        }
      });
  } catch (error) {
    console.log("err");
    dispatch({ type: "LOGIN_FAILURE" });
    setError(true);
    setIsLoading(false);
  }
  /*
  axios
    .post(BASE_URL, {
      email: login,
      password: password,
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });

  setError(false);
  setIsLoading(true);
  */
  //******* ข้อมูลไม่ถูกต้อง ***//
  /* */

  /*
  if (!!login && !!password) {
    setTimeout(() => {
      localStorage.setItem("id_token", 1);
      setError(null);
      setIsLoading(false);
      dispatch({ type: "LOGIN_SUCCESS" });

      history.push("/app/dashboard");
    }, 2000);
  } else {
    dispatch({ type: "LOGIN_FAILURE" });
    setError(true);
    setIsLoading(false);
  }
*/
  ///***** จบข้อมูลไม่ถูกต้อง ****/
}

function signOut(dispatch, history) {
  localStorage.removeItem("id_token");
  localStorage.removeItem("dataAuth");
  //localStorage.removeItem("StudentData");
  dispatch({ type: "SIGN_OUT_SUCCESS" });
  history.push("/login");
}
