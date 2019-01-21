import './ArticleList.css'
import React, { Component, ReactNode } from "react";
import { Article } from "../model";
import ArticleCard from "./ArticleCard";
import { Grid } from "@material-ui/core";
import { articleService } from '../index'
import InfiniteScroll from 'react-infinite-scroller'
import { Link, match, withRouter } from "react-router-dom";
import { Loader } from './Loader';
import { ArticleListFilter } from '../services';
import { Filter } from '.';
import { FilterState } from './Filter';
import { Routes } from './Routes';
import { History } from 'history';


interface ArticleListState {
    articles: Article[]
    hasMore: boolean
    filterState: ArticleListFilter
}

interface ArticleListRouteParams {
    sex?: string
    breedId?: string
    regionId?: string
}

interface ArticleListProps {
    match: match<ArticleListRouteParams>
    history: History
    location: any
}

export class ArticleList extends Component<ArticleListProps, ArticleListState> {
    private loadInProgress = false

    constructor(props: ArticleListProps) {
        super(props)
        this.state = {
            articles: [], 
            hasMore: true, 
            filterState: this.routeParamsToArticleFilter(this.props.match.params)
        }
    }

    private routeParamsToArticleFilter(routeParams: ArticleListRouteParams): ArticleListFilter {
        return {
            sex: routeParams.sex,
            breedId: routeParams.breedId && +routeParams.breedId || undefined,
            regionId: routeParams.regionId && +routeParams.regionId || undefined
        }
    }

    public componentWillReceiveProps(nextProps: ArticleListProps) {
        this.setState({ 
            filterState: this.routeParamsToArticleFilter(nextProps.match.params),
            articles: [],
            hasMore: true
        })
    }

    public render(): ReactNode {
        return (
            <div className="content">
                <Filter onChanged={(filterState) => this.navigateWithFilterState(filterState)} 
                    routeBreedId={this.state.filterState.breedId}
                    routeRegionId={this.state.filterState.regionId}
                />
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
                                            <ArticleCard article={art}/>
                                        </Link>
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </div>
                </InfiniteScroll>
            </div>
        )
    }

    private navigateWithFilterState(filterState: FilterState) {
        this.props.history.push(Routes.getArticleListRoute(this.state.filterState.sex, filterState.breedId, filterState.regionId))
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
        articleService.loadArticles(lastDisplayed, this.state.filterState).then(articles => {
            this.loadInProgress = false
            const newArticles = this.state.articles.slice().concat(articles)
            this.setState({articles: newArticles, hasMore: articles.length > 0})
        })
    }
}
