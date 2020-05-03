// React Imports
import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';

// Antd Imports
import { Alert, Form, Button, Spin } from 'antd';

// Component Imports
import Setting from 'Components/Setting';

// Util Imports
import getRoute from 'Utils/getRoute';
import { SettingsContext } from 'Utils/context';

export const SettingsPage = () => {
  return (
    <div>
      <Settings />
    </div>
  );
};

export const Settings = () => {
  const [settings, setSettings] = useContext(SettingsContext);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  const submit = values => {
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
        setSettings(values);
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
