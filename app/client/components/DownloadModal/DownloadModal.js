import React, { useState } from 'react';
import { Button, Modal, Form } from 'semantic-ui-react';
import DownloadDirectoryList from './DownloadDirectoryList';
import getRoute from 'Utils/getRoute';
import PropTypes from 'prop-types';

export const DownloadModal = () => {
  const [url, setUrl] = useState('');
  const [directory, setDirectory] = useState('/downloads');

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
    setDirectory('/downloads');
    setShowModal(false);
  };

  const urlFromModal = event => {
    setUrl(event.target.value);
  };

  return (
    <Modal
      open={showModal}
      onClose={closeModal}
      trigger={<Button onClick={openModal}>New Download...</Button>}
    >
      <Modal.Header>New Download</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <label>URL</label>
            <input onChange={urlFromModal} value={url} />
          </Form.Field>
          <Form.Field>
            <label>Directory</label>
            <DownloadDirectoryList setDirectory={setDirectory} />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button primary onClick={downloadClicked}>
          Download
        </Button>
        <Button secondary onClick={closeModal}>
          Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

DownloadModalModel.propTypes = {
  setUrl: PropTypes.func,
  setDirectory: PropTypes.func,
  url: PropTypes.string,
  submit: PropTypes.func,
};
