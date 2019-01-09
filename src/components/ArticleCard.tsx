import { Theme, Typography, CardContent, Collapse, CardActions, IconButton, Card, CardHeader, Avatar, CardMedia } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import classnames from 'classnames';
import React from "react";
import { Article } from "../model";
import { firestoreService } from '../services'

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
}

interface ArticleCardState {
    expanded: boolean
    articleImgUrl?: string
}

export class ArticleCard extends React.Component<ArticleCardProps, ArticleCardState>{
    constructor(props: ArticleCardProps) {
        super(props)
        this.state = { expanded: false, articleImgUrl: undefined}
        firestoreService.getImageDownloadUrl(this.props.article.imageId)
            .then(url => this.setState({articleImgUrl: url}))
    }

    handleExpandClick = () => {
        this.setState(state => ({ expanded: !state.expanded }));
    };

    render() {
        const { classes } = this.props;

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
                    // action={
                    //   <IconButton>
                    //     <MoreVertIcon />
                    //   </IconButton>
                    // }
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
                    <IconButton aria-label="Add to favorites">
                        <FavoriteIcon />
                    </IconButton>
                    <IconButton aria-label="Share">
                        <ShareIcon />
                    </IconButton>
                    <IconButton
                        className={classnames(classes.expand, {
                            [classes.expandOpen]: this.state.expanded,
                        })}
                        onClick={this.handleExpandClick}
                        aria-expanded={this.state.expanded}
                        aria-label="Show more"
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                </CardActions>
            </Card>
        );
    }
}

export default withStyles(styles)(ArticleCard);