import '@testing-library/jest-dom/extend-expect';

import React from 'react';
import { fireEvent } from '@testing-library/react';
import 'isomorphic-fetch';
import { renderWithSettings } from 'Utils/mocks';
import { Settings } from './SettingsPage';
import { defaultDownloadSettings } from 'Utils/mocks';

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

test('should load settings from API and display', async () => {
  // GIVEN
  defaultDownloadSettings();

  // WHEN
  const { findByDisplayValue, queryByText } = renderWithSettings(<Settings />);

  // THEN
  const field = await findByDisplayValue('/downloads');
  expect(field).toBeInTheDocument();

  const saved = await queryByText('Changes Saved');
  expect(saved).not.toBeInTheDocument();
});

test('should update and submit change', async () => {
  // GIVEN
  defaultDownloadSettings();

  // WHEN
  const { findByTestId, findByText, queryByText } = renderWithSettings(
    <Settings />,
  );
  const input = await findByTestId('downloadDirectory');
  fireEvent.change(input, {
    target: {
      value: '/changeme',
    },
  });

  // THEN
  jest.spyOn(global, 'fetch').mockImplementation((url, init) => {
    expect(init.body).toBe(
      JSON.stringify({
        settings: {
          downloadDirectory: '/changeme',
        },
      }),
    );
    return Promise.resolve({
      ok: true,
    });
  });

  const save = await findByText('Save Changes');
  fireEvent.submit(save);

  const saved = await findByText('Changes Saved');
  expect(saved).toBeInTheDocument();

  const error = await queryByText('Error saving settings');
  expect(error).not.toBeInTheDocument();
});

test('should display error message on API failure', async () => {
  // GIVEN
  defaultDownloadSettings();

  // WHEN
  const { queryByText, findByText } = renderWithSettings(<Settings />);

  // THEN
  jest.spyOn(global, 'fetch').mockImplementation(() => {
    return Promise.resolve({
      ok: false,
    });
  });

  const save = await findByText('Save Changes');
  expect(save).toBeInTheDocument();
  fireEvent.submit(save);

  const saved = await queryByText('Changes Saved');
  expect(saved).not.toBeInTheDocument();

  const error = await findByText('Error saving settings');
  expect(error).toBeInTheDocument();
});
