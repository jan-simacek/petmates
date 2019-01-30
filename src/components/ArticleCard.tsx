import { Theme, Typography, CardContent, CardActions, IconButton, Card, CardHeader, Avatar, CardMedia, Tooltip, Snackbar } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import FavoriteIcon from '@material-ui/icons/Favorite';
import DeleteIcon from '@material-ui/icons/Delete'
import ChatIcon from '@material-ui/icons/Chat'
import AutoRenewIcon from '@material-ui/icons/Cached'
import React from "react";
import { Article } from "../model";
import { firestoreService } from '../services'
import { CurrentUser } from "../reducers";
import { ButtonWithConfirmation } from "./ButtonWithConfirmation";
import { articleService, userService } from "..";
import { Loader } from '.'

const styles = (theme: Theme) => (
    {
    card: {
        width: 400,
        height: 460,
        position: 'relative' as 'relative'
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: 'lightgrey',
    },
    articleText: {
        whiteSpace: 'pre-line' as 'pre-line',
    },
});

interface ArticleCardProps {
    classes: any
    article: Article
    currentUser?: CurrentUser
    onDelete: (article: Article) => void
    onRenew: (article: Article) => void  
    onUpdateArticle: (article: Article) => void  
}

interface ArticleCardState {
    expanded: boolean
    articleImgUrl?: string
    isLikeSubmitting: boolean
    isLiked: boolean
    likedSnackbarOpen: boolean
}

class ArticleCardClass extends React.Component<ArticleCardProps, ArticleCardState>{
    constructor(props: ArticleCardProps) {
        super(props)
        this.state = { expanded: false, articleImgUrl: undefined, isLikeSubmitting: false, isLiked: false, likedSnackbarOpen: false}
        firestoreService.getImageDownloadUrl(this.props.article.imageId)
            .then(url => this.setState({articleImgUrl: url}))
    }

    public componentWillReceiveProps(nextProps: ArticleCardProps) {
        this.setState({isLiked: nextProps.article.likedBy.includes(nextProps.currentUser!.uid)})
    }

    private onDeleteFinished() {
        this.props.onDelete(this.props.article)
    }

    private deleteArticle(): Promise<void> {
        return userService.getCurrentUserToken()
            .then(userToken => articleService.deleteArticle(this.props.article._id, userToken))
            .then(() => this.onDeleteFinished())
    }

    private renewArticle(): Promise<any> {
        return userService.getCurrentUserToken()
            .then(userToken => articleService.renewArticle(this.props.article._id, userToken))
            .then(newArticle => this.props.onRenew(newArticle))
    }

    private async onLikeClick(event: any): Promise<any> {
        event.preventDefault()
        this.setState({isLikeSubmitting: true})
        if(!this.props.currentUser) {
            return
        }
        const userToken = await userService.getCurrentUserToken()
        const result = await articleService.addOrRemoveLike(this.props.article._id, userToken, !this.state.isLiked)
        this.props.onUpdateArticle(result)
        this.setState({isLikeSubmitting: false, likedSnackbarOpen: true})
        return result
    }

    render() {
        const { classes } = this.props
        return (
            <Card className={classes.card}>
                <Snackbar 
                    anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                    open={this.state.likedSnackbarOpen}
                    onClose={() => this.setState({likedSnackbarOpen: false})}
                    autoHideDuration={3000}
                    message={<span>{this.state.isLiked ? "Přidáno k oblíbeným" : "Odebráno z oblíbených"}</span>}
                />
                <CardHeader
                    avatar={
                        this.props.article.userPhotoUrl ? (
                            <Avatar className={classes.avatar} alt={this.props.article.userName} src={this.props.article.userPhotoUrl} />
                        ) :(
                            <Avatar className={classes.avatar} alt={this.props.article.userName}>
                                {this.props.article.userName.substring(0,1)}
                            </Avatar>
                        )
                    }
                    subheader={this.props.article.breedName}
                    title={this.props.article.petName}
                />
                <CardMedia
                    className={classes.media}
                    image={this.state.articleImgUrl}
                    title="Paella dish"
                />
                <CardContent className="card-content">
                    <Typography component="p" className={classes.articleText}>
                        {this.props.article.articleText}
                    </Typography>
                </CardContent>
                <CardActions className="actions" disableActionSpacing>
                    {(this.props.currentUser && (this.props.currentUser.uid == this.props.article.userId)) ?
                        (
                            <span>
                                <ButtonWithConfirmation
                                    title="Smazat inzerát"
                                    text="Opravdu mám tento inzerát smazat?"
                                    onOk={this.deleteArticle.bind(this)}
                                >
                                    <DeleteIcon />
                                </ButtonWithConfirmation>
                                <ButtonWithConfirmation
                                    title="Obnovit inzerát"
                                    text="Inzerát bude znovu podán. Mám pokračovat?"
                                    onOk={this.renewArticle.bind(this)}
                                >
                                    <AutoRenewIcon />
                                </ButtonWithConfirmation>
                            </span>
                        ) : (
                            <span>
                                {this.state.isLikeSubmitting ? 
                                    (<Loader isSpan={true} />):
                                    (<Tooltip title={this.state.isLiked ? "Odebrat z oblíbených" : "Přidat k oblíbeným"}>
                                        <IconButton 
                                            onClick={this.onLikeClick.bind(this)}
                                            style={{color: this.state.isLiked ? '#77cfe8' : 'rgba(0, 0, 0, 0.54)'}}
                                        >
                                            <FavoriteIcon />
                                        </IconButton>
                                    </Tooltip>)
                                }
                                <Tooltip title="Poslat zprávu">
                                    <IconButton aria-label="Poslat zprávu">
                                        <ChatIcon />
                                    </IconButton>
                                </Tooltip>
                            </span>
                        )
                    }
                </CardActions>
            </Card>
        );
    }
}

export const ArticleCard = withStyles(styles)(ArticleCardClass)