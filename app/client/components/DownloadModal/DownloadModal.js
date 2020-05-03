import React, { useState, useContext, useEffect } from 'react';
import { Modal, Button } from 'antd';
import DownloadDirectoryList from './DownloadDirectoryList';
import getRoute from 'Utils/getRoute';
import { SettingsContext } from 'Utils/context';
import PropTypes from 'prop-types';

export const DownloadModal = () => {
  const settings = useContext(SettingsContext)[0];
  const [url, setUrl] = useState('');
  const [directory, setDirectory] = useState({});

  useEffect(() => {
    setDirectory(settings.downloadDirectory);
  }, [settings]);

  const submit = () => {
    fetch(getRoute('/api/downloads'), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url,
        directory: directory,
      }),
    });
  };

  return (
    <DownloadModalModel
      setUrl={setUrl}
      setDirectory={setDirectory}
      url={url}
      submit={submit}
    />
  );
};

export const DownloadModalModel = ({ setUrl, setDirectory, url, submit }) => {
  const [showModal, setShowModal] = useState(false);

  const downloadClicked = () => {
    submit();
    closeModal();
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setUrl('');
    setShowModal(false);
  };

  const urlFromModal = event => {
    setUrl(event.target.value);
  };

  return (
    <div>
      <Button type="primary" onClick={openModal}>
        New Download...
      </Button>
      <Modal
        title="New Download"
        visible={showModal}
        onOk={downloadClicked}
        onCancel={closeModal}
      >
        <p>
          <label>URL: </label>
          <input onChange={urlFromModal} value={url} />
        </p>
        <label>Directory</label>
        <DownloadDirectoryList setDirectory={setDirectory} />
      </Modal>
    </div>
  );
};

DownloadModalModel.propTypes = {
  setUrl: PropTypes.func,
  setDirectory: PropTypes.func,
  url: PropTypes.string,
  submit: PropTypes.func,
};
