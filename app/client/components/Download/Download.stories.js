import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, number } from '@storybook/addon-knobs';
import Download from '../Download';

storiesOf('Download', module).add('default', () => (
  <Download
    name={text('name', 'Name')}
    status={text('status', 'Status')}
    percent={number('percent', 50.0)}
    size={text('size', '34.5MiB')}
    speed={text('speed', '2.45MiB/s')}
    time_remaining={text('time_remaining', '03:45')}
  />
));
