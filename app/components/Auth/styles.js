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
    letterSpacing: '0.3em'
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
        height: '40px !important',
        lineHeight: '40px !important',
        padding: 0
      },
      '& input:-internal-autofill-selected': {
        backgroundColor: 'transparent !important'
      }
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
  checkbox: {
    '& .MuiTypography-root': {
      color: theme.palette.primary.dark,
      fontSize: '14px !important'
    }
  },
  icon: {
    color: theme.palette.secondary.main
  }
});

export default styles;
