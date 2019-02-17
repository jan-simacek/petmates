import { ReactNode } from "react";
import React from "react";
import { Message } from "../../model";
import { ItemListingDelegate, ItemListingState } from "../common/ItemListingDelegate";
import { messageService } from "../..";
import { Loader } from "..";
import InfiniteScroll from 'react-infinite-scroller'

interface ChatFeedProps {
    conversationId: string
}

interface ChatFeedState {
    items: Message[]
    hasMore: boolean
}

export class ChatFeed extends React.Component<ChatFeedProps, ChatFeedState> {
    private delegate: ItemListingDelegate<Message>
    
    constructor(props: ChatFeedProps) {
        super(props)
        this.state = {items: [], hasMore: true}
        this.delegate = new ItemListingDelegate({
            loadMore: (lastDisplayed?: string) => messageService.loadMessages(this.props.conversationId, lastDisplayed),
            setState: (newState: ItemListingState<Message>) => this.setState(newState)
        })
    }

    public componentWillReceiveProps(_: ChatFeedProps) {
        this.setState({
            items: [],
            hasMore: true
        })
    }

    public render(): ReactNode {
        return (
            <InfiniteScroll
                pageStart={0}
                loadMore={this.delegate.loadMore}
                hasMore={this.state.hasMore}
                loader={<Loader key="loader" />}
                isReverse={true}
            >
                <div>
                    {this.state.items.slice().reverse().map(msg => <div key={msg._id}>{msg.content}</div>)}
                </div>
            </InfiniteScroll>
        )
    }
}