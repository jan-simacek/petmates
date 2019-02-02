import React, { ReactNode } from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core";

interface MbAlertProps {
    open: boolean
    onClose: () => void
    title: string
    text: string
}

export class MbAlert extends React.Component<MbAlertProps> {
    public render(): ReactNode {
        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.onClose}
            >
                <DialogTitle id="alert-dialog-title">{this.props.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {this.props.text}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onClose} color="secondary">
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>    
        )
    }
}