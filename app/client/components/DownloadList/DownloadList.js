import React, { useState, useEffect } from 'react';
import T from 'prop-types';
import Download from 'Components/Download';
import { Segment, Loader, Dimmer, Pagination } from 'semantic-ui-react';
import getRoute from 'Utils/getRoute';

export const DownloadListProvider = () => {
  const [downloads, setDownloads] = useState(null);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getDownloads = pageNumber => {
    fetch(getRoute('/downloads?page=' + pageNumber))
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
    getDownloads(activePage);
    const interval = setInterval(() => {
      getDownloads(activePage);
    }, 1000);
    return () => clearInterval(interval);
  }, [activePage]);

  const handlePageChange = (e, value) => {
    setActivePage(value.activePage);
  };

  return (
    <DownloadListModel
      downloads={downloads}
      activePage={activePage}
      totalPages={totalPages}
      handlePageChange={handlePageChange}
    />
  );
};

export const DownloadListModel = ({
  downloads,
  activePage,
  totalPages,
  handlePageChange,
}) => {
  if (downloads !== null) {
    return (
      <div>
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
            activePage={activePage}
            onPageChange={handlePageChange}
            totalPages={totalPages}
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
