import React, { Component } from 'react'
import {Field, Form, Formik} from "formik";
import {articleService} from "../index";
import {Select, TextField, RadioGroup} from "formik-material-ui";
import {Grid, Typography, FormControl, InputLabel, FormControlLabel, Radio, MenuItem, Button} from '@material-ui/core';
import './NewArticleForm.css'
import {fieldToTextField} from 'formik-material-ui'
import {TextField as MTextField} from '@material-ui/core'
import { userService } from '../index'
import { Loader, ImageUploadContainer } from '.';
import { BreedQuery, BREED_QUERY, RegionsQuery, REGIONS_QUERY } from './queries';
import { match } from 'react-router-dom';
import { History } from 'history'
import { RoutesEnum } from '../Routes';

interface NewArticleFormState {
    breedId: number
    petName: string
    petAge: number
    isMale: string
    fileUploaded?: string
    articleText: string
    regionId: number
}

const validateValue = (value: any) =>  {
    return value && value != "" ? undefined : "Toto pole je povinné"
}

interface MyFieldProps {
    type?: string
    name: string
    component?: React.ComponentType<any>
    label: string
}
const MyField = (props: MyFieldProps) => {
    return <Field
        type={props.type}
        name={props.name}
        component={props.component}
        label={props.label}
        style={{width: '100%'}}
    />
}

interface NewArticleFormProps {
    match: match<any>
    history: History
    location: any
}

export class NewArticleForm extends Component<NewArticleFormProps, NewArticleFormState> {
    private articleService = articleService

    constructor(props: any) {
        super(props)
        this.state = {breedId: 0, petName: "", petAge: 1, isMale: "true", regionId: 0, fileUploaded: undefined, articleText: ""}
    }

    private validate(values: any): any {
        const errors = {}
        Object.keys(values).forEach(key => {
            let valResult = undefined
            if(key == 'fileUploaded') {
                valResult = !values[key] ? 'Nahrajte prosím obrázek' : undefined
            } else if(key == 'petAge') {
                const emptyValidation = validateValue(values[key])
                if(emptyValidation) {
                    valResult = emptyValidation
                } else {
                    const val = +values[key]
                    if(isNaN(val)) {
                        valResult = 'Věk musí být číslo'
                    } else if(val <= 0) {
                        valResult = 'Věk musí být kladné číslo'
                    }
                }
            } else {
                valResult = validateValue(values[key])
            }
            if(valResult) {
                // @ts-ignore
                errors[key] = valResult
            }
        })
        return errors
    }

    render(): React.ReactNode {
        return (
            <div className="new-article-background content">
                <div className="new-article-heading heading">
                    <Typography variant="h2">Nový inzerát</Typography>
                </div>
                <Formik
                    initialValues={this.state}
                    validate={this.validate}
                    onSubmit={(values: NewArticleFormState, {setSubmitting}) => {
                        setSubmitting(true)
                        userService.getCurrentUserToken().then(token => {
                            return this.articleService.addArticle({
                                breedId: values.breedId,
                                isMale: JSON.parse("" + values.isMale),
                                petAge: values.petAge,
                                petName: values.petName,
                                imageId: values.fileUploaded!,
                                regionId: values.regionId,
                                articleText: values.articleText,
                                userToken: token
                            })
                        }).then(_ => {
                            setSubmitting(false)
                            this.props.history.push(RoutesEnum.MY_PROFILE)
                        })
                    }}>
                    {({errors, touched, isSubmitting}) => {
                        return (
                        <Form className="new-article-form">
                            <Grid container spacing={24} style={{padding: 24}} direction="column">
                                <Grid item lg>
                                    <FormControl disabled={isSubmitting} style={{width: '100%'}}>
                                        <MyField name="petName" component={TextField} label="Jméno mazlíčka" />
                                    </FormControl>
                                </Grid>
                                <Grid item lg>
                                    <BreedQuery query={BREED_QUERY}>
                                        {({loading, error, data}) => {
                                            if (loading) return <Loader />
                                            if (error) return <div>Error</div>
                                            return (
                                            <FormControl 
                                                style={{width: '100%'}} 
                                                error={!!errors.breedId && !!touched.breedId}
                                                disabled={isSubmitting}
                                            >
                                                <InputLabel htmlFor="breedId">Plemeno</InputLabel>
                                                <Field component={Select} name="breedId" label="Plemeno">
                                                    {data!.breeds.sort((a,b) => a.breedName.localeCompare(b.breedName))
                                                        .map(breed => (
                                                                <MenuItem value={breed.breedId} key={breed.breedId}>
                                                                    {breed.breedName}
                                                                </MenuItem>
                                                            )
                                                        )
                                                    }
                                                </Field>
                                                {errors.breedId && touched.breedId && <Typography style={{fontSize: '0.75rem'}} color="error">{errors.breedId}</Typography>}
                                            </FormControl>)
                                        }}
                                    </BreedQuery>
                                </Grid>
                                <Grid item lg>
                                    <RegionsQuery query={REGIONS_QUERY}>
                                        {({loading, error, data}) => {
                                            if (loading) return <Loader />
                                            if (error) return <div>Error</div>
                                            return (
                                            <FormControl 
                                                style={{width: '100%'}} 
                                                error={!!errors.regionId && !!touched.regionId}
                                                disabled={isSubmitting}
                                            >
                                                <InputLabel htmlFor="regionId">Kraj</InputLabel>
                                                <Field component={Select} name="regionId" label="Kraj">
                                                    {data!.regions.map(region => (
                                                                <MenuItem value={region.regionId} key={region.regionId}>
                                                                    {region.regionName}
                                                                </MenuItem>
                                                            )
                                                        )
                                                    }
                                                </Field>
                                                {errors.regionId && touched.regionId && <Typography style={{fontSize: '0.75rem'}} color="error">{errors.regionId}</Typography>}
                                            </FormControl>)
                                        }}
                                    </RegionsQuery>
                                </Grid>
                                <Grid item lg>
                                    <MyField label="Věk" type="number" name="petAge" component={TextField}/>
                                </Grid>
                                <Grid item>
                                    <Field name="isMale" label="Pohlaví" component={RadioGroup}>
                                        <FormControlLabel
                                            value="true"
                                            control={<Radio disabled={isSubmitting} />}
                                            label="Kocour"
                                            disabled={isSubmitting}
                                        />
                                        <FormControlLabel
                                            value="false"
                                            control={<Radio disabled={isSubmitting} />}
                                            label="Kočka"
                                            disabled={isSubmitting}
                                        />
                                    </Field>
                                </Grid>
                                <Grid item>
                                    <FormControl disabled={isSubmitting} style={{width: '100%'}}>
                                        <Field name="articleText" render={(props: any) => (
                                            <MTextField {...fieldToTextField(props)} multiline={true} rows={4}
                                                label="Text inzerátu" style={{width: '100%'}}  />
                                        )}/>
                                    </FormControl>
                                </Grid>
                                <Grid item>
                                    <FormControl disabled={isSubmitting} style={{width: '100%'}}>
                                        <Field name="fileUploaded" component={ImageUploadContainer} />
                                        {errors.fileUploaded && touched.fileUploaded&& <Typography style={{fontSize: '0.75rem'}} color="error">{errors.fileUploaded}</Typography>}
                                    </FormControl>
                                </Grid>
                                <Button variant="contained" color="secondary" type="submit"
                                        disabled={isSubmitting} style={{alignSelf: 'center'}}>Odeslat</Button>
                            </Grid>
                        </Form>)
                    }}
                </Formik>
            </div>
        )
    }
}