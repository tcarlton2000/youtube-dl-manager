import React, { useState, useEffect } from 'react';
import T from "prop-types";
import Download from 'Components/Download'
import { Segment, Loader, Dimmer } from 'semantic-ui-react'
import getRoute from 'Utils/getRoute'

export const DownloadListProvider = () => {
    const [downloads, setDownloads] = useState(null );

    useEffect(() => {
        const interval = setInterval(() => {
            fetch(getRoute("/downloads"))
                .then((response) => response.json())
                .then((responseJson) => {
                    setDownloads(responseJson)
                })
                .catch((error) => {
                    console.error(error)
                })
            }, 1000);
            return () => clearInterval(interval)
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
                        percent={item.percent}
                        size={item.size}
                        speed={item.speed}
                        time_remaining={item.time_remaining}
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