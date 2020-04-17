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
  const firstPageInProgressDownloadText = await findByText('IN PROGRESS');
  expect(firstPageInProgressDownloadText).toBeInTheDocument();
  const firstPageInProgressDownloadNameText = await findByText('Download One');
  expect(firstPageInProgressDownloadNameText).toBeInTheDocument();

  // WHEN
  const completedButton = await findByText('Completed Error');
  fireEvent.click(completedButton);

  // THEN
  const firstPageCompletedDownloadText = await findByText('COMPLETED');
  expect(firstPageCompletedDownloadText).toBeInTheDocument();
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
  const secondPageInProgressDownloadText = await findByText('IN PROGRESS');
  expect(secondPageInProgressDownloadText).toBeInTheDocument();
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
  const { findByText } = render(<DownloadList />);

  // THEN
  const firstDownloadText = await findByText('Download One');
  expect(firstDownloadText).toBeInTheDocument();

  // GIVEN
  downloadListError();

  // WHEN
  const completedButton = await findByText('Completed Error');
  fireEvent.click(completedButton);

  // THEN
  const loaderText = await findByText('Loading');
  expect(loaderText).toBeInTheDocument();

  // GIVEN
  filteredDownloadListMock();

  // THEN
  const firstPageCompletedDownloadText = await findByText('COMPLETED');
  expect(firstPageCompletedDownloadText).toBeInTheDocument();
  const firstPageCompletedDownloadNameText = await findByText('Download Three');
  expect(firstPageCompletedDownloadNameText).toBeInTheDocument();
});

test('should change to loader on page change', async () => {
  // GIVEN
  paginatedDownloadListMock();

  // WHEN
  const { findByText } = render(<DownloadList />);

  // THEN
  const firstDownloadText = await findByText('Download One');
  expect(firstDownloadText).toBeInTheDocument();

  // GIVEN
  downloadListError();

  // WHEN
  const pageTwoButton = await findByText('2');
  fireEvent.click(pageTwoButton);

  // THEN
  const loaderText = await findByText('Loading');
  expect(loaderText).toBeInTheDocument();

  // GIVEN
  paginatedDownloadListMock();

  // THEN
  const secondPageDownloadText = await findByText('Download Three');
  expect(secondPageDownloadText).toBeInTheDocument();
});
