import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";

import { followGridStyles } from "./profile.css";

const END_POINT = "https://twitter-n56t.onrender.com";

const FollowGrid = (props) => {
  const classes = followGridStyles();
  return (
    <div className={classes.root}>
      <GridList cellHeight={160} className={classes.gridList} cols={4}>
        {props.people.map((person, i) => {
          return (
            <GridListTile style={{ height: 120 }} key={i}>
              <Link to={"/user/" + person._id}>
                <Avatar
                  src={`${END_POINT}/api/users/photo/` + person._id}
                  className={classes.bigAvatar}
                />
                <Typography className={classes.tileText}>
                  {person.name}
                </Typography>
              </Link>
            </GridListTile>
          );
        })}
      </GridList>
    </div>
  );
};

FollowGrid.propTypes = {
  people: PropTypes.array.isRequired,
};

export default FollowGrid;
