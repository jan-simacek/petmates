import React, { Component, ReactNode } from "react";
import { NewArticleForm, ArticleDetail, ArticleList, FavoriteArticles, MessagesContainer, Chat } from "./components";
import { Switch, Route } from "react-router";
import { MyProfileContainer } from "./components";

export enum RoutesEnum {
    NEW_ARTICLE = "/new-article",
    ARTICLE_LIST = "/article-list/:sex?/:breedId?/:regionId?",
    ARTICLE_DETAIL = "/article/:articleId",
    MY_PROFILE = "/my-profile",
    FAVORITES = "/favorites",
    MESSAGES = "/messages",
    CHAT = "/chat/:conversationId"
}

export class Routes extends React.Component {
    public render(): ReactNode {
        return (
            <Switch>
                <Route path={RoutesEnum.NEW_ARTICLE} component={NewArticleForm} />
                <Route path={RoutesEnum.ARTICLE_LIST} component={ArticleList} />
                <Route path={RoutesEnum.ARTICLE_DETAIL} component={ArticleDetail} />
                <Route path={RoutesEnum.MY_PROFILE} component={MyProfileContainer} />
                <Route path={RoutesEnum.FAVORITES} component={FavoriteArticles} />
                <Route path={RoutesEnum.MESSAGES} component={MessagesContainer} />
                <Route path={RoutesEnum.CHAT} component={Chat} />
            </Switch>
        )
    }

    public static getArticleListRoute(sex?: string, breedId?: number, regionId?: number): string {
        return RoutesEnum.ARTICLE_LIST
            .replace(":sex?", sex || "")
            .replace(":breedId?", ("" + breedId) || "")
            .replace(":regionId?", ("" + regionId) || "")
    }

    public static getChatRoute(conversationId: string) {
        return RoutesEnum.CHAT
            .replace(":conversationId", conversationId)
    }
}