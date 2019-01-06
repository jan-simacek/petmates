import './ArticleDetail.css'
import React, { Component, ReactNode } from "react";
import { match } from "react-router";
import { Query } from 'react-apollo';
import { Article } from '../model';
import { articleService } from '../index'
import { firestoreService } from '../services';

interface ArticleDetailsRouteParams {
    articleId: string
}

interface ArticleDetailProps {
    match: match<ArticleDetailsRouteParams>
}

interface ArticleDetailState {
    article?: Article
    articleImgUrl?: string
}

export class ArticleDetail extends Component<ArticleDetailProps, ArticleDetailState> {
    constructor(props: ArticleDetailProps) {
        super(props)
        this.state = {}
        articleService.loadArticleById(this.props.match.params.articleId)
            .then(article => {
                this.setState({article: article})
                return firestoreService.getImageDownloadUrl(article.imageId)
            }).then(url => this.setState({articleImgUrl: url}))
            
    }

    render(): ReactNode {
        return (
            <div className="article-detail-container">
                <div className="article-detail-photo">
                    <img style={{maxWidth: '100%'}}
                        src={this.state.articleImgUrl} />
                </div>
                <div className="article-detail-info">
                    Article Detail: {this.state.article && this.state.article.petName}
                </div>
            </div>
        )
    }
}