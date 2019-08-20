import React from 'react'
import { storiesOf } from "@storybook/react"
import { text } from '@storybook/addon-knobs'
import { DownloadListModel } from './DownloadList'

const downloads = [
    {
        id: 1,
        name: "Download One",
        status: "In Progress",
        percent: 50.0,
        size: "30.6MiB",
        speed: "100KiB/s",
        time_remaining: "00:38"
    },
    {
        id: 2,
        name: "Download Two",
        status: "Completed",
        percent: 100.0,
        size: "52.8MiB",
        speed: "0KiB/s",
        time_remaining: "00:00"
    }
]

storiesOf('DownloadList', module)
    .add('display list', () => (
        <DownloadListModel downloads={downloads} />))
    .add('loading', () => (
        <DownloadListModel downloads={null} />))
