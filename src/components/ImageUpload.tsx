import {Component, Fragment} from "react";
import {Button, Grid, Typography, Icon, LinearProgress} from "@material-ui/core";
import { Clear } from '@material-ui/icons'
import React from "react";
import firebase from "firebase"
import { CurrentUser } from "../reducers";

const FirebaseFileUploader = require('react-firebase-file-uploader').default


interface ImageUploadState {
    uploadError: boolean
    fileName?: string
    uploadProgress?: number
}

interface ImageUploadProps {
    field: any
    form: any
    user: CurrentUser
}

export class ImageUpload extends Component<ImageUploadProps, ImageUploadState>{
    constructor(props: any) {
        super(props);
        this.state = {uploadError: false}
    }

    private handleClear = (event: any) => {
        event.preventDefault()
        firebase.storage().ref('user-images')
            .child(this.state.fileName!)
            .delete()
            .then(() => {
                this.setState({uploadError: false, fileName: undefined, uploadProgress: undefined})
                this.props.field.value = false
                this.props.field.onChange({target: {value: undefined, name: this.props.field.name}})
            })
            .catch((error) => alert(error))
    }

    private handleUploadSuccess(fileName: string) {
        this.setState({uploadError: false, fileName: `${this.props.user.uid}/${fileName}`})
        this.props.field.onChange({target: {value: this.state.fileName, name: this.props.field.name}})
    }

    private handleUploadError(error: any) {
        this.setState({uploadError: true})
    }

    private handleUploadProgress(progress: number) {
        this.setState({ ...this.state, uploadProgress: progress})
    }

    render(): React.ReactNode {
        if(!this.state.fileName) {
            return (
                <Fragment>
                    <label>
                        {!this.state.uploadProgress && <Button variant="contained" component="span">
                            NAHRÁT OBRÁZEK
                        </Button> }
                        <FirebaseFileUploader
                            hidden
                            accept="image/*"
                            name="imageUpload"
                            randomizeFilename
                            storageRef={firebase.storage().ref(`/user-images/${this.props.user.uid}`)}
                            onUploadError={this.handleUploadError.bind(this)}
                            onUploadSuccess={this.handleUploadSuccess.bind(this)}
                            onProgress={this.handleUploadProgress.bind(this)}
                        />
                    </label>
                    {this.state.uploadError &&
                    <Typography color="error">
                        Obrázek musí být menší než 3MB.
                    </Typography>
                    }
                    {!!this.state.uploadProgress && <LinearProgress variant="determinate" value={this.state.uploadProgress} />}
                </Fragment>
            )
        } else {
            return (
                <div>
                    <p style={{position: 'relative'}}>{"Obrázek nahrán"}
                        <a href='#' onClick={this.handleClear.bind(this)}><Clear style={{position: 'absolute', bottom: 0}}>Clear</Clear></a></p>
                </div>
            )
        }
    }
}