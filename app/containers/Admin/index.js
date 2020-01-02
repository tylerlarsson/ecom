/* eslint-disable */
import React from "react";
import PropTypes from "prop-types";
import { map } from 'lodash';
import { Switch, Route, Redirect } from "react-router-dom";
import axios from "axios";
// creates a beautiful scrollbar
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import Sidebar from "components/Sidebar/Sidebar.jsx";
import adminRoutes from "constants/adminRoutes";
import routes from "constants/routes.json";

// import dashboardStyle from "assets/jss/material-dashboard-react/layouts/dashboardStyle.jsx";

import image from "assets/img/sidebar-2.jpg";
import logo from "assets/img/reactlogo.png";
import AdminMainNavbar from 'components/Admin/AdminMainNavbar/AdminMainNavbar';

const { REACT_APP_SERVER_URL } = process.env;
let userInfo = {};

const styles = theme => ({
  wrapperMain: {
    marginTop: 64,
  },
  mainPanel: {
    flex: 1
  }
});

const switchRoutes = (
  <Switch>
    {adminRoutes.map((prop, key) => {
      if (prop.layout === routes.ADMIN) {
        return [
          <Redirect exact from={prop.layout} to={prop.layout + routes.DASHBOARD} />,
          <Route
            exact
            path={prop.layout + prop.path}
            component={props => {
              const Component = prop.component;
              return <Component {...props} {...userInfo}/>
            }}
            key={key}
          />,
          map(prop.children, (item, index) => (
            <Route
              exact
              path={item.layout + item.path}
              component={props => {
                const Component = item.component;
                return <Component {...props} {...userInfo}/>
              }}
              key={`${key}${index}`}
            />
          ))
        ];
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
    const menu = adminRoutes.filter(item => item.visible );

    return (
      <div className={classes.wrapperMain}>
        <AdminMainNavbar />
        <Sidebar
          routes={menu}
          logoText={"Ecom Freedom"}
          logo={logo}
          // image={this.state.image}
          handleDrawerToggle={this.handleDrawerToggle}
          open={this.state.mobileOpen}
          color={this.state.color}
          {...rest}
        />
        <div className={classes.mainPanel} ref="mainPanel">
          {switchRoutes}
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Dashboard);
