import React, { Component, ReactNode } from "react";
import { CircularProgress } from "@material-ui/core";
import './Loader.css'

export class Loader extends Component {
    public render(): ReactNode {
        return <div key='loader' className='loader-wrapper'><CircularProgress className='loader' /></div>
    }
}