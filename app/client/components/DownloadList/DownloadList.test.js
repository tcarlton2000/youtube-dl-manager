import '@testing-library/jest-dom/extend-expect';

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import 'isomorphic-fetch';
import DownloadList from '../DownloadList';
import {
  downloadListMock,
  paginatedDownloadListMock,
  filteredDownloadListMock,
  downloadListError,
  sleep,
} from 'Utils/mocks';

afterEach(() => {
  jest.clearAllMocks();
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

test('should fetch and render download list', async () => {
  // GIVEN
  downloadListMock();

  // WHEN
  const { findByText } = render(<DownloadList />);

  // THEN
  const firstDownloadText = await findByText('Download One');
  expect(firstDownloadText).toBeInTheDocument();

  const secondDownloadText = await findByText('Download Two');
  expect(secondDownloadText).toBeInTheDocument();

  const firstDownloadPercent = await findByText('50%');
  expect(firstDownloadPercent).toBeInTheDocument();

  const firstDownloadStats = await findByText(
    'Size: 30.6MiB, Speed: 100KiB/s, ETA: 00:38',
  );
  expect(firstDownloadStats).toBeInTheDocument();

  const secondDownloadStats = await findByText(
    'Size: 52.8MiB, Speed: 0KiB/s, ETA: 00:00',
  );
  expect(secondDownloadStats).toBeInTheDocument();
});

test('should load specific page when pagination link clicked on', async () => {
  // GIVEN
  paginatedDownloadListMock();

  // WHEN
  const { findByText } = render(<DownloadList />);

  // THEN
  const firstPageDownloadText = await findByText('Download One');
  expect(firstPageDownloadText).toBeInTheDocument();

  // WHEN
  const pageTwoButton = await findByText('2');
  fireEvent.click(pageTwoButton);

  // THEN
  const secondPageDownloadText = await findByText('Download Three');
  expect(secondPageDownloadText).toBeInTheDocument();
});

test('should load specific status when status filter clicked on', async () => {
  // GIVEN
  filteredDownloadListMock();

  // WHEN
  const { findByText } = render(<DownloadList />);

  // THEN
  const firstPageInProgressDownloadNameText = await findByText('Download One');
  expect(firstPageInProgressDownloadNameText).toBeInTheDocument();

  // WHEN
  const completedButton = await findByText('Completed');
  fireEvent.click(completedButton);

  // THEN
  const firstPageCompletedDownloadNameText = await findByText('Download Three');
  expect(firstPageCompletedDownloadNameText).toBeInTheDocument();

  // WHEN
  const secondPageButton = await findByText('2');
  fireEvent.click(secondPageButton);

  // THEN
  const secondPageCompletedDownloadNameText = await findByText('Download Four');
  expect(secondPageCompletedDownloadNameText).toBeInTheDocument();

  // WHEN
  const inProgressButton = await findByText('In Progress');
  fireEvent.click(inProgressButton);

  // THEN
  const secondPageInProgressDownloadNameText = await findByText('Download One');
  expect(secondPageInProgressDownloadNameText).toBeInTheDocument();
});

test('should maintain download list if non 2xx returned', async () => {
  // GIVEN
  downloadListMock();

  // WHEN
  const { findByText } = render(<DownloadList />);

  // THEN
  const firstDownloadText = await findByText('Download One');
  expect(firstDownloadText).toBeInTheDocument();

  // GIVEN
  downloadListError();

  // WHEN
  await sleep(1000);

  // THEN
  const secondDownloadText = await findByText('Download Two');
  expect(secondDownloadText).toBeInTheDocument();
});

test('should change to loader on status change', async () => {
  // GIVEN
  filteredDownloadListMock();

  // WHEN
  const { findByText, findByTestId } = render(<DownloadList />);

  // THEN
  const firstDownloadText = await findByText('Download One');
  expect(firstDownloadText).toBeInTheDocument();

  // GIVEN
  downloadListError();

  // WHEN
  const completedButton = await findByText('Completed');
  fireEvent.click(completedButton);

  // THEN
  const spinner = await findByTestId('spinner');
  expect(spinner).toBeInTheDocument();

  // GIVEN
  filteredDownloadListMock();

  // THEN
  const firstPageCompletedDownloadNameText = await findByText('Download Three');
  expect(firstPageCompletedDownloadNameText).toBeInTheDocument();
});

test('should change to loader on page change', async () => {
  // GIVEN
  paginatedDownloadListMock();

  // WHEN
  const { findByText, findByTestId } = render(<DownloadList />);

  // THEN
  const firstDownloadText = await findByText('Download One');
  expect(firstDownloadText).toBeInTheDocument();

  // GIVEN
  downloadListError();

  // WHEN
  const pageTwoButton = await findByText('2');
  fireEvent.click(pageTwoButton);

  // THEN
  const spinner = await findByTestId('spinner');
  expect(spinner).toBeInTheDocument();

  // GIVEN
  paginatedDownloadListMock();

  // THEN
  const secondPageDownloadText = await findByText('Download Three');
  expect(secondPageDownloadText).toBeInTheDocument();
});
