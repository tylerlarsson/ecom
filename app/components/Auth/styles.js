const styles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
  },
  title: {
    color: theme.palette.secondary.dark,
    fontSize: 26,
    fontFamily: "AvenirNextCondensed-Bold', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    fontWeight: 'bold'
  },
  label: {
    color: theme.palette.secondary.main,
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 12
  },
  focused: {
    color: `${theme.palette.secondary.main}`,
    fontSize: 21
  },
  subtitle: {
    // fontFamily: "Roboto', 'Helvetica', 'Arial', sans-serif",
    color: theme.palette.secondary.main,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: '0.2em'
  },
  margin: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  actionsCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& a': {
      color: theme.palette.primary.link,
      textDecoration: 'none'
    }
  },
  input: {
    '& fieldset': {
      border: 'none'
    },
    '& .MuiOutlinedInput-root': {
      width: '100% !important',
      borderRadius: '20px !important',
      height: 40,
      lineHeight: '40px',
      border: '1px solid #DFE5F9',
      '& input': {
        height: '38px !important',
        lineHeight: '38px !important',
        padding: 0
      },
      '& input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active ': {
        WebkitBoxShadow: '0 0 0 30px white inset !important'
      }
    },
    '& .MuiOutlinedInput-adornedEnd': {
      paddingRight: 0
    }
  },
  divider: {
    height: 1,
    width: '90%',
    background: '#E4E7EB',
    margin: '0 auto'
  },
  link: {
    color: theme.palette.primary.link,
    textDecoration: 'none',
    fontSize: 14
  },
  description: {
    color: '#4A4A4A',
    fontSize: 14,
    lineHeight: '28px'
  },
  checkbox: {
    '& .MuiTypography-root': {
      color: theme.palette.primary.dark,
      fontSize: '14px !important'
    }
  },
  icon: {
    color: theme.palette.secondary.icon
  },
  iconVis: {
    color: '#DFE5F9',
    fontSize: 18
  }
});

export default styles;
