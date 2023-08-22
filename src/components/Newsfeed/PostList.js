import React from "react";
import PropTypes from "prop-types";

import Post from "./Post";

const PostList = (props) => {
  return (
    <div style={{ marginTop: "2.4rem" }}>
      {props.posts.map((item, i) => {
        return <Post post={item} key={i} onRemove={props.removeUpdate} />;
      })}
    </div>
  );
};

PostList.propTypes = {
  posts: PropTypes.array.isRequired,
  removeUpdate: PropTypes.func.isRequired,
};

export default PostList;
