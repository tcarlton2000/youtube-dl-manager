import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import './Compact.css';
import MainPage from 'Components/MainPage';
import SettingsPage from 'Components/SettingsPage';
import { Container } from 'semantic-ui-react';

const App = () => {
  return (
    <Router>
      <Container margin={20}>
        <h1>Youtube Download Manager</h1>
        <Route exact path="/" component={MainPage} />
        <Route path="/settings" component={SettingsPage} />
      </Container>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
