import React from 'react';
import T from 'prop-types'
import { Segment, Progress, Grid } from 'semantic-ui-react'


export const Download = ({ name, status, percent, size, speed, time_remaining }) => {
    return (
        <Segment>
            <Grid className="compact">
                <Grid.Row columns={1}>
                    <Grid.Column>
                        <h4>{name}</h4>
                        <p></p>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row column={1}>
                    <Grid.Column>
                        <Progress percent={percent} indicating progress autoSuccess margin="0px" />
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
