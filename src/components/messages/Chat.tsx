import './Chat.css'
import React, { ReactNode } from "react";
import { CurrentUser, RootState, getCurrentUser } from "../../reducers";
import { connect } from "react-redux";
import { FormControl, Grid, IconButton, Typography, Avatar } from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import {TextField as MTextField} from '@material-ui/core'
import {fieldToTextField} from 'formik-material-ui'
import SendIcon from '@material-ui/icons/Send';
import { ChatFeed } from '..';
import { match } from 'react-router';
import { messageService, graphqlCacheService, conversationService } from '../..';
import { Message, Conversation } from '../../model';

interface ChatRouteParams {
    conversationId: string
}

interface ChatProps {
    match: match<ChatRouteParams>
    currentUser?: CurrentUser
}

interface ChatFormState {
    composedMessage: string
}

interface ChatState {
    chatFormState: ChatFormState
    items: Message[]
    loading: boolean
    hasMore: boolean
    conversation?: Conversation
}

class ChatClass extends React.Component<ChatProps, ChatState> {
    constructor(props: ChatProps) {
        super(props)
        this.state = { 
            chatFormState: { composedMessage: "" },
            items: [],
            loading: false,
            hasMore: true
        }
    }

    public render(): ReactNode {
        return (
            <div className="content">
                <div className="heading">
                    <div className="chat">
                        <div className="chat-heading">
                            <Grid container direction="row">
                                <Grid item style={{display: 'flex', alignItems: 'center'}}>
                                    <Typography variant="headline">{this.state.conversation && this.state.conversation.otherUserName}</Typography>
                                </Grid>
                            </Grid>
                        </div>

                        <div className="chat-feed">
                            {this.props.currentUser && (
                                <ChatFeed currentUser={this.props.currentUser}
                                    hasMore={this.state.hasMore}
                                    items={this.state.items}
                                    loadPageOfItems={this.loadPageOfItems.bind(this)}
                                    loading={this.state.loading}
                                /> 
                            )}
                        </div>

                        <Formik initialValues={this.state.chatFormState}
                            validate={this.validate}
                            onSubmit={(values: ChatFormState, {setSubmitting, resetForm}) => {
                                setSubmitting(true)
                                this.onSubmit(values, resetForm).then(() => setSubmitting(false))
                            }}
                            validateOnBlur={false} validateOnChange={false}
                        >
                            {({errors, touched, isSubmitting, submitForm}) => {
                            return (
                                <Form className="composed-message">
                                    <Grid container direction="row">
                                        <Grid item xs={11}>
                                            <FormControl disabled={isSubmitting} style={{width: '100%'}}>
                                                <Field name="composedMessage" render={(props: any) => (
                                                    <MTextField {...fieldToTextField(props)} multiline={true} rows={4}
                                                        label="Napište zprávu" style={{width: '100%'}}  
                                                        onKeyDown={(event: any) => {
                                                            if(event.keyCode == 13 && event.ctrlKey) {
                                                                submitForm()
                                                            }
                                                        }}
                                                        autoFocus={true}/>
                                                )}/>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={1} alignContent="center" justify="center" container direction="row">
                                            <Grid item style={{display: 'flex'}}>
                                                <IconButton>
                                                    <SendIcon className="send-icon" onClick={submitForm}/>
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Form>
                            )}}
                        </Formik>
                    </div>
                </div>
            </div>
        )
    }

    private async onSubmit(values: ChatFormState, resetForm: () => any): Promise<Message> {
        const newMessage = await messageService.addTextMessage({
            content: values.composedMessage,
            conversationId: this.props.match.params.conversationId
        })
        const newMessages = this.state.items.slice()
        newMessages.unshift(newMessage)
        await graphqlCacheService.updateMessagesCache(this.props.match.params.conversationId, newMessages)
        this.setState({items: newMessages, chatFormState: {composedMessage: ""}})
        resetForm()
        return newMessage
    }

    private validate(values: ChatFormState): any {
        if(values.composedMessage.trim() == ""){
            return {composedMessage: "Zpráva nemůže být prázdná"}
        } else {
            return {}
        }
    }

    private async loadPageOfItems(): Promise<void> {
        this.setState({loading: true})
        const lastDisplayedId = this.state.items.length > 0 ? this.state.items[this.state.items.length - 1]._id : undefined
        const newMessages = await messageService.loadMessages(this.props.match.params.conversationId, lastDisplayedId)

        this.setState({items: this.state.items.concat(newMessages), hasMore: newMessages.length > 0, loading: false})
    }

    private async loadConversation(): Promise<void> {
        const conversation = await conversationService.loadConversation(this.props.match.params.conversationId)
        this.setState({conversation})
    }

    private init(props: ChatProps) {
        if(props.currentUser) {
            this.loadPageOfItems()
        }
        if(!this.state.conversation || (props && props.match.params.conversationId != this.state.conversation._id)) {
            this.loadConversation()
        }
    }

    public componentWillReceiveProps(newProps: ChatProps) {
        this.init(newProps)
    }

    public componentDidMount() {
        if(this.props.currentUser) {
            this.init(this.props)
        }
    }
}

const mapStateToProps = (rootState: RootState) => {
    return {
        currentUser: getCurrentUser(rootState)
    }
}

export const Chat = connect(mapStateToProps)(ChatClass)