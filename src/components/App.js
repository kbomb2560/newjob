import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

// components
import Layout from "./Layout";

// pages
import Error from "../pages/error";
import Login from "../pages/login";

// context
import { useUserState } from "../context/UserContext";

export default function App() {
  // global
  var { isAuthenticated } = useUserState();

  return (
    <BrowserRouter>
      <Switch>
        <Route
          exact
          path={`${process.env.PUBLIC_URL}/`}
          render={() => <Redirect to={`${process.env.PUBLIC_URL}/app/job`} />}
        />
        <Route
          exact
          path={`${process.env.PUBLIC_URL}/app`}
          render={() => <Redirect to={`${process.env.PUBLIC_URL}/app/job`} />}
        />
        <PrivateRoute
          path={`${process.env.PUBLIC_URL}/app`}
          component={Layout}
        />
        <PublicRoute
          path={`${process.env.PUBLIC_URL}/login`}
          component={Login}
        />
        <Route component={Error} />
      </Switch>
    </BrowserRouter>
  );

  // #######################################################################

  function PrivateRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={(props) =>
          isAuthenticated ? (
            React.createElement(component, props)
          ) : (
            <Redirect
              to={{
                pathname: `${process.env.PUBLIC_URL}/login`,
                state: {
                  from: props.location,
                },
              }}
            />
          )
        }
      />
    );
  }

  function PublicRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={(props) =>
          isAuthenticated ? (
            <Redirect
              to={{
                pathname: `${process.env.PUBLIC_URL}/`,
              }}
            />
          ) : (
            React.createElement(component, props)
          )
        }
      />
    );
  }
}
