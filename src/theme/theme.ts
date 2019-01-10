import { createMuiTheme }from '@material-ui/core'
import { amber, orange, yellow } from '@material-ui/core/colors'


export const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#ffeebd',
          },
          secondary: {
            main: '#ffe082',
          },
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        h2: {
            color: '#535353'
        },
        h6: {
            color: '#535353'
        },
        body2: {
            color: '#535353'
        }
    },
    shape: {
        borderRadius: 10
    }
})