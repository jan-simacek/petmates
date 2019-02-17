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
import { ItemListingDelegate, ItemListingState } from '../common/ItemListingDelegate';
import { Link } from 'react-router-dom';
import { RoutesEnum, Routes } from '../../Routes';

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
    items: Conversation[]
    hasMore: boolean
}

class MessagesClass extends React.Component<MessagesProps, MessagesState> {
    private delegate: ItemListingDelegate<Conversation>

    constructor(props: MessagesProps) {
        super(props)
        this.state = { 
            items: [],
            hasMore: true
        }
        this.delegate = new ItemListingDelegate({
            loadMore: (lastDisplayedId?: string) => conversationService.loadConversations(lastDisplayedId),
            setState: (newState: ItemListingState<Conversation>) => this.setState(newState)
        })
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
                            {this.state.items.map((conversation: Conversation) => {
                                return (
                                    <Grid item xs={12} md={11} style={{width: '100%'}} key={conversation._id}>
                                        <Link to={Routes.getChatRoute(conversation._id)} style={{textDecoration: 'none'}}>
                                            <Card className={classes.card}>
                                                <CardHeader
                                                avatar={
                                                    conversation.otherUserPhotoUrl ? (
                                                        <Avatar className={classes.avatar} alt={conversation.otherUserName} src={conversation.otherUserPhotoUrl} />
                                                    ) :(
                                                        <Avatar className={classes.avatar} alt={conversation.otherUserName}>
                                                            {conversation.otherUserName.substring(0,1)}
                                                        </Avatar>
                                                    )
                                                }
                                                action={
                                                    <ButtonWithConfirmation onOk={() => this.deleteConversation(conversation._id)} 
                                                            title="Smazat konverzaci" text="Opravdu mám smazat tuto konverzaci?">
                                                        <DeleteIcon />
                                                    </ButtonWithConfirmation>
                                                }
                                                title={conversation.otherUserName}
                                                subheader={Util.formatDate(conversation.lastUpdate)}
                                                />
                                                <CardContent className={classes.cardContent}>
                                                    <Typography variant="body1">{conversation.lastMessage}</Typography>
                                                </CardContent>
                                            </Card>
                                        </Link>
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
        if(!this.props.currentUser) {
            return
        }
        this.delegate.loadMore()
    }

    private async deleteConversation(conversationId: string): Promise<any> {
        const deletedConversation = await conversationService.deleteConversation(conversationId)
        this.delegate.deleteItem(deletedConversation)
    }
}

const mapStateToProps = (rootState: RootState) => {
    return { 
        currentUser: getCurrentUser(rootState)
    }
}

export const MessagesContainer = connect(mapStateToProps)(withStyles(styles)(MessagesClass))