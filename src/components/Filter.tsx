import './Filter.css'
import React, { ReactNode, Fragment } from "react";
import { Grid, FormControl, InputLabel, Select, MenuItem, Button, Collapse, Typography } from "@material-ui/core";
import { Loader } from ".";
import { ArrowDropUp, ArrowDropDown } from '@material-ui/icons';
import { BreedQuery, BREED_QUERY, RegionsQuery, REGIONS_QUERY } from './queries';

export interface FilterState {
    breedId: number
    regionId: number
}

interface FilterComponentState {
    filter: FilterState
    collapsed: boolean
}

interface FilterProps {
    onChanged: (newFilter: FilterState) => void
    routeBreedId?: number
    routeRegionId?: number
}

export class Filter extends React.Component<FilterProps, FilterComponentState> {
    constructor(props: FilterProps) {
        super(props)
        this.state = {filter: { breedId: props.routeBreedId || 0, regionId: props.routeRegionId || 0 }, collapsed: true }
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
                            <Grid container spacing={24} justify="center">
                                <Grid item xs={11} md={5}>
                                    <BreedQuery query={BREED_QUERY}>
                                        {({loading, error, data}) => {
                                            if (loading) return <Loader />
                                            if (error) return <div>Error</div>
                                            return (
                                                <FormControl className="filter-form-control">
                                                    <InputLabel htmlFor="breedId">Plemeno</InputLabel>
                                                    <Select name="breedId" 
                                                        value={this.state.filter.breedId} 
                                                        onChange={this.onFilterPropertyChanged('breedId').bind(this)} 
                                                    >
                                                        <MenuItem value="" key={`breedId_0`}>--- Všechna plemena ---</MenuItem>
                                                        {data!.breeds.sort((a,b) => a.breedName.localeCompare(b.breedName))
                                                            .map(breed => (
                                                                    <MenuItem value={breed.breedId} key={`breedId_${breed.breedId}`}>
                                                                        {breed.breedName}
                                                                    </MenuItem>
                                                                )
                                                            )
                                                        }
                                                    </Select>
                                                </FormControl>
                                            )
                                        }}
                                    </BreedQuery>
                                </Grid>
                                <Grid item xs={11} md={5}>
                                    <RegionsQuery query={REGIONS_QUERY}>
                                        {({loading, error, data}) => {
                                            if (loading) return <Loader />
                                            if (error) return <div>Error</div>
                                            return (
                                                <FormControl className="filter-form-control">
                                                    <InputLabel htmlFor="regionId">Kraj</InputLabel>
                                                    <Select name="regionId"
                                                        value={this.state.filter.regionId}
                                                        onChange={this.onFilterPropertyChanged('regionId').bind(this)}
                                                    >
                                                        <MenuItem value="" key={`regionId_0`}>--- Všechny kraje ---</MenuItem>
                                                        {data!.regions.map(region => (
                                                            <MenuItem value={region.regionId} key={`regionId_${region.regionId}`} >
                                                                {region.regionName}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            )
                                        }}
                                    </RegionsQuery>
                                </Grid>
                            </Grid>
                        </div>
                    </Collapse>
                </div>
            )
    }

    private toggleExpnd() {
        this.setState({collapsed: !this.state.collapsed})
    }

    private numberOrZero(value: any): number {
        return value && +value || 0
    }

    private onFilterPropertyChanged(propertyName: string) {
        return (event: any) => {
            event.preventDefault()
            const value = this.numberOrZero(event.target.value)
            const newFilter:any = {...this.state.filter}
            newFilter[propertyName] = value
            this.setStateAndFireOnChange({...this.state, filter: newFilter} )
        }
    }

    private setStateAndFireOnChange(newState: any) {
        this.setState(newState, () => this.props.onChanged(this.state.filter))
    }
}