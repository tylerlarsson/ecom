/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { map } from 'lodash';
import { Switch, Route, Redirect } from 'react-router-dom';
// creates a beautiful scrollbar
import 'perfect-scrollbar/css/perfect-scrollbar.css';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import { IconButton } from '@material-ui/core';
import { ExitToAppOutlined, NotificationsOutlined } from '@material-ui/icons';
// core components
import Sidebar from 'components/Admin/Sidebar/Sidebar';
import adminRoutes from 'constants/adminRoutes';
import routes from 'constants/routes.json';
import { logoutAction } from 'redux/actions/auth';

import Logo from 'assets/img/faces/dan.png';
import AdminMainNavbar from 'components/Admin/AdminMainNavbar';

let userInfo = {};

const styles = theme => ({
  wrapperMain: {
    display: 'block',
    height: '100vh',
    marginTop: 64,
    position: 'relative'
  },
  container: {
    display: 'flex',
    height: '100%',
    position: 'relative'
  },
  mainPanel: {
    flex: 1,
    height: 'calc(100% - 64px)',
    overflow: 'auto',
    background: theme.palette.primary.bg
  },
  icon: {
    color: 'white'
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
      color: "blue",
      hasImage: true,
      fixedClasses: "dropdown show",
      mobileOpen: false,
    };
  }

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  resizeFunction = () => {
    if (window.innerWidth >= 960) {
      this.setState({ mobileOpen: false });
    }
  };

  async componentDidMount() {
    window.addEventListener("resize", this.resizeFunction);
  }

  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname) {
      this.refs.mainPanel.scrollTop = 0;
      if (this.state.mobileOpen) {
        this.setState({ mobileOpen: false });
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFunction);
  }

  renderNavbar = () => {
    const { classes, handleLogout } = this.props;

    return (
      <>
      <IconButton>
        <NotificationsOutlined className={classes.icon} />
      </IconButton>
      <IconButton onClick={handleLogout}>
        <ExitToAppOutlined className={classes.icon} />
      </IconButton>
      </>
    );
  };

  render() {
    const { classes, ...rest } = this.props;
    const menu = adminRoutes.filter(item => item.visible );

    return (
      <div className={classes.wrapperMain}>
        <AdminMainNavbar right={this.renderNavbar(classes)} />
        <div className={classes.container}>
          <Sidebar
            routes={menu}
            handleDrawerToggle={this.handleDrawerToggle}
            open={this.state.mobileOpen}
            color={this.state.color}
            {...rest}
            user={{
              avatar: Logo,
              name: 'Dav Vas',
              role: 'Course Admin'
            }}
          />
          <div className={classes.mainPanel} ref="mainPanel">
            {switchRoutes}
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = ({ auth }) => ({
  user: auth.user
});

const mapDispatchToProps = dispatch => ({
  handleLogout: () => {
    dispatch(logoutAction());
  }
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles)
)(Dashboard);
