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

const styles = (theme: Theme) => ({
    card: {
        maxWidth: 400,
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
    actions: {
        display: 'flex',
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
    }
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
                        <Avatar className={classes.avatar} alt="Věk">
                            {parseFloat("" + Math.round(this.props.article.petAge * 10) / 10)}
                        </Avatar>
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
                <CardContent>
                    <Typography component="p">
                        This impressive paella is a perfect party dish and a fun meal to cook together with your
                        guests. Add 1 cup of frozen peas along with the mussels, if you like.
          </Typography>
                </CardContent>
                <CardActions className={classes.actions} disableActionSpacing>
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
                <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography paragraph>Method:</Typography>
                        <Typography paragraph>
                            Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
                            minutes.
            </Typography>
                        <Typography paragraph>
                            Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high
                            heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly
                            browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving
                            chicken and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion,
                            salt and pepper, and cook, stirring often until thickened and fragrant, about 10
                            minutes. Add saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
            </Typography>
                        <Typography paragraph>
                            Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook
                            without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat
                            to medium-low, add reserved shrimp and mussels, tucking them down into the rice, and
                            cook again without stirring, until mussels have opened and rice is just tender, 5 to 7
                            minutes more. (Discard any mussels that don’t open.)
            </Typography>
                        <Typography>
                            Set aside off of the heat to let rest for 10 minutes, and then serve.
            </Typography>
                    </CardContent>
                </Collapse>
            </Card>
        );
    }
}

export default withStyles(styles)(ArticleCard);