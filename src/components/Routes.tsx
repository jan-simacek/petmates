import React, { Component, ReactNode } from "react";
import { NewArticleForm, ArticleDetail, ArticleList } from ".";
import { Switch, Route } from "react-router";

export enum RoutesEnum {
    NEW_ARTICLE = "/new-article",
    ARTICLE_LIST = "/article-list/:sex?/:breedId?",
    ARTICLE_DETAIL = "/article/:articleId"
}

export class Routes extends React.Component {
    public render(): ReactNode {
        return (
            <Switch>
                <Route exact path={RoutesEnum.NEW_ARTICLE} component={NewArticleForm} />
                <Route exact path={RoutesEnum.ARTICLE_LIST} component={ArticleList} />
                <Route path={RoutesEnum.ARTICLE_DETAIL} component={ArticleDetail} />
            </Switch>
        )
    }

    public static getArticleListRoute(sex?: string, breedId?: string): string {
        return RoutesEnum.ARTICLE_LIST.replace(":sex?", sex || "").replace(":breedId?", breedId || "")
    }
}