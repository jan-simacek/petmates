import { ReactNode } from "react";
import React from "react";
import { Message } from "../../model";
import { messageService } from "../..";
import { Loader } from "..";
import { CurrentUser } from "../../reducers";
import './ChatFeed.css'
import { Button } from "@material-ui/core";

interface ChatFeedProps {
    currentUser: CurrentUser
    items: Message[]
    hasMore: boolean
    loading: boolean
    loadPageOfItems: () => Promise<any>
}

export class ChatFeed extends React.Component<ChatFeedProps> {
    constructor(props: ChatFeedProps) {
        super(props)
    }

    public render(): ReactNode {
        return (
            <div className="messages-container">
                {this.props.hasMore && !this.props.loading && (
                    <div className="load-more">
                        <Button color="secondary" onClick={() => this.props.loadPageOfItems()} disabled={this.props.loading}>Zobrazit starší zprávy</Button>
                    </div>
                )}
                {this.props.loading && <Loader />}
                {this.props.items.slice().reverse().map(msg => (
                    <div className="single-message-container" key={msg._id}>
                        <div className={msg.fromUid === this.props.currentUser.uid ? 'my-message' : 'other-message'}>
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>
        )
    }
}