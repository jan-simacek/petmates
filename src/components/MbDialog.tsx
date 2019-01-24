import React, { ReactNode } from "react";
import { Dialog, DialogActions, Button, DialogContentText, DialogContent, DialogTitle } from "@material-ui/core";

interface MbDialogProps {
    onCancel?: () => void
    onOk: () => void
    open: boolean
    title: string
    text: string
}

export class MbDialog extends React.Component<MbDialogProps> {
    private handleOnOk(event: any) {
        event.preventDefault()
        this.props.onOk()
    }

    private handleOnCancel(event: any) {
        event.preventDefault()
        if(this.props.onCancel) {
            this.props.onCancel()
        }
    }
    
    public render(): ReactNode {
        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.onCancel}
            >
                <DialogTitle id="alert-dialog-title">{this.props.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {this.props.text}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleOnOk.bind(this)} color="secondary">
                        Ok
                    </Button>
                    <Button onClick={this.handleOnCancel.bind(this)} color="secondary">
                        Zrušit
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}