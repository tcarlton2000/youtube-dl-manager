import React from 'react'
import { storiesOf } from "@storybook/react"
import { DownloadModalModel } from './DownloadModal'

storiesOf('DownloadModal', module).add('default', () => (
    <DownloadModalModel url="" directory="/downloads"/>
))
