import React, { Component, ReactNode } from "react";
import { NewArticleForm, ArticleDetail, ArticleList, FavoriteArticles, MessagesContainer } from "./components";
import { Switch, Route } from "react-router";
import { MyProfileContainer } from "./components";

export enum RoutesEnum {
    NEW_ARTICLE = "/new-article",
    ARTICLE_LIST = "/article-list/:sex?/:breedId?/:regionId?",
    ARTICLE_DETAIL = "/article/:articleId",
    MY_PROFILE = "/my-profile",
    FAVORITES = "/favorites",
    MESSAGES = "/messages"
}

export class Routes extends React.Component {
    public render(): ReactNode {
        return (
            <Switch>
                <Route exact path={RoutesEnum.NEW_ARTICLE} component={NewArticleForm} />
                <Route exact path={RoutesEnum.ARTICLE_LIST} component={ArticleList} />
                <Route path={RoutesEnum.ARTICLE_DETAIL} component={ArticleDetail} />
                <Route path={RoutesEnum.MY_PROFILE} component={MyProfileContainer} />
                <Route path={RoutesEnum.FAVORITES} component={FavoriteArticles} />
                <Route path={RoutesEnum.MESSAGES} component={MessagesContainer} />
            </Switch>
        )
    }

    public static getArticleListRoute(sex?: string, breedId?: number, regionId?: number): string {
        return RoutesEnum.ARTICLE_LIST
            .replace(":sex?", sex || "")
            .replace(":breedId?", ("" + breedId) || "")
            .replace(":regionId?", ("" + regionId) || "")
    }
}