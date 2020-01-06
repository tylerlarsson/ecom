import { transition, boxShadow, defaultFont, whiteColor, hexToRgb } from 'assets/jss/material-dashboard-react.jsx'; // eslint-disable-line
import { DRAWER_WIDTH, DRAWER_SUBMENU_WIDTH } from 'constants/default';

const sidebarStyle = theme => ({
  drawerPaper: {
    border: 'none',
    position: 'relative',
    top: '0',
    bottom: '0',
    left: '0',
    borderRadius: 0,
    backgroundImage: 'linear-gradient(180deg, #3b4b77 0%, #242c46 100%)',
    width: DRAWER_WIDTH,
    [theme.breakpoints.up('md')]: {
      width: DRAWER_WIDTH,
      position: 'relative',
      height: 'calc(100% - 64px)'
    },
    [theme.breakpoints.down('sm')]: {
      width: DRAWER_WIDTH,
      ...boxShadow,
      position: 'relative',
      display: 'block',
      top: '0',
      height: '100vh',
      right: '0',
      left: 'auto',
      zIndex: '1032',
      visibility: 'visible',
      overflowY: 'visible',
      borderTop: 'none',
      textAlign: 'left',
      paddingRight: '0px',
      paddingLeft: '0',
      transform: `translate3d(${DRAWER_WIDTH}px, 0, 0)`,
      ...transition
    }
  },
  username: {
    fontSize: 16,
    lineHeight: '20px',
    color: '#ECF0F1',
    textTransform: 'none',
    marginTop: 18
  },
  userRole: {
    fontSize: 12,
    lineHeight: '16px',
    color: '#9EA0A5',
    textTransform: 'none'
  },
  logo: {
    position: 'relative',
    width: '100%',
    height: 213,
    minHeight: 213,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: `rgba(${hexToRgb(theme.palette.primary.main)},.74)`
  },
  logoLink: {
    ...defaultFont,
    textTransform: 'uppercase',
    padding: '5px 0',
    display: 'block',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: '30px',
    textDecoration: 'none',
    backgroundColor: 'transparent',
    '&,&:hover': {
      color: whiteColor
    }
  },
  logoImage: {
    maxWidth: '101px',
    maxHeight: '101px',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  img: {
    maxWidth: '101px',
    border: '0'
  },
  list: {
    flex: 1,
    marginTop: '12px',
    paddingLeft: '0',
    paddingTop: '0',
    paddingBottom: '10px',
    marginBottom: '0',
    listStyle: 'none',
    position: 'unset'
  },
  item: {
    position: 'relative',
    display: 'block',
    textDecoration: 'none',
    '&:hover,&:focus,&:visited,&': {
      color: '#ECF0F1'
    }
  },
  itemLink: {
    width: 'auto',
    transition: 'all 300ms linear',
    margin: '8px 16px 0',
    borderRadius: '4px',
    position: 'relative',
    display: 'block',
    padding: '8px 15px',
    backgroundColor: 'transparent',
    ...defaultFont,
    minHeight: 46
  },
  itemCategory: {
    fontSize: 13,
    fontWeight: 400,
    fontFamily: 'Roboto',
    margin: '8px 0 0 0',
    display: 'block',
    padding: '0 0 0 21px',
    color: 'rgba(255, 255, 255, .33)',
    backgroundColor: 'transparent'
  },
  itemIcon: {
    width: '24px',
    height: '30px',
    fontSize: '24px',
    lineHeight: '30px',
    float: 'left',
    marginRight: '10px',
    textAlign: 'center',
    verticalAlign: 'middle',
    color: '#526695'
  },
  itemText: {
    ...defaultFont,
    margin: '0',
    lineHeight: '30px',
    fontSize: '14px',
    fontWeight: 400,
    color: '#ECF0F1'
  },
  divider: {
    background: `rgba(${hexToRgb('#95A5A6')}, 0.5)`,
    marginTop: 16,
    marginBottom: 24
  },
  whiteFont: {
    color: '#ECF0F1'
  },
  activeLink: {
    color: '#ECF0F1',
    backgroundColor: `rgba(${hexToRgb('#556791')}, 0.5)`,
    '&:hover': {
      backgroundColor: '#556791 !important'
    },
    '&:focus': {
      backgroundColor: `rgba(${hexToRgb('#556791')}, 0.5)`
    }
  },
  sidebarWrapper: {
    height: 'calc(100% - 213px)',
    overflowY: 'auto',
    overflowX: 'hidden',
    width: DRAWER_WIDTH,
    maxWidth: DRAWER_WIDTH,
    overflowScrolling: 'touch',
    '&::-webkit-scrollbar': {
      width: '0.4em'
    },
    '&::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(149,165,166,.5)',
      outline: '1px solid slategrey',
      borderRadius: 4
    }
  },
  menus: {
    display: 'flex',
    flex: 1,
    width: DRAWER_WIDTH,
    maxWidth: DRAWER_WIDTH
  },
  submenu: {
    flex: 1,
    width: DRAWER_SUBMENU_WIDTH,
    minWidth: DRAWER_SUBMENU_WIDTH,
    background: '#425581',
    boxShadow: '0 2px 2px rgba(0, 0, 0, 0.3)'
  },
  submenuTitle: {
    color: 'rgba(255, 255, 255, .33)',
    fontSize: 14,
    fontWeight: 500,
    fontFamily: 'Roboto',
    textTransform: 'uppercase',
    marginTop: 21,
    marginBottom: 8,
    marginLeft: 25
  },
  activePro: {
    [theme.breakpoints.up('md')]: {
      position: 'absolute',
      width: '100%',
      bottom: '13px'
    }
  }
});

export default sidebarStyle;
