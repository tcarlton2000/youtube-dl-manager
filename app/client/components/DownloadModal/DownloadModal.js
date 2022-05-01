import React, { useState, useContext, useEffect } from 'react';
import { Modal, Button, Select } from 'antd';
import DownloadDirectoryList from './DownloadDirectoryList';
import getRoute from 'Utils/getRoute';
import { SettingsContext } from 'Utils/context';
import PropTypes from 'prop-types';

const { Option } = Select;

export const DownloadModal = () => {
  const settings = useContext(SettingsContext)[0];
  const [url, setUrl] = useState('');
  const [directory, setDirectory] = useState({});
  const [downloader, setDownloader] = useState('auto');

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
        downloader: downloader,
      }),
    });
  };

  return (
    <DownloadModalModel
      setUrl={setUrl}
      setDirectory={setDirectory}
      downloader={downloader}
      setDownloader={setDownloader}
      url={url}
      submit={submit}
    />
  );
};

export const DownloadModalModel = ({
  setUrl,
  setDirectory,
  url,
  downloader,
  setDownloader,
  submit,
}) => {
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
        <div style={{ marginBottom: 12 }}>
          <label>URL: </label>
          <input onChange={urlFromModal} value={url} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Downloader: </label>
          <Select
            style={{ width: 120 }}
            defaultValue={downloader}
            onChange={setDownloader}
          >
            <Option value="auto">Auto</Option>
            <Option value="youtube">Youtube</Option>
            <Option value="gallery">Gallery</Option>
            <Option value="sw">SW</Option>
          </Select>
        </div>
        <label>Directory</label>
        <DownloadDirectoryList setDirectory={setDirectory} />
      </Modal>
    </div>
  );
};

DownloadModalModel.propTypes = {
  setUrl: PropTypes.func,
  setDirectory: PropTypes.func,
  downloader: PropTypes.string,
  setDownloader: PropTypes.func,
  url: PropTypes.string,
  submit: PropTypes.func,
};
