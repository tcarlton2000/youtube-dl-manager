import React from 'react';
import { storiesOf } from '@storybook/react';
import { SettingsModel } from './SettingsPage';

const settings = {
  downloadDirectory: '/downloads/directory',
};

storiesOf('SettingsPage', module).add('display settings', () => (
  <SettingsModel settings={settings} />
));
