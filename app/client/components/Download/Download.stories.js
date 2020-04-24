import React from 'react';
import { storiesOf } from '@storybook/react';
import Download from '../Download';

storiesOf('Download', module)
  .add('In Progress', () => (
    <Download
      download={{
        name: 'In Progress Download',
        status: 'In Progress',
        percent: 50.4,
        size: '34.5MiB',
        speed: '2.45MiB/s',
        timeRemaining: '02:34',
      }}
    />
  ))
  .add('Completed', () => (
    <Download
      download={{
        name: 'Completed Download',
        status: 'Completed',
        percent: 100.0,
        size: '34.5MiB',
        speed: '2.45MiB/s',
        timeRemaining: '02:34',
      }}
    />
  ))
  .add('Error', () => (
    <Download
      download={{
        name: 'Error Download',
        status: 'Error',
        percent: 23.8,
        size: '34.5MiB',
        speed: '2.45MiB/s',
        timeRemaining: '02:34',
      }}
    />
  ));
