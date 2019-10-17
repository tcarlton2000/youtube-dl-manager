import React, { useState, useEffect } from 'react';
import { Icon, Form, Button, Loader, Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Setting from 'Components/Setting';
import getRoute from 'Utils/getRoute';

export const SettingsPage = () => {
  return (
    <div>
      <Link to="/">
        <Icon name="angle left" />
        Back to Main Page
      </Link>
      <h2>Settings</h2>
      <Settings />
    </div>
  );
};

export const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(getRoute('/api/settings'))
      .then(response => response.json())
      .then(responseJson => {
        setSettings(responseJson.settings);
      })
      .catch(error => {
        setError('Error retrieving settings');
        console.error(error);
      });
  }, []);

  const changeSettings = e => {
    const { name, value } = e.target;

    setSettings(() => ({
      [name]: value,
    }));
  };

  const submit = () => {
    fetch(getRoute('/api/settings'), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        settings: settings,
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        setSaved(true);
      })
      .catch(error => {
        setError('Error saving settings');
        console.error(error);
      });
  };

  return (
    <SettingsModel
      settings={settings}
      changeSettings={changeSettings}
      submit={submit}
      saved={saved}
      error={error}
    />
  );
};

export const SettingsModel = ({
  settings,
  changeSettings,
  submit,
  saved,
  error,
}) => {
  if (settings !== null) {
    return (
      <Form onSubmit={submit}>
        <Setting
          label="Download Directory"
          name="downloadDirectory"
          value={settings.downloadDirectory}
          changeSetting={changeSettings}
        />
        <Button type="submit">Save Changes</Button>
        {saved && <Message positive>Changes Saved</Message>}
        {error && <Message negative>{error}</Message>}
      </Form>
    );
  } else {
    return <Loader />;
  }
};

SettingsModel.propTypes = {
  settings: PropTypes.object,
  changeSettings: PropTypes.func,
  submit: PropTypes.func,
  saved: PropTypes.bool,
  error: PropTypes.string,
};
