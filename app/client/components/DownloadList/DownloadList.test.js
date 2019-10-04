import '@testing-library/jest-dom/extend-expect';

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import 'isomorphic-fetch';
import DownloadList from '../DownloadList';

test('should fetch and render download list', async () => {
  const fakeDownloadList = {
    downloads: [
      {
        id: 0,
        name: 'Download One',
        status: 'In Progress',
        percent: 50.0,
        size: '30.6MiB',
        speed: '100KiB/s',
        timeRemaining: '00:38',
      },
      {
        id: 1,
        name: 'Download Two',
        status: 'In Progress',
        percent: 100.0,
        size: '52.8MiB',
        speed: '0KiB/s',
        timeRemaining: '00:00',
      },
    ],
    totalPages: 1,
  };

  jest.spyOn(global, 'fetch').mockImplementation(() => {
    return Promise.resolve({
      json: () => Promise.resolve(fakeDownloadList),
    });
  });

  const { findByText } = render(<DownloadList />);

  const firstDownloadText = await findByText('Download One');
  expect(firstDownloadText).toBeInTheDocument();

  const secondDownloadText = await findByText('Download Two');
  expect(secondDownloadText).toBeInTheDocument();

  const firstDownloadPercent = await findByText('50%');
  expect(firstDownloadPercent).toBeInTheDocument();

  const secondDownloadPercent = await findByText('100%');
  expect(secondDownloadPercent).toBeInTheDocument();

  const firstDownloadSize = await findByText('30.6MiB');
  expect(firstDownloadSize).toBeInTheDocument();

  const secondDownloadSize = await findByText('52.8MiB');
  expect(secondDownloadSize).toBeInTheDocument();

  const firstDownloadSpeed = await findByText('100KiB/s');
  expect(firstDownloadSpeed).toBeInTheDocument();

  const secondDownloadSpeed = await findByText('0KiB/s');
  expect(secondDownloadSpeed).toBeInTheDocument();

  const firstDownloadTimeRemaining = await findByText('00:38');
  expect(firstDownloadTimeRemaining).toBeInTheDocument();

  const secondDownloadTimeRemaining = await findByText('00:00');
  expect(secondDownloadTimeRemaining).toBeInTheDocument();
});

test('should load specific page when pagination link clicked on', async () => {
  const pageOneFakeDownloadList = {
    downloads: [
      {
        id: 0,
        name: 'Download One',
        status: 'In Progress',
        percent: 50.0,
        size: '30.6MiB',
        speed: '100KiB/s',
        timeRemaining: '00:38',
      },
      {
        id: 1,
        name: 'Download Two',
        status: 'In Progress',
        percent: 100.0,
        size: '52.8MiB',
        speed: '0KiB/s',
        timeRemaining: '00:00',
      },
    ],
    totalPages: 2,
  };
  const pageTwoFakeDownloadList = {
    downloads: [
      {
        id: 2,
        name: 'Download Three',
        status: 'In Progress',
        percent: 50.0,
        size: '30.6MiB',
        speed: '100KiB/s',
        timeRemaining: '00:38',
      },
      {
        id: 3,
        name: 'Download Four',
        status: 'In Progress',
        percent: 100.0,
        size: '52.8MiB',
        speed: '0KiB/s',
        timeRemaining: '00:00',
      },
    ],
    totalPages: 2,
  };

  jest.spyOn(global, 'fetch').mockImplementation(url => {
    if (url.includes('2')) {
      return Promise.resolve({
        json: () => Promise.resolve(pageTwoFakeDownloadList),
      });
    }

    return Promise.resolve({
      json: () => Promise.resolve(pageOneFakeDownloadList),
    });
  });

  const { findByText } = render(<DownloadList />);

  const firstPageDownloadText = await findByText('Download One');
  expect(firstPageDownloadText).toBeInTheDocument();

  const pageTwoButton = await findByText('2');
  fireEvent.click(pageTwoButton);

  const secondPageDownloadText = await findByText('Download Three');
  expect(secondPageDownloadText).toBeInTheDocument();
});

test('should load specific status when status filter clicked on', async () => {
  const pageOneInProgressDownloadList = {
    downloads: [
      {
        id: 1,
        name: 'Download One',
        status: 'In Progress',
        percent: 50.0,
        size: '30.6MiB',
        speed: '100KiB/s',
        timeRemaining: '00:38',
      },
    ],
    totalPages: 2,
  };
  const pageOneCompletedDownloadList = {
    downloads: [
      {
        id: 3,
        name: 'Download Three',
        status: 'Completed',
        percent: 100.0,
        size: '30.6MiB',
        speed: '100KiB/s',
        timeRemaining: '00:38',
      },
    ],
    totalPages: 2,
  };
  const pageTwoInProgressDownloadList = {
    downloads: [
      {
        id: 2,
        name: 'Download Two',
        status: 'In Progress',
        percent: 50.0,
        size: '30.6MiB',
        speed: '100KiB/s',
        timeRemaining: '00:38',
      },
    ],
    totalPages: 2,
  };
  const pageTwoCompletedDownloadList = {
    downloads: [
      {
        id: 4,
        name: 'Download Four',
        status: 'Completed',
        percent: 100.0,
        size: '30.6MiB',
        speed: '100KiB/s',
        timeRemaining: '00:38',
      },
    ],
    totalPages: 2,
  };

  jest.spyOn(global, 'fetch').mockImplementation(url => {
    if (url.includes('Completed,Error') && url.includes('1')) {
      return Promise.resolve({
        json: () => Promise.resolve(pageOneCompletedDownloadList),
      });
    } else if (url.includes('Completed,Error') && url.includes('2')) {
      return Promise.resolve({
        json: () => Promise.resolve(pageTwoCompletedDownloadList),
      });
    } else if (url.includes('In Progress') && url.includes('2')) {
      return Promise.resolve({
        json: () => Promise.resolve(pageTwoInProgressDownloadList),
      });
    }

    return Promise.resolve({
      json: () => Promise.resolve(pageOneInProgressDownloadList),
    });
  });

  const { findByText } = render(<DownloadList />);

  const firstPageInProgressDownloadText = await findByText('IN PROGRESS');
  expect(firstPageInProgressDownloadText).toBeInTheDocument();
  const firstPageInProgressDownloadNameText = await findByText('Download One');
  expect(firstPageInProgressDownloadNameText).toBeInTheDocument();

  const completedButton = await findByText('Completed Error');
  fireEvent.click(completedButton);

  const firstPageCompletedDownloadText = await findByText('COMPLETED');
  expect(firstPageCompletedDownloadText).toBeInTheDocument();
  const firstPageCompletedDownloadNameText = await findByText('Download Three');
  expect(firstPageCompletedDownloadNameText).toBeInTheDocument();

  const secondPageButton = await findByText('2');
  fireEvent.click(secondPageButton);

  const secondPageCompletedDownloadNameText = await findByText('Download Four');
  expect(secondPageCompletedDownloadNameText).toBeInTheDocument();

  const inProgressButton = await findByText('In Progress');
  fireEvent.click(inProgressButton);

  const secondPageInProgressDownloadText = await findByText('IN PROGRESS');
  expect(secondPageInProgressDownloadText).toBeInTheDocument();
  const secondPageInProgressDownloadNameText = await findByText('Download One');
  expect(secondPageInProgressDownloadNameText).toBeInTheDocument();
});
