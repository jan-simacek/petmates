import React, { ReactNode } from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core";

interface LoginAlertProps {
    open: boolean
    onClose: () => void
}

export class LoginAlert extends React.Component<LoginAlertProps> {
    public render(): ReactNode {
        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.onClose}
            >
                <DialogTitle id="alert-dialog-title">Přihlášení</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Pro přidání inzerátu je potřeba se nejdřív přihlásit.
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