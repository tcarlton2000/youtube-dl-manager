import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Progress, Grid, Label } from 'semantic-ui-react';

const DOWNLOAD_IN_PROGRESS = 'In Progress';
const DOWNLOAD_COMPLETED = 'Completed';
const DOWNLOAD_ERROR = 'Error';

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
        <DownloadNameAndStatus name={name} status={status} />
        {status === DOWNLOAD_IN_PROGRESS ? (
          <DownloadStatusBar percent={percent} />
        ) : (
          ''
        )}
        {status === DOWNLOAD_IN_PROGRESS ? (
          <DownloadStatistics
            size={size}
            speed={speed}
            timeRemaining={timeRemaining}
          />
        ) : (
          ''
        )}
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

const DownloadNameAndStatus = ({ name, status }) => {
  return (
    <Grid.Row columns={1}>
      <Grid.Column>
        <table width="100%">
          <tbody>
            <tr>
              <td>
                <h4>{name}</h4>
                <p />
              </td>
              <td width="100px">
                {status === DOWNLOAD_ERROR ? (
                  <Label color="red">ERROR</Label>
                ) : (
                  ''
                )}
                {status === DOWNLOAD_IN_PROGRESS ? (
                  <Label color="yellow">IN PROGRESS</Label>
                ) : (
                  ''
                )}
                {status === DOWNLOAD_COMPLETED ? (
                  <Label color="green">COMPLETED</Label>
                ) : (
                  ''
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </Grid.Column>
    </Grid.Row>
  );
};

DownloadNameAndStatus.propTypes = {
  name: PropTypes.string,
  status: PropTypes.string,
};

const DownloadStatusBar = ({ percent }) => {
  return (
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
  );
};

DownloadStatusBar.propTypes = {
  percent: PropTypes.number,
};

const DownloadStatistics = ({ size, speed, timeRemaining }) => {
  return (
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
  );
};

DownloadStatistics.propTypes = {
  size: PropTypes.string,
  speed: PropTypes.string,
  timeRemaining: PropTypes.string,
};
