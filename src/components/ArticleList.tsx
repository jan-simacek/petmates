import React, { Component, ReactNode } from "react";
import { Query } from "react-apollo";
import { ArticleListResponse, Article } from "../model";
import gql from "graphql-tag";
import ArticleCard from "./ArticleCard";
import { Grid, Typography, CircularProgress } from "@material-ui/core";
import './ArticleList.css'
import { articleService } from '../index'
import InfiniteScroll from 'react-infinite-scroller'

class ArticleListQuery extends Query<ArticleListResponse> { }

interface ArticleListState {
    articles: Article[]
    hasMore: boolean
}

export class ArticleList extends Component<any, ArticleListState> {
    constructor(props: any) {
        super(props)
        this.state = {articles: [], hasMore: true}
    }

    render(): ReactNode {
        return (
            <InfiniteScroll
                pageStart={0}
                loadMore={this.loadMore.bind(this)}
                hasMore={this.state.hasMore}
                loader={<div key='loader' className='loader-wrapper'><CircularProgress className='loader' /></div>}>
                <div className="article-list">
                    <Grid container spacing={24} justify="center">
                        {this.state.articles.map(art => {
                            return <Grid key={art._id} item><ArticleCard article={art}/></Grid>
                        })}
                    </Grid>
                </div>
            </InfiniteScroll>
        )
    }

    private loadMore() {
        let lastDisplayed = undefined
        if(this.state.articles.length > 0) {
            lastDisplayed = this.state.articles[this.state.articles.length - 1]._id
        }

        articleService.loadArticles(lastDisplayed).then(articles => {
            const newArticles = this.state.articles.slice().concat(articles)
            this.setState({articles: newArticles, hasMore: articles.length > 0})
        })
    }
}
