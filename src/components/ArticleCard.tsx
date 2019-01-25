import { Theme, Typography, CardContent, CardActions, IconButton, Card, CardHeader, Avatar, CardMedia, Tooltip } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChatIcon from '@material-ui/icons/Chat'
import AutoRenewIcon from '@material-ui/icons/Cached'
import React from "react";
import { Article } from "../model";
import { firestoreService } from '../services'
import { CurrentUser } from "../reducers";
import { DeleteArticleButton } from "./DeleteArticleButton";

const styles = (theme: Theme) => (
    {
    card: {
        width: 400,
        height: 460,
        position: 'relative' as 'relative'
    },
    cardHeaderM: {
        backgroundColor: '#d3e7ff'
    },
    cardHeaderF: {
        backgroundColor: '#fddcf6'
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
    onDelete?: (article: Article) => void
}

interface ArticleCardState {
    expanded: boolean
    articleImgUrl?: string
}

class ArticleCardClass extends React.Component<ArticleCardProps, ArticleCardState>{
    constructor(props: ArticleCardProps) {
        super(props)
        this.state = { expanded: false, articleImgUrl: undefined}
        firestoreService.getImageDownloadUrl(this.props.article.imageId)
            .then(url => this.setState({articleImgUrl: url}))
    }

    private onDelete() {
        this.props.onDelete && this.props.onDelete(this.props.article)
    }

    render() {
        const { classes } = this.props;
        console.log(`petName: ${this.props.article.petName}, userId: ${this.props.article.userId}, currentUserId: ${this.props.currentUser && this.props.currentUser.uid}`)
        return (
            <Card className={classes.card}>
                <CardHeader
                    className={this.props.article.isMale ? classes.cardHeaderM : classes.cardHeaderF}
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
                                <DeleteArticleButton articleId={this.props.article._id} onDelete={this.onDelete.bind(this)}/>
                                <Tooltip title="Obnovit inzerát">
                                    <IconButton aria-label="Obnovit inzerát">
                                        <AutoRenewIcon />
                                    </IconButton>
                                </Tooltip>
                            </span>
                        ) : (
                            <span>
                                <Tooltip title="Přidat k oblíbeným">
                                    <IconButton aria-label="Přidat k oblíbeným">
                                        <FavoriteIcon />
                                    </IconButton>
                                </Tooltip>
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