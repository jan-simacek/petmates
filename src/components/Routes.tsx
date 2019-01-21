import React, { Component, ReactNode } from "react";
import { NewArticleForm, ArticleDetail, ArticleList, MyProfile } from ".";
import { Switch, Route } from "react-router";

export enum RoutesEnum {
    NEW_ARTICLE = "/new-article",
    ARTICLE_LIST = "/article-list/:sex?/:breedId?/:regionId?",
    ARTICLE_DETAIL = "/article/:articleId",
    MY_PROFILE = "/my-profile"
}

export class Routes extends React.Component {
    public render(): ReactNode {
        return (
            <Switch>
                <Route exact path={RoutesEnum.NEW_ARTICLE} component={NewArticleForm} />
                <Route exact path={RoutesEnum.ARTICLE_LIST} component={ArticleList} />
                <Route path={RoutesEnum.ARTICLE_DETAIL} component={ArticleDetail} />
                <Route path={RoutesEnum.MY_PROFILE} component={MyProfile} />
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