import './Filter.css'
import React, { ReactNode, Fragment } from "react";
import { Grid, FormControl, InputLabel, Select, MenuItem, Button, Collapse, Typography } from "@material-ui/core";
import { Loader } from ".";
import { ArrowDropUp, ArrowDropDown } from '@material-ui/icons';
import { BreedQuery, BREED_QUERY } from './queries';

export interface FilterState {
    breedId: number
}

interface FilterComponentState {
    filter: FilterState
    collapsed: boolean
}

interface FilterProps {
    onChanged: (newFilter: FilterState) => void
    routeBreedId?: number
}

export class Filter extends React.Component<FilterProps, FilterComponentState> {
    constructor(props: FilterProps) {
        super(props)
        this.state = {filter: { breedId: props.routeBreedId || 0 }, collapsed: true }
    }

    public render(): ReactNode {
            return (
                <div>
                    <div className="expand-filter-button">
                        <Button onClick={this.toggleExpnd.bind(this)} variant="contained" size="small">
                            {this.state.collapsed ? 
                                (<Fragment><Typography>Upravit filtr</Typography><ArrowDropDown /></Fragment>) : 
                                (<Fragment><Typography>Skrýt filtr</Typography><ArrowDropUp /></Fragment>)
                            }
                        </Button>
                    </div>
                    <Collapse in={!this.state.collapsed}>
                        <div className="filter-grid">
                            <BreedQuery query={BREED_QUERY}>
                                {({loading, error, data}) => {
                                    if (loading) return <Loader />
                                    if (error) return <div>Error</div>
                                    return (
                                        <Grid container spacing={24} justify="center">
                                            <Grid item xs={6}>
                                                <FormControl className="breed-form-control">
                                                    <InputLabel htmlFor="breedId">Plemeno</InputLabel>
                                                    <Select name="breedId" 
                                                        value={this.state.filter.breedId} 
                                                        onChange={this.breedSelectChanged.bind(this)} 
                                                    >
                                                        <MenuItem value="" key={0}>--- Všechna plemena ---</MenuItem>
                                                        {data!.breeds.sort((a,b) => a.breedName.localeCompare(b.breedName))
                                                            .map(breed => (
                                                                    <MenuItem value={breed.breedId} key={breed.breedId}>
                                                                        {breed.breedName}
                                                                    </MenuItem>
                                                                )
                                                            )
                                                        }
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    )
                                }}
                            </BreedQuery>
                        </div>
                    </Collapse>
                </div>
            )
    }

    private toggleExpnd() {
        this.setState({collapsed: !this.state.collapsed})
    }

    private breedSelectChanged(event: any) {
        const selectedBreedId = event.target.value
        this.setStateAndFireOnChange({ filter: { ...this.state.filter,  breedId: selectedBreedId && +selectedBreedId || undefined }})
    }

    private setStateAndFireOnChange(newState: any) {
        this.setState(newState, () => this.props.onChanged(this.state.filter))
    }
}