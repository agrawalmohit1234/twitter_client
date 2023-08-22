import React, { useState, useEffect } from "react";

import Grid from "@material-ui/core/Grid";

import SignUp from "../Signup/Signup";
import auth from "../../auth/auth-helper";
import Newsfeed from "../../components/Newsfeed/Newsfeed";
import FindPeople from "../FindPeople/FindPeople";

const Home = ({ history }) => {
  const [defaultPage, setDefaultPage] = useState(false);

  useEffect(() => {
    setDefaultPage(auth.isAuthenticated());
    const unlisten = history.listen(() => {
      setDefaultPage(auth.isAuthenticated());
    });
    return () => {
      unlisten();
    };
  }, [history]);

  return (
    <div>
      {!defaultPage && (
        <div>
          <SignUp />
        </div>
      )}
      {defaultPage && (
        <Grid container spacing={8}>
          <Grid item xs={8} sm={7}>
            <Newsfeed />
          </Grid>
          <Grid item xs={4} sm={5}>
            <FindPeople />
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default Home;
