import './Messages.css'
import React, { ReactNode } from "react";
import { Typography, Grid, Card, CardHeader, Avatar, IconButton, CardMedia, CardContent, CardActions, Collapse, withStyles } from "@material-ui/core";
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const styles = (theme: any) => ({
    card: {
    //   maxWidth: 400,
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
      backgroundColor: 'red',
    },
    cardContent: {
        lineHeight: '1.5em',
        height: '1.5em',
        overflow: 'hidden',
        whiteSpace: 'nowrap' as 'nowrap',
        textOverflow: 'ellipsis',
        paddingTop: 0
    }
  });

interface MessagesProps {
    classes: any
}

class MessagesClass extends React.Component<MessagesProps> {

    public render(): ReactNode {
        const classes = this.props.classes
        return (
            <div className="content">
                <div className="heading">
                    <Typography variant="h2">Zprávy</Typography>
                </div>
                <div className="message-list">
                    <Grid direction="column" spacing={16} alignItems="center" container>
                        <Grid item xs={12} md={11}>
                            <Card className={classes.card}>
                                <CardHeader
                                avatar={
                                    <Avatar aria-label="Recipe" className={classes.avatar}>
                                    R
                                    </Avatar>
                                }
                                action={
                                    <IconButton>
                                        <MoreVertIcon />
                                    </IconButton>
                                }
                                title="Shrimp and Chorizo Paella"
                                subheader="September 14, 2016"
                                />
                                <CardContent className={classes.cardContent}>
                                        This impressive paella is a perfect party dish and a fun meal to cook together with your
                                        guests. Add 1 cup of frozen peas along with the mussels, if you like. qwe rqwoeir oweiur qowieu roqwieur oqiuew roiqw
                                        oqwie roqwieu rqowieu rqw
                                        oq iwuer oqiwuer oqiwue roqiwue roqiwue orqiwue oiqrue 
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </div>
            </div>
        )
    }
}

export const MessagesContainer = withStyles(styles)(MessagesClass)