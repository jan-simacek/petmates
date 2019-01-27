import React, { ReactNode } from "react";
import { Tooltip, IconButton } from "@material-ui/core";
import { MbDialog } from "./MbDialog";

interface ButtonWithConfirmationState {
    dialogOpen: boolean
    isSubmitting: boolean
}

interface ButtonWithConfirmationProps {
    onOk: () => Promise<any>
    title: string
    text: string
}

export class ButtonWithConfirmation extends React.Component<ButtonWithConfirmationProps, ButtonWithConfirmationState> {
    constructor(props: ButtonWithConfirmationProps) {
        super(props)
        this.state = {dialogOpen: false, isSubmitting: false}
    }
    private showDialog() {
        this.setState({dialogOpen: true})
    }

    private hideDialog() {
        this.setState({dialogOpen: false})
    }

    private onButtonClick(event: any) {
        event.preventDefault()
        this.showDialog()
    }

    private onOkClick() {
        this.setState({isSubmitting: true})
        this.props.onOk().then(() => this.hideDialog())
    }

    public render(): ReactNode {
        return (
            <span>
                <Tooltip title={this.props.title}>
                    <IconButton aria-label={this.props.title} onClick={this.onButtonClick.bind(this)}>
                        {this.props.children}
                    </IconButton>
                </Tooltip>
                <MbDialog 
                    onOk={this.onOkClick.bind(this)}
                    onCancel={this.hideDialog.bind(this)}
                    open={this.state.dialogOpen}
                    title={this.props.title}
                    text={this.props.text}
                />
            </span>
        )
    }}