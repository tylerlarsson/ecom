import React from 'react';
import { map, find, forEach } from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import { Paper, List, ListItem, ListItemText, Icon } from '@material-ui/core';
import sidebarStyle from './styles';

const useStyles = makeStyles(theme => ({
  nested: {
    paddingLeft: `9px !important`,
    marginTop: `0px !important`,
    paddingTop: `4px !important`,
    paddingBottom: `4px !important`,
    minHeight: '38px !important'
  },
  arrow: {
    float: 'right'
  },
  divider: {
    display: 'block',
    height: 1,
    width: 100,
    background: 'rgba(149, 165, 166, .5)',
    marginTop: 20,
    marginLeft: 25
  },
  short: {
    marginRight: '0 !important',
    borderBottomRightRadius: '0 !important',
    borderTopRightRadius: '0 !important'
  }
}));

const Sidebar = ({ ...props }) => {
  // verifies if routeName is the one active (in browser input)
  function activeRoute(routeName, link) {
    return props.location.pathname.indexOf(routeName) > -1 || props.location.pathname.indexOf(link) > -1 ? true : false;
  }
  function activeParent(children) {
    return !!find(children, item => (activeRoute(item.layout + item.path, item.layout + item.link)));
  }
  const { classes, color, user, routes } = props;
  const { name, role, avatar } = user;
  let activeChildItem = null;

  forEach(routes, (prop, key) => {
    if (prop.children) {
      const apv = activeParent(prop.children);
      const arv = activeRoute(prop.layout + prop.path, prop.layout + prop.link)
      if (apv || (arv && prop.children)) {
        activeChildItem = prop;
      }
    }
  });

  const styles = useStyles();
  const links = (
    <List className={classes.list}>
      {routes.map((prop, key) => {
        const activeRouteValue = activeRoute(prop.layout + prop.path, prop.layout + prop.link);
        const activePro = ' ';
        const listItemClasses = classNames({
          [' ' + classes.activeLink]: activeRouteValue,
          [' ' + styles.short]: activeChildItem,
        });
        const activeParentValue = activeParent(prop.children);
        const whiteFontClasses = classNames({ [' ' + classes.whiteFont]: activeRouteValue || activeParentValue });
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
                  primary={activeChildItem ? null : prop.name}
                  className={classNames(classes.itemText, whiteFontClasses)}
                  style={{ display: 'inline-block' }}
                  disableTypography={true}
                />
              </ListItem>
            </NavLink>
          </div>
        );
      })}
    </List>
  );
  const activePro = ' ';
  const whiteFontClasses = classNames({ [' ' + classes.whiteFont]: true });
  const submenu = activeChildItem ? (
    <div className={classes.submenu}>
      <div className={classes.submenuTitle}>{activeChildItem.name}</div>
      <List component="div" disablePadding>
        {map(activeChildItem.children, item => item.visible &&
          (<NavLink
            key={item.link + item.path}
            to={item.layout + (item.link || item.path)}
            className={activePro + classes.item}
            activeClassName="active"
          >
            <ListItem button className={classNames(styles.nested, classes.itemLink, {
              [' ' + classes[color]]: activeRoute(item.layout + item.path, item.layout + item.link)
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
      <div className={styles.divider} />
    </div>
  ) : null;

  const brand = (
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
      <div className={classes.sidebarWrapper}>
        <div className={classes.menus}>
          {links}
          {submenu}
        </div>
      </div>
    </Paper>
  );
};

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(sidebarStyle)(Sidebar);
