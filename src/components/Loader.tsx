import React, { Component, ReactNode } from "react";
import { CircularProgress } from "@material-ui/core";
import './Loader.css'

interface LoaderProps {
    isSpan?: boolean
}

export class Loader extends Component<LoaderProps> {
    public render(): ReactNode {
        return (
            this.props.isSpan ? 
                <span key='loader' className='loader-wrapper'><CircularProgress className='loader' /></span> :
                <div key='loader' className='loader-wrapper'><CircularProgress className='loader' /></div>
        )
    }
}