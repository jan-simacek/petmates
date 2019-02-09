import './Messages.css'
import React, { ReactNode } from "react";
import { Typography, Grid, Card, CardHeader, Avatar, IconButton, CardContent, withStyles } from "@material-ui/core";
import InfiniteScroll from 'react-infinite-scroller'
import DeleteIcon from '@material-ui/icons/Delete'
import { Conversation } from '../../model';
import { conversationService } from '../..';
import { Loader } from '..';
import { RootState, getCurrentUser, CurrentUser } from '../../reducers';
import { connect } from 'react-redux';
import { Util } from '../../services';
import { ButtonWithConfirmation } from '../common/ButtonWithConfirmation';

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
    classes: any,
    currentUser?: CurrentUser
}

interface MessagesState { 
    messages: Conversation[]
    hasMore: boolean
}

class MessagesClass extends React.Component<MessagesProps, MessagesState> {
    private loadInProgress = false;

    constructor(props: MessagesProps) {
        super(props)
        this.state = { 
            messages: [],
            hasMore: true
        }
    }

    public render(): ReactNode {
        const classes = this.props.classes
        return (
            <div className="content">
                <div className="heading">
                    <Typography variant="h2">Zprávy</Typography>
                </div>
                <div className="message-list">
                    <InfiniteScroll
                    pageStart={0}
                    loadMore={this.loadMore.bind(this)}
                    hasMore={this.state.hasMore}
                    loader={<Loader key="loader" />}>
                        <Grid direction="column" spacing={16} alignItems="center" container>
                            {this.state.messages.map((message: Conversation) => {
                                return (
                                    <Grid item xs={12} md={11} style={{width: '100%'}} key={message._id}>
                                        <Card className={classes.card}>
                                            <CardHeader
                                            avatar={
                                                message.otherUserPhotoUrl ? (
                                                    <Avatar className={classes.avatar} alt={message.otherUserName} src={message.otherUserPhotoUrl} />
                                                ) :(
                                                    <Avatar className={classes.avatar} alt={message.otherUserName}>
                                                        {message.otherUserName.substring(0,1)}
                                                    </Avatar>
                                                )
                                            }
                                            action={
                                                <IconButton>
                                                    <ButtonWithConfirmation onOk={()=> new Promise((resolve, reject) => {
                                                        setTimeout(() => resolve(), 500)
                                                    })} title="Smazat konverzaci" text="Opravdu mám smazat tuto konverzaci?">
                                                        <DeleteIcon />
                                                    </ButtonWithConfirmation>
                                                </IconButton>
                                            }
                                            title={message.otherUserName}
                                            subheader={Util.formatDate(message.lastUpdate)}
                                            />
                                            <CardContent className={classes.cardContent}>
                                                <Typography variant="body1">{message.lastMessage}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </InfiniteScroll>
                </div>
            </div>
        )
    }
    
    private loadMore() {
        if(this.loadInProgress || !this.props.currentUser) {
            return
        }

        let lastDisplayed = undefined
        if(this.state.messages.length > 0) {
            lastDisplayed = this.state.messages[this.state.messages.length - 1]._id
        }

        this.loadInProgress = true
        conversationService.loadConversations(lastDisplayed)
            .then((conversations: Conversation[]) => {
                this.loadInProgress = false
                const newConversations = this.state.messages.slice().concat(conversations)
                this.setState({messages: newConversations, hasMore: conversations.length > 0})
            })
    }

    private deleteConversation(): Promise<any> {
        
    }
}

const mapStateToProps = (rootState: RootState) => {
    return { 
        currentUser: getCurrentUser(rootState)
    }
}

export const MessagesContainer = connect(mapStateToProps)(withStyles(styles)(MessagesClass))