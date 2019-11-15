/* eslint-disable */
import React from "react";
import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";
import axios from "axios";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import Navbar from "components/Navbars/Navbar.jsx";
import Sidebar from "components/Sidebar/Sidebar.jsx";

import routes from "constants/adminRoutes";

import dashboardStyle from "assets/jss/material-dashboard-react/layouts/dashboardStyle.jsx";

import image from "assets/img/sidebar-2.jpg";
import logo from "assets/img/reactlogo.png";

const { REACT_APP_SERVER_URL } = process.env;
let userInfo = {};

const switchRoutes = (
  <Switch>
    {routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={props => {
              const Component = prop.component;
              return <Component {...props} {...userInfo}/>
            }}
            key={key}
          />
        );
      }
    })}
  </Switch>
);

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: image,
      color: "blue",
      hasImage: true,
      fixedClasses: "dropdown show",
      mobileOpen: false,
    };
  }
  handleImageClick = image => {
    this.setState({ image: image });
  };
  handleColorClick = color => {
    this.setState({ color: color });
  };
  handleFixedClick = () => {
    if (this.state.fixedClasses === "dropdown") {
      this.setState({ fixedClasses: "dropdown show" });
    } else {
      this.setState({ fixedClasses: "dropdown" });
    }
  };
  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };
  getRoute() {
    return this.props.location.pathname !== "/admin/maps";
  }
  resizeFunction = () => {
    if (window.innerWidth >= 960) {
      this.setState({ mobileOpen: false });
    }
  };
  async componentDidMount() {
    // const { history } = this.props;
    //
    // if (navigator.platform.indexOf("Win") > -1) {
    //   const ps = new PerfectScrollbar(this.refs.mainPanel);
    // }
    // window.addEventListener("resize", this.resizeFunction);
    //
    // let getSessionRequest;
    // try {
    //   getSessionRequest = await axios.get(
    //     `http://${REACT_APP_SERVER_URL}/get-session`,
    //     {
    //       withCredentials: true
    //     }
    //   );
    // } catch ({ response }) {
    //   getSessionRequest = response;
    // }
    // const { data: getSessionRequestData } = getSessionRequest;
    // if (getSessionRequestData.success) {
    //   return userInfo = getSessionRequestData.userInfo;
    // }
    // return history.push("/auth/login-page");
  }
  componentDidUpdate(e) {
    // if (e.history.location.pathname !== e.location.pathname) {
    //   this.refs.mainPanel.scrollTop = 0;
    //   if (this.state.mobileOpen) {
    //     this.setState({ mobileOpen: false });
    //   }
    // }
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeFunction);
  }
  render() {
    const { classes, ...rest } = this.props;

    return (
      <div className={classes.wrapper}>
        <Sidebar
          routes={routes}
          logoText={"Ecom Freedom"}
          logo={logo}
          // image={this.state.image}
          handleDrawerToggle={this.handleDrawerToggle}
          open={this.state.mobileOpen}
          color={this.state.color}
          {...rest}
        />
        <div className={classes.mainPanel} ref="mainPanel">
          {this.getRoute() ?
            switchRoutes
          : (
            <div className={classes.map}>{switchRoutes}</div>
          )}
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
