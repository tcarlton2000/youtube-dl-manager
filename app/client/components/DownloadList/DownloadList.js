// React Imports
import React, { useState, useEffect } from 'react';
import T from 'prop-types';

// Antd Imports
import { List, Menu, Pagination, Spin } from 'antd';

// Component Imports
import Download from 'Components/Download';
import DownloadModal from 'Components/DownloadModal';

// Util Imports
import getRoute from 'Utils/getRoute';

// Status and Page Constants
const IN_PROGRESS_KEY = 'inProgress';
const COMPLETED_KEY = 'completed';

const IN_PROGRESS_STATUS = 'In Progress';
const COMPLETED_STATUS = 'Completed,Error';

const PAGE_SIZE = 10;

const statusMap = {
  inProgress: IN_PROGRESS_STATUS,
  completed: COMPLETED_STATUS,
};

export const DownloadListProvider = () => {
  const [downloads, setDownloads] = useState(null);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState(IN_PROGRESS_KEY);

  const getDownloads = (pageNumber, status) => {
    fetch(
      getRoute(
        '/api/downloads?limit=' +
          PAGE_SIZE +
          '&page=' +
          pageNumber +
          '&status=' +
          statusMap[status],
      ),
    )
      .then(response => {
        if (response.ok) {
          return response.json();
        }

        throw new Error('Received non-2xx status code');
      })
      .then(responseJson => {
        setDownloads(responseJson.downloads);
        setTotalPages(responseJson.totalPages);
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    getDownloads(activePage, statusFilter);
    const interval = setInterval(() => {
      getDownloads(activePage, statusFilter);
    }, 1000);
    return () => clearInterval(interval);
  }, [activePage, statusFilter]);

  const handlePageChange = (page, pageSize) => {
    setDownloads(null);
    setActivePage(page);
  };

  const handleStatusChange = ({ key }) => {
    setDownloads(null);
    setStatusFilter(key);
    setActivePage(1);
  };

  return (
    <div>
      <table style={{ width: '100%' }}>
        <tbody>
          <tr>
            <td>
              <Pagination
                current={activePage}
                total={PAGE_SIZE * totalPages}
                pageSize={PAGE_SIZE}
                onChange={handlePageChange}
              />
            </td>
            <td style={{ textAlign: 'right' }}>
              <DownloadModal />
            </td>
          </tr>
        </tbody>
      </table>
      <DownloadListModel
        downloads={downloads}
        activePage={activePage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        statusFilter={statusFilter}
        handleStatusChange={handleStatusChange}
      />
    </div>
  );
};

export const DownloadListModel = ({
  downloads,
  statusFilter,
  handleStatusChange,
}) => {
  if (downloads !== null) {
    return (
      <div>
        <Menu
          onClick={handleStatusChange}
          selectedKeys={[statusFilter]}
          mode="horizontal"
        >
          <Menu.Item key={IN_PROGRESS_KEY}>In Progress</Menu.Item>
          <Menu.Item key={COMPLETED_KEY}>Completed</Menu.Item>
        </Menu>
        <List
          className="downloadList"
          itemLayout="horizontal"
          dataSource={downloads}
          renderItem={item => <Download download={item} />}
        />
      </div>
    );
  } else {
    return <Spin className="spinner" size="large" data-testid="spinner" />;
  }
};

DownloadListModel.proptypes = {
  downloads: T.array,
  activePage: T.number,
  totalPages: T.number,
  handlePageChange: T.func,
};

export const DownloadList = () => {
  return <DownloadListProvider />;
};
