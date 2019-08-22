import React, {useState} from 'react';
import { Button, Modal, Form } from 'semantic-ui-react'


export const DownloadModal = () => {
    const [url, setUrl] = useState("");
    const [directory, setDirectory] = useState("/downloads");

    const urlFromModal = (event) => {
        setUrl(event.target.value)
    }

    const directoryFromModal = (event) => {
        setDirectory(event.target.value)
    }

    const submit = () => {
        fetch('http://172.17.0.2:5000/downloads', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: url,
                directory: directory
            })
        })
    }

    return (
        <DownloadModalModel
            setUrl={urlFromModal}
            setDirectory={directoryFromModal}
            url={url}
            directory={directory}
            submit={submit}
        />
    )
}

export const DownloadModalModel = ({ setUrl, setDirectory, url, directory, submit }) => {
    const [showModal, setShowModal] = useState(false );

    const downloadClicked = () => {
        closeModal()
        submit()
    }

    const openModal = () => {
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
    }

    return (
        <div align="right">
            <Modal open={showModal} onClose={closeModal} trigger={<Button onClick={openModal}>New Download...</Button>}>
                <Modal.Header>New Download</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field>
                            <label>URL</label>
                            <input onChange={setUrl} value={url} />
                        </Form.Field>
                        <Form.Field>
                            <label>Directory</label>
                            <input onChange={setDirectory} value={directory} />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button primary onClick={downloadClicked}>Download</Button>
                    <Button secondary onClick={closeModal}>Cancel</Button>
                </Modal.Actions>
            </Modal>
        </div>
    );
}
