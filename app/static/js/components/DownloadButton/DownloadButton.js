import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'semantic-ui-react'


export class DownloadButton extends React.Component {
    render() {
        return (
            <div align="right">
                <Button>New Download...</Button>
            </div>
        );
    }
}
