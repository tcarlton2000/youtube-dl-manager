import '@testing-library/jest-dom/extend-expect';

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import 'isomorphic-fetch';
import DownloadModal from '../DownloadModal';

test('should open DownloadModal on button click', () => {
  // WHEN
  const { getByText } = render(<DownloadModal />);
  fireEvent.click(getByText('New Download...'));

  // THEN
  expect(getByText('URL')).toBeInTheDocument();
  expect(getByText('Directory')).toBeInTheDocument();
});

test('should POST and close modal on Download click', () => {
  // GIVEN
  jest.spyOn(global, 'fetch').mockImplementation(() => {
    return Promise.resolve({});
  });

  // THEN
  const { getByText, queryByText } = render(<DownloadModal />);
  fireEvent.click(getByText('New Download...'));
  fireEvent.click(getByText('Download'));

  // THEN
  expect(queryByText('URL')).not.toBeInTheDocument();
  expect(queryByText('Directory')).not.toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(1);
});

test('should close on Cancel click', () => {
  // WHEN
  const { getByText, queryByText } = render(<DownloadModal />);
  fireEvent.click(getByText('New Download...'));
  fireEvent.click(getByText('Cancel'));

  // THEN
  expect(queryByText('URL')).not.toBeInTheDocument();
  expect(queryByText('Directory')).not.toBeInTheDocument();
});

test('should fill in directory when clicked on tree', async () => {
  // GIVEN
  jest.spyOn(global, 'fetch').mockImplementation(url => {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          directories: ['dirOne', 'dirTwo'],
        }),
    });
  });

  // WHEN
  const { getByText, getByTitle, findByTitle } = render(<DownloadModal />);
  fireEvent.click(getByText('New Download...'));
  fireEvent.click(getByTitle('downloads'));

  // THEN
  const dirOne = await findByTitle('dirOne');
  expect(dirOne).toBeInTheDocument();
  fireEvent.click(dirOne);

  // GIVEN
  jest.spyOn(global, 'fetch').mockImplementation((url, payload) => {
    expect(payload.body).toBe('{"url":"","directory":"/downloads/dirOne"}');
  });

  // WHEN
  const downloadButton = await getByText('Download');
  fireEvent.click(downloadButton);
});
