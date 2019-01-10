import { createMuiTheme }from '@material-ui/core'
import { amber, orange, yellow } from '@material-ui/core/colors'


export const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#e1e0dd',
          },
          secondary: {
            main: '#a2e3f5',
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