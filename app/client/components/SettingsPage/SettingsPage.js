// React Imports
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Antd Imports
import { Alert, Form, Button, Spin } from 'antd';

// Component Imports
import Setting from 'Components/Setting';

// Util Imports
import getRoute from 'Utils/getRoute';

export const SettingsPage = () => {
  return (
    <div>
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

  const submit = values => {
    setSettings(values);
    fetch(getRoute('/api/settings'), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        settings: values,
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
      submit={submit}
      saved={saved}
      error={error}
    />
  );
};

export const SettingsModel = ({ settings, submit, saved, error }) => {
  if (settings !== null) {
    return (
      <Form onFinish={submit} initialValues={settings}>
        <Setting label="Download Directory" name="downloadDirectory" />
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save Changes
          </Button>
        </Form.Item>
        {saved && <Alert message="Changes Saved" />}
        {error && <Alert message={error} type="error" />}
      </Form>
    );
  } else {
    return <Spin className={'spinner'} size="large" data-testid="spinner" />;
  }
};

SettingsModel.propTypes = {
  settings: PropTypes.object,
  submit: PropTypes.func,
  saved: PropTypes.bool,
  error: PropTypes.string,
};
