import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css'
import DownloadList from 'Components/DownloadList'
import DownloadButton from 'Components/DownloadButton'
import { Container } from 'semantic-ui-react'


const App = () => {
    return (
        <Container margin={20}>
            <h1>Youtube Download Manager</h1>
            <DownloadButton />
            <DownloadList />
        </Container>
    );
}

ReactDOM.render(<App />, document.getElementById('app'));