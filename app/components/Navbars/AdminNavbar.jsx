import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import headerStyle from "assets/jss/material-dashboard-react/components/headerStyle.jsx";

const AdminNavbar = ({ classes, title, right }) => (
  <div>
    <Typography variant="h6">
      {title}
    </Typography>
    <div className={classes.grow} />
    <div style={{ float: 'right' }}>{right}</div>
  </div>
);

export default withStyles(headerStyle)(AdminNavbar);
