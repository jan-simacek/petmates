import './ArticleList.css'
import React, { Component, ReactNode } from "react";
import { match } from "react-router-dom";
import { ArticleListFilter } from '../services';
import { Filter } from '.';
import { FilterState } from './Filter';
import { Routes } from '../Routes';
import { History } from 'history';
import { ArticleListing } from './ArticleListing';

interface ArticleListState {
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
    constructor(props: ArticleListProps) {
        super(props)
        this.state = {
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
        })
    }

    public render(): ReactNode {
        return (
            <div className="content">
                <Filter onChanged={(filterState) => this.navigateWithFilterState(filterState)} 
                    routeBreedId={this.state.filterState.breedId}
                    routeRegionId={this.state.filterState.regionId}
                />
                <ArticleListing filterState={this.state.filterState} />
            </div>
        )
    }

    private navigateWithFilterState(filterState: FilterState) {
        this.props.history.push(Routes.getArticleListRoute(this.state.filterState.sex, filterState.breedId, filterState.regionId))
    }
}
