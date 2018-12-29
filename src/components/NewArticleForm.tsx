import React, { Component } from 'react'
import {Field, Form, Formik} from "formik";
import {Breed, BreedsResponse} from "../model";
import {Query} from "react-apollo";
import gql from "graphql-tag";
import {ArticleService} from "../services/ArticleService";
import {Select, TextField, RadioGroup} from "formik-material-ui";
import {Grid, Typography, FormControl, InputLabel, FormControlLabel, Radio, MenuItem, Button} from '@material-ui/core';
import './NewArticleForm.css'

export interface NewArticleFormState {
    breedId: number
    petName: string
    petAge: number
    isMale: boolean
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
    return value != null && value != "" ? undefined : "Toto pole je povinné"
}

interface MyFieldProps {
    type?: string
    name: string
    component: React.ComponentType<any>
    label: string
}
const MyField = (props: MyFieldProps) => {
    return <Field
        type={props.type}
        name={props.name}
        component={props.component}
        label={props.label}
        style={{width: '100%'}}
        validate={(value: any) => validateValue(value) }
    />
}

export class NewArticleForm extends Component<NewArticleFormProps, NewArticleFormState> {
    constructor(props: any) {
        super(props)
        this.state = {breedId: 0, petName: "", petAge: 0, isMale: true}
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
                                {({isSubmitting}) => {
                                    return (
                                    <Form className="new-article-form">
                                        <Grid container spacing={24} style={{padding: 24}} direction="column">
                                            <Grid item lg>
                                                <MyField type="input" name="petName" component={TextField} label="Jméno mazlíčka" />
                                            </Grid>
                                            <Grid item lg>
                                                <FormControl style={{width: '100%'}}>
                                                    <InputLabel htmlFor="breedId">Plemeno</InputLabel>
                                                    <Field component={Select} name="breedId" label="Plemeno">
                                                        {data!!.breeds.sort((a,b) => a.breedName.localeCompare(b.breedName))
                                                            .map(breed => <MenuItem value={breed.breedId} key={breed.breedId}
                                                                                                >{breed.breedName}</MenuItem>)}
                                                    </Field>
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