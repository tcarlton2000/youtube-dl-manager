import '@testing-library/jest-dom/extend-expect';

import React from 'react';
import { render } from '@testing-library/react';
import Download from '../Download';

test('should render download name, percent, and statistics for In Progress', () => {
  // WHEN
  const { getByText, getByTestId } = render(
    <Download
      download={{
        name: 'Download Name',
        status: 'In Progress',
        percent: 50.8,
        size: '23MiB',
        speed: '1.23MiB/s',
        timeRemaining: '01:34',
      }}
    />,
  );

  // THEN
  expect(getByText('Download Name')).toBeInTheDocument();
  expect(getByText('50%')).toBeInTheDocument();
  expect(
    getByText('Size: 23MiB, Speed: 1.23MiB/s, ETA: 01:34'),
  ).toBeInTheDocument();
  expect(getByTestId('no-error')).toBeInTheDocument();
});

test('should render download name only for Completed', () => {
  // WHEN
  const { getByText, queryByText, getByTestId } = render(
    <Download
      download={{
        name: 'Download Name',
        status: 'Completed',
        percent: 100.0,
        size: '23MiB',
        speed: '1.23MiB/s',
        timeRemaining: '01:34',
      }}
    />,
  );

  // THEN
  expect(getByText('Download Name')).toBeInTheDocument();
  expect(queryByText('100%')).not.toBeInTheDocument();
  expect(
    queryByText('Size: 23MiB, Speed: 1.23MiB/s, ETA: 01:34'),
  ).not.toBeInTheDocument();
  expect(getByTestId('no-error')).toBeInTheDocument();
});

test('should render download name only for Error', () => {
  // WHEN
  const { getByText, queryByText, getByTestId } = render(
    <Download
      download={{
        name: 'Download Name',
        status: 'Error',
        percent: 50.0,
        size: '23MiB',
        speed: '1.23MiB/s',
        timeRemaining: '01:34',
      }}
    />,
  );

  // THEN
  expect(getByText('Download Name')).toBeInTheDocument();
  expect(queryByText('50%')).not.toBeInTheDocument();
  expect(
    queryByText('Size: 23MiB, Speed: 1.23MiB/s, ETA: 01:34'),
  ).not.toBeInTheDocument();
  expect(getByTestId('error')).toBeInTheDocument();
});

test('should not show description if all fields not present', () => {
  // WHEN
  const { getByText, queryByText, getByTestId } = render(
    <Download
      download={{
        name: 'Download Name',
        status: 'In Progress',
        percent: 0.0,
        size: null,
        speed: null,
        timeRemaining: null,
      }}
    />,
  );

  // THEN
  expect(getByText('Download Name')).toBeInTheDocument();
  expect(queryByText('Size: , Speed: , ETA: ')).not.toBeInTheDocument();
  expect(getByTestId('no-error')).toBeInTheDocument();
});
