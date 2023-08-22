import React, { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import CardHeader from "@material-ui/core/CardHeader";
import TextField from "@material-ui/core/TextField";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

import auth from "../../auth/auth-helper";
import { comment, uncomment } from "../../post/api-post";
import { commentsStyles } from "./post.css";

const END_POINT = "https://twitter-n56t.onrender.com";

const Comments = (props) => {
  const classes = commentsStyles();
  const [text, setText] = useState("");
  const jwt = auth.isAuthenticated();
  const handleChange = (event) => {
    setText(event.target.value);
  };
  const addComment = (event) => {
    if (event.keyCode === 13 && event.target.value) {
      event.preventDefault();
      comment(
        {
          userId: jwt.user._id,
        },
        {
          t: jwt.token,
        },
        props.postId,
        { text: text }
      ).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          setText("");
          props.updateComments(data.comments);
        }
      });
    }
  };

  const deleteComment = (comment) => (event) => {
    uncomment(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      props.postId,
      comment
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        props.updateComments(data.comments);
      }
    });
  };

  const commentBody = (item) => {
    return (
      <p className={classes.commentText}>
        <Link to={"/user/" + item.postedBy._id}>{item.postedBy.name}</Link>
        <br />
        {item.text}
        <span className={classes.commentDate}>
          {new Date(item.created).toDateString()} |
          {auth.isAuthenticated().user._id === item.postedBy._id && (
            <IconButton
              onClick={deleteComment(item)}
              className={classes.commentDelete}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </span>
      </p>
    );
  };

  return (
    <div>
      <CardHeader
        avatar={
          <Avatar
            className={classes.smallAvatar}
            src={
              `${END_POINT}/api/users/photo/` + auth.isAuthenticated().user._id
            }
          />
        }
        title={
          <TextField
            onKeyDown={addComment}
            multiline
            value={text}
            onChange={handleChange}
            placeholder="Write something ..."
            className={classes.commentField}
            margin="normal"
          />
        }
        className={classes.cardHeader}
      />
      {props.comments.map((item, i) => {
        return (
          <CardHeader
            avatar={
              <Avatar
                className={classes.smallAvatar}
                src={`${END_POINT}/api/users/photo/` + item.postedBy._id}
              />
            }
            title={commentBody(item)}
            className={classes.cardHeader}
            key={i}
          />
        );
      })}
    </div>
  );
};

Comments.propTypes = {
  postId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  updateComments: PropTypes.func.isRequired,
};

export default Comments;
