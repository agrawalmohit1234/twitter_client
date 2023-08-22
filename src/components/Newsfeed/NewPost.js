import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import ErrorIcon from "@material-ui/icons/Error";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";

import auth from "../../auth/auth-helper";
import { create } from "../../post/api-post";
import { newPostStyles } from "./post.css.js";

const END_POINT = "https://twitter-n56t.onrender.com";

const NewPost = (props) => {
  const classes = newPostStyles();
  const [values, setValues] = useState({
    text: "",
    photo: "",
    error: "",
    user: {},
  });

  const jwt = auth.isAuthenticated();
  useEffect(() => {
    setValues({ ...values, user: auth.isAuthenticated().user });
  }, []);

  const clickPost = () => {
    let postData = new FormData();
    postData.append("text", values.text);
    postData.append("photo", values.photo);
    create(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      postData
    ).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, text: "", photo: "" });
        props.addUpdate(data);
      }
    });
  };

  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    setValues({ ...values, [name]: value });
  };

  const photoURL = values.user._id
    ? `${END_POINT}/api/users/photo/` + values.user._id
    : `${END_POINT}/api/users/defaultphoto`;

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardHeader
          avatar={<Avatar src={photoURL} />}
          title={values.user.name}
          className={classes.cardHeader}
        />
        <CardContent className={classes.cardContent}>
          <TextField
            placeholder="Share your thoughts ..."
            multiline
            rows="3"
            value={values.text}
            onChange={handleChange("text")}
            className={classes.textField}
            margin="normal"
          />
          <input
            accept="image/*"
            onChange={handleChange("photo")}
            className={classes.input}
            id="icon-button-file"
            type="file"
          />
          <label htmlFor="icon-button-file">
            <IconButton
              color="secondary"
              className={classes.photoButton}
              component="span"
            >
              <PhotoCamera />
            </IconButton>
          </label>
          <span className={classes.filename}>
            {values.photo ? values.photo.name : ""}
          </span>
          {values.error && (
            <Typography component="p" color="error">
              <IconButton color="error" className={classes.error}>
                <ErrorIcon />
              </IconButton>
              {values.error}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            disabled={values.text === ""}
            onClick={clickPost}
            className={classes.submit}
          >
            POST
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

NewPost.propTypes = {
  addUpdate: PropTypes.func.isRequired,
};

export default NewPost;
