import React from 'react';
import ReactDOM from 'react-dom';
import { Segment } from 'semantic-ui-react'


export class Download extends React.Component {
    render() {
        return (
            <Segment>
                <p>{this.props.info.name}</p>
                <p>{this.props.info.status}</p>
            </Segment>
        );
    }
}
