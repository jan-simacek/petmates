import React, { ReactNode } from "react";
import { Fade } from "@material-ui/core";

export const FADEIN_SPEED = 1500

export class MbFadeIn extends React.Component {
    public render(): ReactNode {
        return (<Fade in={true} timeout={FADEIN_SPEED}>
            {this.props.children}
        </Fade>)
    }
}
