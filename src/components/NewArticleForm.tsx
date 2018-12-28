import React, { Component } from 'react'
import {Field, Form, Formik} from "formik";
import {Breed, BreedsResponse} from "../model";
import {Query} from "react-apollo";
import gql from "graphql-tag";
import {ArticleService} from "../services/ArticleService";

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
                                return (<Form>
                                    Jméno mazlíčka:
                                    <Field type="input" name="petName"/>
                                    <br/>
                                    Plemeno:
                                    <Field component="select" name="breedId">
                                        {data!!.breeds.map(breed => <option value={breed.breedId}
                                                                                key={breed.breedId}>{breed.breedName}</option>)}
                                    </Field>
                                    <br/>
                                    Věk:
                                    <Field type="number" name="petAge"/>
                                    <br/>
                                    Pohlaví:
                                    <Field component="select" name="isMale">
                                        <option value="true">kocour</option>
                                        <option value="false">kočka</option>
                                    </Field>
                                    <br/>
                                    <button type="submit" disabled={isSubmitting}>Odeslat</button>
                                </Form>)
                            }}
                        </Formik>
                    )
                }}
            </BreedQuery>)
    }
}