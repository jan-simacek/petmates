import React, { ReactNode } from "react";
import InfiniteScroll from 'react-infinite-scroller'
import { articleService } from "..";
import { Article } from "../model";
import { Loader, ArticleCardContainer } from ".";
import { Grid, withWidth } from "@material-ui/core";
import { Link } from "react-router-dom";
import { ArticleListFilter } from "../services";
import { ItemListingDelegate, ItemListingState } from "./common/ItemListingDelegate";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { isWidthDown } from "@material-ui/core/withWidth";

interface ArticleListingState {
    items: Article[]
    hasMore: boolean
}

interface ArticleListingProps {
    filterState: ArticleListFilter
    width: Breakpoint
}

export class ArticleListingClass extends React.Component<ArticleListingProps, ArticleListingState> {
    private delegate: ItemListingDelegate<Article>

    constructor(props: any) {
        super(props)
        this.state = {
            items: [], 
            hasMore: true
        }
        this.delegate = new ItemListingDelegate({
            loadMore: (lastDisplayed?: string) => articleService.loadArticles(lastDisplayed, this.props.filterState),
            setState: (newState: ItemListingState<Article>) => this.setState(newState)
        })
    }

    public componentWillReceiveProps(_: ArticleListingProps) {
        this.setState({
            items: [],
            hasMore: true
        })
    }

    private onRenewArticle(newArticle: Article) {
        const newItems = this.delegate.deleteItem(newArticle)
        newItems.unshift(newArticle)
        this.setState({items: newItems})
    }

    public render(): ReactNode {
        return (
            <InfiniteScroll
                pageStart={0}
                loadMore={this.delegate.loadMore}
                hasMore={this.state.hasMore}
                loader={<Loader key="loader" />}>
                <div className="article-list">
                    <Grid container spacing={24} className={isWidthDown('sm', this.props.width) ? 'articles-center' : 'articles-left'}>
                        {this.state.items.map(art => {
                            return (
                                <Grid key={art._id} item>
                                    <Link to={`/article/${art._id}`} style={{ textDecoration: 'none' }}>
                                        <ArticleCardContainer 
                                            article={art} 
                                            onDelete={this.delegate.deleteItem} 
                                            onRenew={this.onRenewArticle.bind(this)}
                                            onUpdateArticle={this.delegate.updateItem}
                                        />
                                    </Link>
                                </Grid>
                            )
                        })}
                    </Grid>
                </div>
            </InfiniteScroll>
        )
    }
}

export const ArticleListing = withWidth()(ArticleListingClass)