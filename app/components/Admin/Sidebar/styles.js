import {
  transition,
  boxShadow,
  defaultFont,
  infoColor,
  whiteColor,
  grayColor,
  blackColor,
  hexToRgb
} from "assets/jss/material-dashboard-react.jsx";
import { DRAWER_WIDTH } from 'constants/default';

const sidebarStyle = theme => ({
  drawerPaper: {
    border: "none",
    position: "relative",
    top: "0",
    bottom: "0",
    left: "0",
    zIndex: "1",
    display: 'flex',
    flexDirection: 'column',
    width: DRAWER_WIDTH,
    [theme.breakpoints.up("md")]: {
      width: DRAWER_WIDTH,
      position: "relative",
      height: "calc(100% - 64px)"
    },
    [theme.breakpoints.down("sm")]: {
      width: DRAWER_WIDTH,
      ...boxShadow,
      position: "relative",
      display: "block",
      top: "0",
      height: "100vh",
      right: "0",
      left: "auto",
      zIndex: "1032",
      visibility: "visible",
      overflowY: "visible",
      borderTop: "none",
      textAlign: "left",
      paddingRight: "0px",
      paddingLeft: "0",
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
    position: "relative",
    width: '100%',
    height: 213,
    minHeight: 213,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: "4",
    background: 'rgba(' + hexToRgb(theme.palette.primary.main) + ',.74)'
  },
  logoLink: {
    ...defaultFont,
    textTransform: "uppercase",
    padding: "5px 0",
    display: "block",
    fontSize: "18px",
    textAlign: "center",
    fontWeight: "400",
    lineHeight: "30px",
    textDecoration: "none",
    backgroundColor: "transparent",
    "&,&:hover": {
      color: whiteColor
    }
  },
  logoImage: {
    maxWidth: "101px",
    maxHeight: "101px",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto"
  },
  img: {
    maxWidth: "101px",
    border: "0"
  },
  background: {
    position: "absolute",
    zIndex: "1",
    height: "100%",
    width: "100%",
    display: "block",
    top: "0",
    left: "0",
    backgroundImage: 'linear-gradient(180deg, #3b4b77 0%, #242c46 100%)',
    // backgroundSize: "cover",
    // backgroundPosition: "center center",
    "&:after": {
      position: "absolute",
      zIndex: "3",
      width: "100%",
      height: "100%",
      content: '""',
      display: "block",
      // background: '#262b41',
      // opacity: ".8"
    }
  },
  list: {
    marginTop: "20px",
    paddingLeft: "0",
    paddingTop: "0",
    paddingBottom: "0",
    marginBottom: "0",
    listStyle: "none",
    position: "unset"
  },
  item: {
    position: "relative",
    display: "block",
    textDecoration: "none",
    "&:hover,&:focus,&:visited,&": {
      color: '#ECF0F1'
    }
  },
  itemLink: {
    width: "auto",
    transition: "all 300ms linear",
    margin: "8px 16px 0",
    borderRadius: "4px",
    position: "relative",
    display: "block",
    padding: "8px 15px",
    backgroundColor: "transparent",
    ...defaultFont
  },
  itemIcon: {
    width: "24px",
    height: "30px",
    fontSize: "24px",
    lineHeight: "30px",
    float: "left",
    marginRight: "10px",
    textAlign: "center",
    verticalAlign: "middle",
    color: "#526695"
  },
  itemText: {
    ...defaultFont,
    margin: "0",
    lineHeight: "30px",
    fontSize: "14px",
    fontWeight: 400,
    color: '#ECF0F1'
  },
  whiteFont: {
    color: '#ECF0F1'
  },
  activeLink: {
    color: '#ECF0F1',
    backgroundColor: "rgba(" + hexToRgb('#556791') + ", 0.8)",
    '&:hover,&:focus': {
      backgroundColor: '#556791'
    }
  },
  sidebarWrapper: {
    position: "relative",
    flex: 1,
    overflow: "auto",
    width: DRAWER_WIDTH,
    zIndex: "4",
    overflowScrolling: "touch",
    paddingBottom: 10,
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
  activePro: {
    [theme.breakpoints.up("md")]: {
      position: "absolute",
      width: "100%",
      bottom: "13px"
    }
  }
});

export default sidebarStyle;
