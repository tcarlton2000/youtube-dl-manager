// React Imports
import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import ReactDOM from 'react-dom';

// Antd Imports
import { Layout, Menu } from 'antd';

// CSS Imports
import 'antd/dist/antd.css';
import './index.css';

// Component Imports
import DownloadList from 'Components/DownloadList';
import SettingsPage from 'Components/SettingsPage';

const { Header, Content } = Layout;

const MENU_LINK_MAP = {
  '/': 'downloads',
  '/settings': 'settings',
};

const App = () => {
  return (
    <Router>
      <Layout className="layout" style={{ height: '100vh' }}>
        <Header>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={MENU_LINK_MAP[window.location.pathname]}
          >
            <Menu.Item key="downloads">
              <Link to="/">Downloads</Link>
            </Menu.Item>
            <Menu.Item key="settings">
              <Link to="/settings">Settings</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '10px 25px' }}>
          <div className="site-layout-content" style={{ height: '85vh' }}>
            <Route exact path="/" component={DownloadList} />
            <Route path="/settings" component={SettingsPage} />
          </div>
        </Content>
      </Layout>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
