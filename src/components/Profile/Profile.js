import React, { useState, useEffect } from "react";
import { Redirect, Link } from "react-router-dom";

import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Edit from "@material-ui/icons/Edit";
import Divider from "@material-ui/core/Divider";

import DeleteUser from "./DeleteUser";
import auth from "../../auth/auth-helper";
import { read } from "../../user/api-user.js";
import ProfileTabs from "./ProfileTabs";
import FollowProfileButton from "./FollowProfileButton";
import { listByUser } from "../../post/api-post.js";
import { profileStyles } from "./profile.css";

const END_POINT = "https://twitter-n56t.onrender.com";

const Profile = ({ match }) => {
  const classes = profileStyles();
  const [values, setValues] = useState({
    user: { following: [], followers: [] },
    redirectToSignin: false,
    following: false,
  });
  const [user, setUser] = useState({});
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  const [posts, setPosts] = useState([]);
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read(
      {
        userId: match.params.userId,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data && data.error) {
        setRedirectToSignin(true);
      } else {
        let following = checkFollow(data);
        setValues({ ...values, user: data, following: following });
        setUser(data);
        loadPosts(data._id);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.userId]);

  const checkFollow = (user) => {
    const match = user.followers.some((follower) => {
      return follower._id === jwt.user._id;
    });
    return match;
  };

  const clickFollowButton = (callApi) => {
    callApi(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      values.user._id
    ).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, user: data, following: !values.following });
      }
    });
  };
  const loadPosts = (user) => {
    listByUser(
      {
        userId: user,
      },
      {
        t: jwt.token,
      }
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setPosts(data);
      }
    });
  };
  const removePost = (post) => {
    const updatedPosts = posts;
    const index = updatedPosts.indexOf(post);
    updatedPosts.splice(index, 1);
    setPosts(updatedPosts);
  };
  const photoUrl = user._id
    ? `${END_POINT}/api/users/photo/${user._id}?${new Date().getTime()}`
    : `${END_POINT}/api/users/defaultphoto`;

  if (redirectToSignin) {
    return <Redirect to="/signin" />;
  }
  return (
    <Paper className={classes.root} elevation={4}>
      <Typography variant="h6" className={classes.title}>
        Profile
      </Typography>
      <List dense>
        <ListItem>
          <ListItemAvatar>
            <Avatar src={photoUrl} className={classes.bigAvatar} />
          </ListItemAvatar>
          <ListItemText primary={user.name} secondary={user.email} />{" "}
          {auth.isAuthenticated().user &&
          auth.isAuthenticated().user._id === user._id ? (
            <ListItemSecondaryAction>
              <Link to={"/user/edit/" + user._id}>
                <IconButton aria-label="Edit" color="primary">
                  <Edit />
                </IconButton>
              </Link>
              <DeleteUser userId={user._id} />
            </ListItemSecondaryAction>
          ) : (
            <FollowProfileButton
              following={values.following}
              onButtonClick={clickFollowButton}
            />
          )}
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary={user.about}
            secondary={"Joined: " + new Date(user.created).toDateString()}
          />
        </ListItem>
      </List>
      <ProfileTabs
        user={values.user}
        posts={posts}
        removePostUpdate={removePost}
      />
    </Paper>
  );
};

export default Profile;
