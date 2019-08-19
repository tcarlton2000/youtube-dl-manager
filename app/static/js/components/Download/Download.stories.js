import React from 'react'
import { storiesOf } from "@storybook/react"
import { text } from '@storybook/addon-knobs'
import Download from '../Download'

storiesOf('Download', module).add('default', () => (
    <Download
        name={text("name", "Name")}
        status={text("status", "Status")}
    />
))
