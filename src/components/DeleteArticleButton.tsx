import React, { ReactNode } from "react";
import { Tooltip, IconButton } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete'
import { MbDialog } from "./MbDialog";

interface DeleteArticleButtonState {
    dialogOpen: boolean
}

export class DeleteArticleButton extends React.Component<any, DeleteArticleButtonState> {
    constructor(props: any) {
        super(props)
        this.state = {dialogOpen: false}
    }

    private showDialog() {
        this.setState({dialogOpen: true})
    }

    private hideDialog() {
        this.setState({dialogOpen: false})
    }

    private onDeleteClick(event: any) {
        event.preventDefault()
        this.showDialog()
    }

    public render(): ReactNode {
        return (
            <span>
                <Tooltip title="Smazat inzerát">
                    <IconButton aria-label="Smazat inzerát" onClick={this.onDeleteClick.bind(this)}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
                <MbDialog 
                    onOk={() => alert('ok clicked')}
                    onCancel={this.hideDialog.bind(this)}
                    open={this.state.dialogOpen}
                    title="Smazat inzerát"
                    text="Opravdu mám tento inzerát smazat?"
                />
            </span>
        )
    }
}