import { createMuiTheme }from '@material-ui/core'
import { amber, orange } from '@material-ui/core/colors'


export const theme = createMuiTheme({
    palette: {
        primary: amber,
        secondary: orange
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
        }
    },
    shape: {
        borderRadius: 10
    }
})