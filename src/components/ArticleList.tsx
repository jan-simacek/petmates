import React, { Component, ReactNode } from "react";
import { Query } from "react-apollo";
import { ArticleListResponse } from "../model";
import gql from "graphql-tag";
import ArticleCard from "./ArticleCard";

class ArticleListQuery extends Query<ArticleListResponse> { }

const ARTICLES_QUERY = gql`
    {
        articles {
            _id
            breedName
            breedId
            petName
            age
            isMale
            createDate
        }
    }
`

export class ArticleList extends Component {
    render(): ReactNode {
        return (
            <ArticleListQuery query={ARTICLES_QUERY}>
                {({loading, error, data}) => {
                    if (loading) return <div>Fetching</div>
                    if (error) return <div>Error</div>
                    return (
                        <div>
                            {data!.articles.map(article => <ArticleCard article={article}/>)}
                        </div>
                    )
                }}
            </ArticleListQuery>
        )
    }

}