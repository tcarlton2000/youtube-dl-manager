// React Imports
import React from 'react';
import PropTypes from 'prop-types';

// Antd Imports
import { List, Progress } from 'antd';

export const Download = ({ download }) => {
  return (
    <List.Item>
      <List.Item.Meta
        avatar={
          <DetailedProgress
            percent={download.percent}
            status={download.status}
          />
        }
        title={download.name}
        description={<Description download={download} />}
      />
    </List.Item>
  );
};

Download.propTypes = {
  download: PropTypes.object,
};

const DetailedProgress = ({ percent, status }) => {
  if (status === 'Error') {
    return (
      <Progress
        type="circle"
        percent={Math.floor(percent)}
        width={50}
        status="exception"
        data-testid="error"
      />
    );
  } else {
    return (
      <Progress
        type="circle"
        percent={Math.floor(percent)}
        width={50}
        data-testid="no-error"
      />
    );
  }
};

DetailedProgress.propTypes = {
  percent: PropTypes.number,
  status: PropTypes.string,
};

const Description = ({ download }) => {
  if (
    download.status === 'In Progress' &&
    download.size &&
    download.speed &&
    download.timeRemaining
  ) {
    return (
      <span>
        Size: {download.size}, Speed: {download.speed}, ETA:{' '}
        {download.timeRemaining}
      </span>
    );
  } else {
    return '';
  }
};

Description.propTypes = {
  download: PropTypes.object,
};
