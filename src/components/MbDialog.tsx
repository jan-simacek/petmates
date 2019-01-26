import React, { ReactNode, Fragment } from "react";
import { Dialog, DialogActions, Button, DialogContentText, DialogContent, DialogTitle } from "@material-ui/core";
import { Loader } from "./Loader";

interface MbDialogProps {
    onCancel?: () => void
    onOk: () => void
    open: boolean
    title: string
    text: string
}

interface MbDialogState {
    isSubmitting: boolean
}

export class MbDialog extends React.Component<MbDialogProps, MbDialogState> {
    constructor(props: MbDialogProps) {
        super(props)
        this.state = {isSubmitting: false}
    }

    private handleOnOk(event: any) {
        event.preventDefault()
        this.setState({isSubmitting: true})
        this.props.onOk()
    }

    private handleOnCancel(event: any) {
        event.preventDefault()
        if(this.props.onCancel) {
            this.props.onCancel()
        }
    }
    
    // public componentWillReceiveProps(nextProps: MbDialogProps) {
    //     if(!nextProps.open) {
    //         this.setState({isSubmitting: false})
    //     }
    // }

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
                    {this.state.isSubmitting ? (
                            <span style={{marginRight: '1em'}}>
                                <Loader />
                            </span>
                        ) : (
                        <Fragment>
                            <Button onClick={this.handleOnOk.bind(this)} color="secondary" disabled={this.state.isSubmitting}>
                                Ok
                            </Button>
                            <Button onClick={this.handleOnCancel.bind(this)} color="secondary" disabled={this.state.isSubmitting}>
                                Zrušit
                            </Button>
                        </Fragment>
                    )}
                </DialogActions>
            </Dialog>
        )
    }
}