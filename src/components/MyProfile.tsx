import './MyProfile.css'
import React, { ReactNode } from "react";
import { Typography } from '@material-ui/core';

export class MyProfile extends React.Component {
    render(): ReactNode {
        return (
            <div className="content">
                <div className="heading">
                    <Typography variant="h2">Můj profil</Typography>
                </div>
            </div>
        )
    }
}