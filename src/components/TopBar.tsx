import React, { Component, ReactNode } from "react";
import { withStyles, AppBar, Toolbar, IconButton, Typography, Button } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';

const styles = {
    root: {
      flexGrow: 1,
    },
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20,
    },
  };

class TopBar extends Component {
    private classes: any
    constructor(props: any) {
        super(props)
        this.classes = props.classes;
    }

    public render(): ReactNode {
        return (
            // <div className={this.classes.root}>
            //   <AppBar position="static">
            //     <Toolbar>
            //       <Button color="inherit">Login</Button>
            //     </Toolbar>
            //   </AppBar>
            // </div>
            <div className={this.classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" color="inherit" className={this.classes.grow}>
                            News
                        </Typography>
                        <Button color="inherit">Login</Button>
                    </Toolbar>
                </AppBar>
            </div>
          );
    }
}

export default withStyles(styles)(TopBar)
