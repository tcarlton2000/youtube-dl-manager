import React from 'react';
import { Link } from 'react-router-dom';
import DownloadList from 'Components/DownloadList';
import DownloadModal from 'Components/DownloadModal';
import { Icon } from 'semantic-ui-react';

export const MainPage = () => {
  return (
    <div>
      <div align="right">
        <DownloadModal />
        <Link to="/settings" className="settings">
          <Icon name="cog" size="large" align="right" />
        </Link>
      </div>
      <DownloadList />
    </div>
  );
};
