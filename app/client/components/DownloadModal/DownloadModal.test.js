import '@testing-library/jest-dom/extend-expect';

import React from 'react';
import { fireEvent } from '@testing-library/react';
import { renderWithSettings } from 'Utils/mocks';
import DownloadModal from '../DownloadModal';

afterEach(() => {
  jest.clearAllMocks();
});

test('should open DownloadModal on button click', () => {
  // WHEN
  const { getByText } = renderWithSettings(<DownloadModal />);
  fireEvent.click(getByText('New Download...'));

  // THEN
  expect(getByText('URL:')).toBeInTheDocument();
  expect(getByText('Directory')).toBeInTheDocument();
});

test('should POST and close modal on Download click', () => {
  // GIVEN
  global.fetch = jest.fn(() => {
    return Promise.resolve({});
  });

  // THEN
  const { getByText } = renderWithSettings(<DownloadModal />);
  fireEvent.click(getByText('New Download...'));
  fireEvent.click(getByText('OK'));

  // THEN
  expect(global.fetch).toHaveBeenCalledTimes(1);
});

test('should close on Cancel click', () => {
  // GIVEN
  global.fetch = jest.fn(() => {
    return Promise.resolve({});
  });

  // WHEN
  const { getByText } = renderWithSettings(<DownloadModal />);
  fireEvent.click(getByText('New Download...'));
  fireEvent.click(getByText('Cancel'));

  // THEN
  expect(global.fetch).toHaveBeenCalledTimes(0);
});

test('should send correct payload for youtube downloader', () => {
  downloaderTest('Youtube', 'youtube');
});

test('should send correct payload for gallery downloader', () => {
  downloaderTest('Gallery', 'gallery');
});

test('should send correct payload for sw downloader', () => {
  downloaderTest('SW', 'sw');
});

test('should fill in directory when clicked on tree', async () => {
  // GIVEN
  global.fetch = jest.fn(url => {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          directories: ['dirOne', 'dirTwo'],
        }),
    });
  });

  // WHEN
  const { getByText, getByTitle, findByTitle } = renderWithSettings(
    <DownloadModal />,
  );
  fireEvent.click(getByText('New Download...'));
  fireEvent.click(getByTitle('downloads'));

  // THEN
  const dirOne = await findByTitle('dirOne');
  expect(dirOne).toBeInTheDocument();
  fireEvent.click(dirOne);

  // GIVEN
  global.fetch = jest.fn((url, payload) => {
    expect(payload.body).toBe(
      '{"url":"","directory":"/downloads/dirOne","downloader":"auto"}',
    );
  });

  // WHEN
  const downloadButton = await getByText('OK');
  fireEvent.click(downloadButton);
});

const downloaderTest = (downloader, expectedPayload) => {
  // WHEN
  const { getByText } = renderWithSettings(<DownloadModal />);
  fireEvent.click(getByText('New Download...'));
  fireEvent.mouseDown(getByText('Auto'));
  fireEvent.click(getByText(downloader));

  // THEN
  global.fetch = jest.fn((url, payload) => {
    expect(payload.body).toBe(
      `{"url":"","directory":"/downloads","downloader":"${expectedPayload}"}`,
    );
  });

  const downloadButton = getByText('OK');
  fireEvent.click(downloadButton);
};
