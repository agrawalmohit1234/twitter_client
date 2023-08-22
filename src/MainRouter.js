import React from "react";
import { Route, Switch } from "react-router-dom";

import Home from "./components/Home/Home";
import Signup from "./components/Signup/Signup";
import Signin from "./auth/Signin";
import Profile from "./components/Profile/Profile";
import EditProfile from "./components/EditProfile/EditProfile";
import PrivateRoute from "./auth/PrivateRoute";
import Menu from "./components/Menu/Menu";

const MainRouter = () => {
  return (
    <div>
      <Menu />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/signup" component={Signup} />
        <Route path="/signin" component={Signin} />
        <PrivateRoute path="/user/edit/:userId" component={EditProfile} />
        <Route path="/user/:userId" component={Profile} />
      </Switch>
    </div>
  );
};

export default MainRouter;
