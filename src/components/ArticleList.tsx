import React, { Component, ReactNode } from "react";
import { Query } from "react-apollo";
import { ArticleListResponse } from "../model";
import gql from "graphql-tag";
import ArticleCard from "./ArticleCard";
import { Grid } from "@material-ui/core";
import './ArticleList.css'

class ArticleListQuery extends Query<ArticleListResponse> { }

const ARTICLES_QUERY = gql`
    {
        articles {
            _id
            breedName
            breedId
            petName
            petAge
            isMale
            createDate
            imageId
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
                        <div className="article-list">
                            <Grid container spacing={24} justify="center">
                                {data!.articles.map(article => (
                                    <Grid item>
                                        <ArticleCard key={article._id} article={article}/>
                                    </Grid>
                                ))}
                            </Grid>
                        </div>
                    )
                }}
            </ArticleListQuery>
        )
    }

}