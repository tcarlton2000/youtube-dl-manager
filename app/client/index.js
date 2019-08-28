import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import './Compact.css';
import DownloadList from 'Components/DownloadList';
import DownloadModal from 'Components/DownloadModal';
import { Container } from 'semantic-ui-react';

const App = () => {
  return (
    <Container margin={20}>
      <h1>Youtube Download Manager</h1>
      <DownloadModal />
      <DownloadList />
    </Container>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
