import React, { ReactNode } from "react";
import { Tooltip, IconButton } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete'
import { MbDialog } from "./MbDialog";
import { articleService, userService } from '../index'

interface DeleteArticleButtonState {
    dialogOpen: boolean
}

interface DeleteArticleButtonProps {
    articleId: string
}

export class DeleteArticleButton extends React.Component<DeleteArticleButtonProps, DeleteArticleButtonState> {
    constructor(props: DeleteArticleButtonProps) {
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

    private onOkClick() {
        userService.getCurrentUserToken()
            .then(token => articleService.deleteArticle(this.props.articleId, token))
            .then(() => this.hideDialog())
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
                    onOk={this.onOkClick.bind(this)}
                    onCancel={this.hideDialog.bind(this)}
                    open={this.state.dialogOpen}
                    title="Smazat inzerát"
                    text="Opravdu mám tento inzerát smazat?"
                />
            </span>
        )
    }
}