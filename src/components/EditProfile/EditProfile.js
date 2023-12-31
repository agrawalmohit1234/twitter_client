import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ErrorIcon from "@material-ui/icons/Error";
import Avatar from "@material-ui/core/Avatar";
import FileUpload from "@material-ui/icons/AddPhotoAlternate";

import auth from "../../auth/auth-helper";
import { read, update } from "../../user/api-user.js";
import { editProfileStyles } from "./editProfile.css";

const END_POINT = "https://twitter-n56t.onrender.com";

const EditProfile = ({ match }) => {
  const classes = editProfileStyles();
  const [values, setValues] = useState({
    name: "",
    about: "",
    photo: "",
    email: "",
    password: "",
    redirectToProfile: false,
    error: "",
    id: "",
  });
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
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          id: data._id,
          name: data.name,
          email: data.email,
          about: data.about,
        });
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.userId, jwt.token, jwt.user._id, values]);

  const clickSubmit = () => {
    let userData = new FormData();
    values.name && userData.append("name", values.name);
    values.email && userData.append("email", values.email);
    values.passoword && userData.append("passoword", values.passoword);
    values.about && userData.append("about", values.about);
    values.photo && userData.append("photo", values.photo);
    update(
      {
        userId: match.params.userId,
      },
      {
        t: jwt.token,
      },
      userData
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, userId: data._id, redirectToProfile: true });
      }
    });
  };
  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    setValues({ ...values, [name]: value });
  };
  const photoUrl = values.id
    ? `${END_POINT}/api/users/photo/${values.id}?${new Date().getTime()}`
    : `${END_POINT}/api/users/defaultphoto`;
  if (values.redirectToProfile) {
    return <Redirect to={"/user/" + values.userId} />;
  }
  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6" className={classes.title}>
          Edit Profile
        </Typography>
        <Avatar src={photoUrl} className={classes.bigAvatar} />
        <br />
        <input
          accept="image/*"
          type="file"
          onChange={handleChange("photo")}
          style={{ display: "none" }}
          id="icon-button-file"
        />
        <label htmlFor="icon-button-file">
          <Button variant="contained" color="inherit" component="span">
            Upload <FileUpload />
          </Button>
        </label>
        <span className={classes.filename}>
          {values.photo ? values.photo.name : ""}
        </span>
        <br />
        <TextField
          id="name"
          label="Name"
          className={classes.textField}
          value={values.name}
          onChange={handleChange("name")}
          margin="normal"
        />
        <br />
        <TextField
          id="multiline-flexible"
          label="About"
          multiline
          rows="2"
          value={values.about}
          className={classes.textField}
          onChange={handleChange("about")}
        />
        <br />
        <TextField
          id="email"
          type="email"
          label="Email"
          className={classes.textField}
          value={values.email}
          onChange={handleChange("email")}
          margin="normal"
        />
        <br />
        <TextField
          id="password"
          type="password"
          label="Password"
          className={classes.textField}
          value={values.password}
          onChange={handleChange("password")}
          margin="normal"
        />
        <br />{" "}
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
          onClick={clickSubmit}
          className={classes.submit}
        >
          Submit
        </Button>
      </CardActions>
    </Card>
  );
};

export default EditProfile;
