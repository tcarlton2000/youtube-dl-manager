import React from 'react';
import ReactDOM from 'react-dom';
import T from 'prop-types'
import { Segment } from 'semantic-ui-react'


export const Download = ({ name, status }) => {
    return (
        <Segment>
            <p>{name}</p>
            <p>{status}</p>
        </Segment>
    )
}

Download.proptypes = {
    name: T.string,
    status: T.string
}
