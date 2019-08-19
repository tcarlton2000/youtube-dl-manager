import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import T from "prop-types";
import Download from 'Components/Download'
import { Segment, Loader, Dimmer } from 'semantic-ui-react'

export const DownloadListProvider = () => {
    const [downloads, setDownloads] = useState(null );
    let reloadDownloads = false

    useEffect(() => {
        fetch("http://172.17.0.2:5000/downloads")
            .then((response) => response.json())
            .then((responseJson) => {
                setDownloads(responseJson)
            })
            .catch((error) => {
                console.error(error)
            })
    }, [])

    return (
        <DownloadListModel downloads={downloads} />
    )
}

export const DownloadListModel = ({downloads}) => {
    if (downloads !== null) {
        return (
            <Segment.Group raised>
                {downloads.map(
                    item =>
                    <Download
                        key={item.id}
                        name={item.name}
                        status={item.status}
                    />
                    )
                }
            </Segment.Group>
        )
    } else {
        return  (
            <Dimmer active inverted>
                <Loader>Loading</Loader>
            </Dimmer>
        )
    }
}

DownloadListModel.proptypes = {
    downloads: T.array
}

export const DownloadList = () => {
    return (
        <DownloadListProvider />
    )
}