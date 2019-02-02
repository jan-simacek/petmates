import './MyProfile.css'
import React, { ReactNode } from "react";
import { Typography } from '@material-ui/core';
import { CurrentUser } from '../reducers';
import { ArticleListing } from './ArticleListing';
import { Loader } from './common/Loader';

interface MyProfileProps {
    currentUser?: CurrentUser
}

export class MyProfile extends React.Component<MyProfileProps> {
    render(): ReactNode {
        return (
            <div className="content">
                <div className="heading">
                    <Typography variant="h2">Moje inzeráty</Typography>
                    {this.props.currentUser ? 
                        <ArticleListing filterState={{userId: this.props.currentUser.uid}}/> :
                        <Loader />
                    }
                </div>
            </div>
        )
    }
}