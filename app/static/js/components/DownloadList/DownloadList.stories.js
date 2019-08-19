import React from 'react'
import { storiesOf } from "@storybook/react"
import { text } from '@storybook/addon-knobs'
import { DownloadListModel } from './DownloadList'

const downloads = [
    {
        id: 1,
        name: "Download One",
        status: "In Progress"
    },
    {
        id: 2,
        name: "Download Two",
        status: "Completed"
    }
]

storiesOf('DownloadList', module)
    .add('display list', () => (
        <DownloadListModel downloads={downloads} />))
    .add('loading', () => (
        <DownloadListModel downloads={null} />))
