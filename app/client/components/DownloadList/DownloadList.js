import React, { useState, useEffect } from 'react';
import T from 'prop-types';
import Download from 'Components/Download';
import { Segment, Loader, Dimmer, Pagination, Menu } from 'semantic-ui-react';
import getRoute from 'Utils/getRoute';

const IN_PROGRESS_STATUS = 'In Progress';
const COMPLETED_STATUS = 'Completed,Error';

export const DownloadListProvider = () => {
  const [downloads, setDownloads] = useState(null);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState(IN_PROGRESS_STATUS);

  const getDownloads = (pageNumber, status) => {
    fetch(getRoute('/api/downloads?page=' + pageNumber + '&status=' + status))
      .then(response => response.json())
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

  const handlePageChange = (e, value) => {
    setActivePage(value.activePage);
  };

  const handleStatusChange = (e, value) => {
    setStatusFilter(value.name);
    setActivePage(1);
  };

  return (
    <DownloadListModel
      downloads={downloads}
      activePage={activePage}
      totalPages={totalPages}
      handlePageChange={handlePageChange}
      statusFilter={statusFilter}
      handleStatusChange={handleStatusChange}
    />
  );
};

export const DownloadListModel = ({
  downloads,
  activePage,
  totalPages,
  handlePageChange,
  statusFilter,
  handleStatusChange,
}) => {
  if (downloads !== null) {
    return (
      <div>
        <Menu pointing secondary>
          <Menu.Item
            name={IN_PROGRESS_STATUS}
            active={statusFilter === IN_PROGRESS_STATUS}
            onClick={handleStatusChange}
          />
          <Menu.Item
            name={COMPLETED_STATUS}
            active={statusFilter === COMPLETED_STATUS}
            onClick={handleStatusChange}
          />
        </Menu>
        <Segment.Group raised>
          {downloads.map(item => (
            <Download
              key={item.id}
              name={item.name}
              status={item.status}
              percent={item.percent}
              size={item.size}
              speed={item.speed}
              timeRemaining={item.timeRemaining}
            />
          ))}
        </Segment.Group>
        <div align="center">
          <Pagination
            firstItem={null}
            lastItem={null}
            activePage={activePage}
            onPageChange={handlePageChange}
            totalPages={totalPages}
            siblingRange={1}
            boundaryRange={0}
          />
        </div>
      </div>
    );
  } else {
    return (
      <Dimmer active inverted>
        <Loader>Loading</Loader>
      </Dimmer>
    );
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
