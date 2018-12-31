import React, { Component } from 'react'
import {Field, Form, Formik} from "formik";
import {Breed, BreedsResponse} from "../model";
import {Query} from "react-apollo";
import gql from "graphql-tag";
import {ArticleService} from "../services/ArticleService";
import {Select, TextField, RadioGroup} from "formik-material-ui";
import {Grid, Typography, FormControl, InputLabel, FormControlLabel, Radio, MenuItem, Button} from '@material-ui/core';
import './NewArticleForm.css'
import {ImageUpload} from "./ImageUpload"

export interface NewArticleFormState {
    breedId: number
    petName: string
    petAge: number
    isMale: string
    fileUploaded: string
}

export interface NewArticleFormProps {
    articleService: ArticleService
}

class BreedQuery extends Query<BreedsResponse> {}

const BREED_QUERY = gql`
    {
      breeds {
        breedId,
        breedName
      }
    }
`

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

export class NewArticleForm extends Component<NewArticleFormProps, NewArticleFormState> {
    constructor(props: any) {
        super(props)
        this.state = {breedId: 0, petName: "", petAge: 1, isMale: "true", fileUploaded: 'false'}
    }

    render(): React.ReactNode {
        return (
            <BreedQuery query={BREED_QUERY}>
                {({loading, error, data}) => {
                    if (loading) return <div>Fetching</div>
                    if (error) return <div>Error</div>
                    return (
                        <div className="new-article-background">
                            <div className="new-article-heading">
                                <Typography variant="h2">Nový inzerát</Typography>
                            </div>
                            <Formik
                                initialValues={this.state}
                                validate={values => {
                                    const errors = {}
                                    Object.keys(values).forEach(key => {
                                        if(key == 'fileUploaded') {
                                            // @ts-ignore
                                            errors[key] = !(values[key] && JSON.parse(values[key])) ? 'Nahrajte prosím obrázek' : undefined
                                        } else if(key == 'petAge') {
                                            const emptyValidation = validateValue(values[key])
                                            if(emptyValidation) {
                                                // @ts-ignore
                                                errors[key] = emptyValidation
                                            } else {
                                                const val = +values[key]
                                                if(isNaN(val)) {
                                                    // @ts-ignore
                                                    errors[key] = 'Věk musí být číslo'
                                                } else if(val <= 0) {
                                                    // @ts-ignore
                                                    errors[key] = 'Věk musí být kladné číslo'
                                                }
                                            }
                                        } else {
                                            // @ts-ignore
                                            errors[key] = validateValue(values[key])
                                        }
                                    })
                                    return errors;
                                }}
                                onSubmit={(values, {setSubmitting}) => {
                                    this.props.articleService.addArticle({
                                        breedId: values.breedId,
                                        isMale: JSON.parse("" + values.isMale),
                                        petAge: values.petAge,
                                        petName: values.petName
                                    })
                                    setSubmitting(false)
                                }}>
                                {({errors, isSubmitting}) => {
                                    return (
                                    <Form className="new-article-form">
                                        <Grid container spacing={24} style={{padding: 24}} direction="column">
                                            <Grid item lg>
                                                <MyField name="petName" component={TextField} label="Jméno mazlíčka" />
                                            </Grid>
                                            <Grid item lg>
                                                <FormControl style={{width: '100%'}} error={!!errors.breedId}>
                                                    <InputLabel htmlFor="breedId">Plemeno</InputLabel>
                                                    <Field component={Select} name="breedId" label="Plemeno"
                                                           validate={(value: any) => validateValue(value)}>
                                                        {data!!.breeds.sort((a,b) => a.breedName.localeCompare(b.breedName))
                                                            .map(breed => <MenuItem value={breed.breedId} key={breed.breedId}
                                                                                                >{breed.breedName}</MenuItem>)}
                                                    </Field>
                                                    {errors.breedId && <Typography style={{fontSize: '0.75rem'}} color="error">{errors.breedId}</Typography>}
                                                </FormControl>
                                            </Grid>
                                            <Grid item lg>
                                                <MyField label="Věk" type="number" name="petAge" component={TextField}/>
                                            </Grid>
                                            <Grid item direction="row" container>
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
                                                <Field name="fileUploaded" component={ImageUpload} />
                                                {errors.fileUploaded && <Typography style={{fontSize: '0.75rem'}} color="error">{errors.fileUploaded}</Typography>}
                                            </Grid>
                                            <Button variant="contained" color="primary" type="submit"
                                                    disabled={isSubmitting} style={{alignSelf: 'center'}}>Odeslat</Button>
                                        </Grid>
                                    </Form>)
                                }}
                            </Formik>
                        </div>
                    )
                }}
            </BreedQuery>)
    }
}