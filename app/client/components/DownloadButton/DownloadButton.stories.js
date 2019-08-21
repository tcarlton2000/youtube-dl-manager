import React from 'react'
import { storiesOf } from "@storybook/react"
import { text } from '@storybook/addon-knobs'
import DownloadButton from '../DownloadButton'

storiesOf('DownloadButton', module).add('default', () => (
    <DownloadButton />
))
