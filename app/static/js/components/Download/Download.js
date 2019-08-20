import React from 'react';
import ReactDOM from 'react-dom';
import T from 'prop-types'
import { Segment, Progress, Grid } from 'semantic-ui-react'


export const Download = ({ name, status, percent, size, speed, time_remaining }) => {
    return (
        <Segment>
            <Grid className="compact">
                <Grid.Row columns={2}>
                    <Grid.Column width={12}>
                        <h4>{name}</h4>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <Progress percent={percent} indicating progress autoSuccess />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={3}>
                    <Grid.Column>
                        <p>{size}</p>
                    </Grid.Column>
                    <Grid.Column align="center">
                        <p>{speed}</p>
                    </Grid.Column>
                    <Grid.Column align="right">
                        <p>{time_remaining}</p>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    )
}

Download.proptypes = {
    name: T.string,
    status: T.string,
    percent: T.float,
    size: T.string,
    speed: T.string,
    time_remaining: T.string
}
