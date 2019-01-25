import React, { ReactNode } from "react";
import InfiniteScroll from 'react-infinite-scroller'
import { articleService } from "..";
import { Article } from "../model";
import { Loader, ArticleCardContainer } from ".";
import { Grid } from "@material-ui/core";
import { Link } from "react-router-dom";
import { ArticleListFilter } from "../services";

interface ArticleListingState {
    articles: Article[]
    hasMore: boolean
}

interface ArticleListingProps {
    filterState: ArticleListFilter
}

export class ArticleListing extends React.Component<ArticleListingProps, ArticleListingState> {
    private loadInProgress = false

    constructor(props: any) {
        super(props)
        this.state = {
            articles: [], 
            hasMore: true
        }
    }

    public componentWillReceiveProps(nextProps: ArticleListingProps) {
        this.setState({
            articles: [],
            hasMore: true
        })
    }

    private onArticleDelete(article: Article) {
        const index = this.state.articles.indexOf(article)
        const newItems = this.state.articles.slice(0)
        newItems.splice(index, 1)
        this.setState({articles: newItems})
    }

    public render(): ReactNode {
        return (
            <InfiniteScroll
                pageStart={0}
                loadMore={this.loadMore.bind(this)}
                hasMore={this.state.hasMore}
                loader={<Loader key="loader" />}>
                <div className="article-list">
                    <Grid container spacing={24} justify="center">
                        {this.state.articles.map(art => {
                            return (
                                <Grid key={art._id} item>
                                    <Link to={`/article/${art._id}`} style={{ textDecoration: 'none' }}>
                                        <ArticleCardContainer article={art} onDelete={this.onArticleDelete.bind(this)} />
                                    </Link>
                                </Grid>
                            )
                        })}
                    </Grid>
                </div>
            </InfiniteScroll>
        )
    }

    private loadMore() {
        if(this.loadInProgress) {
            return
        }

        let lastDisplayed = undefined
        if(this.state.articles.length > 0) {
            lastDisplayed = this.state.articles[this.state.articles.length - 1]._id
        }

        this.loadInProgress = true
        articleService.loadArticles(lastDisplayed, this.props.filterState).then(articles => {
            this.loadInProgress = false
            const newArticles = this.state.articles.slice().concat(articles)
            this.setState({articles: newArticles, hasMore: articles.length > 0})
        })
    }

}