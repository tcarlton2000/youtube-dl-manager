import '@testing-library/jest-dom/extend-expect';

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import 'isomorphic-fetch';
import { Settings } from './SettingsPage';
import { defaultDownloadSettings } from 'Utils/mocks';

afterEach(() => {
  jest.clearAllMocks();
});

test('should load settings from API and display', async () => {
  // GIVEN
  defaultDownloadSettings();

  // WHEN
  const { findByDisplayValue, queryByText } = render(<Settings />);

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
  const { findByLabelText, findByText } = render(<Settings />);
  const input = await findByLabelText('downloadDirectory');
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
  fireEvent.click(save);
  expect(global.fetch).toHaveBeenCalledTimes(2);

  const saved = await findByText('Changes Saved');
  expect(saved).toBeInTheDocument();
});

test('should display error message on API failure', async () => {
  // GIVEN
  defaultDownloadSettings();

  // WHEN
  const { queryByText, findByText } = render(<Settings />);

  // THEN
  jest.spyOn(global, 'fetch').mockImplementation(() => {
    return Promise.resolve({
      ok: false,
    });
  });

  const save = await findByText('Save Changes');
  fireEvent.click(save);
  expect(global.fetch).toHaveBeenCalledTimes(2);

  const saved = await queryByText('Changes Saved');
  expect(saved).not.toBeInTheDocument();

  const error = await findByText('Error saving settings');
  expect(error).toBeInTheDocument();
});