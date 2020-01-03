import React from "react";
import { map, find } from 'lodash';
import classNames from "classnames";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import sidebarStyle from "./styles.js";

const useStyles = makeStyles(theme => ({
  nested: {
    paddingLeft: `${theme.spacing(8)}px !important`,
  },
  arrow: {
    float: 'right'
  }
}));

const Sidebar = ({ ...props }) => {
  // verifies if routeName is the one active (in browser input)
  function activeRoute(routeName, link) {
    return props.location.pathname.indexOf(routeName) > -1 || props.location.pathname.indexOf(link) > -1 ? true : false;
  }
  function activeParent(children, routeName, link) {
    return !!find(children, item => (activeRoute(item.layout + item.path, item.layout + item.link)));
  }
  const { classes, color, user, routes } = props;
  const { name, role, avatar } = user;
  const styles = useStyles();
  var links = (
    <List className={classes.list}>
      {routes.map((prop, key) => {
        var activePro = " ";
        var listItemClasses;
        listItemClasses = classNames({
          [" " + classes['activeLink']]: activeRoute(prop.layout + prop.path, prop.layout + prop.link)
        });
        const whiteFontClasses = classNames({
          [" " + classes.whiteFont]: activeRoute(prop.layout + prop.path, prop.layout + prop.link ) ||
          activeParent(prop.children, prop.layout + prop.path, prop.layout + prop.link)
        });
        return (
          <div key={key}>
            <NavLink
              to={prop.layout + (prop.link || prop.path)}
              className={activePro + classes.item}
              activeClassName="active"
            >
              <ListItem button className={classes.itemLink + listItemClasses}>
                {typeof prop.icon === 'string' ? (
                  <Icon
                    className={classNames(classes.itemIcon, whiteFontClasses)}
                  >
                    {prop.icon}
                  </Icon>
                ) : (
                  <prop.icon
                    className={classNames(classes.itemIcon, whiteFontClasses)}
                  />
                )}
                <ListItemText
                  primary={prop.name}
                  className={classNames(classes.itemText, whiteFontClasses)}
                  style={{ display: 'inline-block' }}
                  disableTypography={true}
                />
                {prop.children ? (
                  activeRoute(prop.layout + prop.path, prop.layout + prop.link ) ?
                    <ExpandLess className={styles.arrow} />
                    : <ExpandMore className={styles.arrow} />)
                  : null
                }
              </ListItem>
            </NavLink>
            {prop.children ? (
              <Collapse
                in={activeRoute(prop.layout + prop.path, prop.layout + prop.link ) ||
                  activeParent(prop.children, prop.layout + prop.path, prop.layout + prop.link)}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {map(prop.children, item => item.visible &&
                    (<NavLink
                      key={item.link + item.path}
                      to={item.layout + (item.link || item.path)}
                      className={activePro + classes.item}
                      activeClassName="active"
                    >
                      <ListItem button className={classNames(styles.nested, classes.itemLink, {
                        [" " + classes[color]]: activeRoute(item.layout + item.path, item.layout + item.link)
                      })}>
                        <ListItemText
                          primary={item.name}
                          className={classNames(classes.itemText, whiteFontClasses)}
                          disableTypography={true}
                        />
                      </ListItem>
                    </NavLink>)
                  )}
                </List>
              </Collapse>
            ) : null
            }

          </div>
        );
      })}
    </List>
  );
  var brand = (
    <div className={classes.logo}>
      <a
        href={routes.ADMIN}
        className={classes.logoLink}
      >
        <div className={classes.logoImage}>
          <img src={avatar} alt="logo" className={classes.img} />
        </div>
        <div className={classes.username}>{name}</div>
        <div className={classes.userRole}>{role}</div>
      </a>
    </div>
  );
  return (
    <Paper className={classes.drawerPaper}>
      {brand}
      <div className={classes.sidebarWrapper}>{links}</div>
      <div className={classes.background} />
    </Paper>
  );
};

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(sidebarStyle)(Sidebar);
