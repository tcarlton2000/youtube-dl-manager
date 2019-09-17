import '@testing-library/jest-dom/extend-expect';

import React from 'react';
import { render } from '@testing-library/react';
import Download from '../Download';

test('should render download name, percent, and statistics for In Progress', () => {
  const { getByText } = render(
    <Download
      name={'Download Name'}
      status={'In Progress'}
      percent={50.5}
      size={'23MiB'}
      speed={'1.23MiB/s'}
      timeRemaining={'01:34'}
    />,
  );

  expect(getByText('Download Name')).toBeInTheDocument();
  expect(getByText('IN PROGRESS')).toBeInTheDocument();
  expect(getByText('50%')).toBeInTheDocument();
  expect(getByText('23MiB')).toBeInTheDocument();
  expect(getByText('1.23MiB/s')).toBeInTheDocument();
  expect(getByText('01:34')).toBeInTheDocument();
});

test('should render download name only for Completed', () => {
  const { getByText, queryByText } = render(
    <Download
      name={'Download Name'}
      status={'Completed'}
      percent={50.5}
      size={'23MiB'}
      speed={'1.23MiB/s'}
      timeRemaining={'01:34'}
    />,
  );

  expect(getByText('Download Name')).toBeInTheDocument();
  expect(getByText('COMPLETED')).toBeInTheDocument();
  expect(queryByText('50%')).not.toBeInTheDocument();
  expect(queryByText('23MiB')).not.toBeInTheDocument();
  expect(queryByText('1.23MiB/s')).not.toBeInTheDocument();
  expect(queryByText('01:34')).not.toBeInTheDocument();
});

test('should render download name only for Error', () => {
  const { getByText, queryByText } = render(
    <Download
      name={'Download Name'}
      status={'Error'}
      percent={50.5}
      size={'23MiB'}
      speed={'1.23MiB/s'}
      timeRemaining={'01:34'}
    />,
  );

  expect(getByText('Download Name')).toBeInTheDocument();
  expect(getByText('ERROR')).toBeInTheDocument();
  expect(queryByText('50%')).not.toBeInTheDocument();
  expect(queryByText('23MiB')).not.toBeInTheDocument();
  expect(queryByText('1.23MiB/s')).not.toBeInTheDocument();
  expect(queryByText('01:34')).not.toBeInTheDocument();
});
