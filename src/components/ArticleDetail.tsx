import './ArticleDetail.css'
import React, { Component, ReactNode } from "react";
import { match } from "react-router";
import { Query } from 'react-apollo';
import { Article } from '../model';
import { articleService } from '../index'
import { firestoreService } from '../services';
import { Typography, Grid, CircularProgress } from '@material-ui/core';
import { Loader } from './Loader';

interface ArticleDetailsRouteParams {
    articleId: string
}

interface ArticleDetailProps {
    match: match<ArticleDetailsRouteParams>
}

interface ArticleDetailState {
    articleLoaded: boolean
    article: Article
    articleImgUrl?: string
}

export class ArticleDetail extends Component<ArticleDetailProps, ArticleDetailState> {
    constructor(props: ArticleDetailProps) {
        super(props)
        this.state = {article: {
            _id: "",
            articleText: "",
            breedId: 0,
            breedName: "",
            createDate: new Date(),
            imageId: "",
            isMale: true,
            regionId: 0,
            regionName: "",
            petAge: 0,
            petName: "",
            userId: "",
            userName: "",
            userPhotoUrl: ""
        }, articleLoaded: false}
        articleService.loadArticleById(this.props.match.params.articleId)
            .then(article => {
                this.setState({article: article, articleLoaded: true})
                return firestoreService.getImageDownloadUrl(article.imageId)
            }).then(url => this.setState({articleImgUrl: url}))
            
    }

    render(): ReactNode {
        if(this.state.articleLoaded) {
            return (
                <div className="article-detail-container">
                    
                    <Grid container direction="row" spacing={40}>
                        <Grid item sm={12} md={6}>
                            <img className="article-detail-image" src={this.state.articleImgUrl} />
                        </Grid>
                        <Grid item sm={12} md={6}>
                            <Grid direction="column" container>
                                <div className="pet-name" style={{backgroundColor: this.state.article.isMale ? "#d3e7ff" : "#fddcf6"}}>
                                    <Typography variant="h2">{this.state.article.petName}</Typography>
                                </div>
                                <Grid item className="structured-info-block">
                                    <Typography variant="h4">{this.state.article.breedName}</Typography>
                                </Grid>
                                <Grid item className="structured-info-block">
                                    <Typography variant="h6">
                                        {this.state.article.isMale ? "Kocour" : "Kočka"}&nbsp;&middot;&nbsp;
                                        {this.state.article.petAge} let
                                    </Typography>
                                </Grid>
                                <Grid item className="structured-info-block">
                                    <Typography variant="h6" style={{display: 'inline-block'}}>
                                        Vytvořeno: {new Intl.DateTimeFormat('cs-CZ').format(new Date(this.state.article.createDate))}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container direction="column" spacing={24}>
                        <Grid item>
                            {this.state.article.articleText}
                        </Grid>
                    </Grid>
                </div>
            )
        } else {
            return <Loader />
        }
    }
}