import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Progress, Grid } from 'semantic-ui-react';

export const Download = ({
  name,
  status,
  percent,
  size,
  speed,
  timeRemaining,
}) => {
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
            <Progress
              percent={Math.floor(percent)}
              indicating
              progress
              autoSuccess
              margin="0px"
            />
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
            <p>{timeRemaining}</p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

Download.propTypes = {
  name: PropTypes.string,
  status: PropTypes.string,
  percent: PropTypes.number,
  size: PropTypes.string,
  speed: PropTypes.string,
  timeRemaining: PropTypes.string,
};
