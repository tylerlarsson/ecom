import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import grey from '@material-ui/core/colors/grey';

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#32446F',
      inverse: '#fff',
      link: '#556791'
    },
    secondary: {
      main: '#95A5A6',
      dark: '#212529'
    }
  }
});
