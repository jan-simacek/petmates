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
}

class ChatClass extends React.Component<ChatProps, ChatState> {
    constructor(props: ChatProps) {
        super(props)
        this.state = { 
            chatFormState: { composedMessage: "" } 
        }
    }

    public render(): ReactNode {
        return (
            <div className="content">
                <div className="heading">
                    <div className="chat-heading">
                        <Grid container direction="row">
                            <Grid item style={{display: 'flex', alignItems: 'center'}}>
                                <Typography variant="headline">Jan Šimáček</Typography>
                            </Grid>
                        </Grid>
                    </div>

                    <div className="chat-feed">
                        {this.props.currentUser && <ChatFeed conversationId={this.props.match.params.conversationId} /> }
                    </div>

                    <Formik initialValues={this.state.chatFormState}
                        validate={this.validate}
                        onSubmit={(values: ChatFormState, {setSubmitting}) => {
                            alert('submitted')
                            setSubmitting(false)
                        }}
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
                                                    }}/>
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
        )
    }

    private validate(values: ChatFormState): any {
        if(values.composedMessage.trim() == ""){
            return {composedMessage: "Zpráva nemůže být prázdná"}
        } else {
            return {}
        }
    }
}

const mapStateToProps = (rootState: RootState) => {
    return {
        currentUser: getCurrentUser(rootState)
    }
}

export const Chat = connect(mapStateToProps)(ChatClass)