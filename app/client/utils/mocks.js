export const downloadList = {
  downloads: [
    {
      id: 0,
      name: 'Download One',
      status: 'In Progress',
      percent: 50.0,
      size: '30.6MiB',
      speed: '100KiB/s',
      timeRemaining: '00:38',
    },
    {
      id: 1,
      name: 'Download Two',
      status: 'In Progress',
      percent: 100.0,
      size: '52.8MiB',
      speed: '0KiB/s',
      timeRemaining: '00:00',
    },
  ],
  totalPages: 1,
};

export const pageOneDownloadList = {
  downloads: [
    {
      id: 0,
      name: 'Download One',
      status: 'In Progress',
      percent: 50.0,
      size: '30.6MiB',
      speed: '100KiB/s',
      timeRemaining: '00:38',
    },
    {
      id: 1,
      name: 'Download Two',
      status: 'In Progress',
      percent: 100.0,
      size: '52.8MiB',
      speed: '0KiB/s',
      timeRemaining: '00:00',
    },
  ],
  totalPages: 2,
};

export const pageTwoDownloadList = {
  downloads: [
    {
      id: 2,
      name: 'Download Three',
      status: 'In Progress',
      percent: 50.0,
      size: '30.6MiB',
      speed: '100KiB/s',
      timeRemaining: '00:38',
    },
    {
      id: 3,
      name: 'Download Four',
      status: 'In Progress',
      percent: 100.0,
      size: '52.8MiB',
      speed: '0KiB/s',
      timeRemaining: '00:00',
    },
  ],
  totalPages: 2,
};

export const pageOneInProgressDownloadList = {
  downloads: [
    {
      id: 1,
      name: 'Download One',
      status: 'In Progress',
      percent: 50.0,
      size: '30.6MiB',
      speed: '100KiB/s',
      timeRemaining: '00:38',
    },
  ],
  totalPages: 2,
};

export const pageOneCompletedDownloadList = {
  downloads: [
    {
      id: 3,
      name: 'Download Three',
      status: 'Completed',
      percent: 100.0,
      size: '30.6MiB',
      speed: '100KiB/s',
      timeRemaining: '00:38',
    },
  ],
  totalPages: 2,
};

export const pageTwoInProgressDownloadList = {
  downloads: [
    {
      id: 2,
      name: 'Download Two',
      status: 'In Progress',
      percent: 50.0,
      size: '30.6MiB',
      speed: '100KiB/s',
      timeRemaining: '00:38',
    },
  ],
  totalPages: 2,
};

export const pageTwoCompletedDownloadList = {
  downloads: [
    {
      id: 4,
      name: 'Download Four',
      status: 'Completed',
      percent: 100.0,
      size: '30.6MiB',
      speed: '100KiB/s',
      timeRemaining: '00:38',
    },
  ],
  totalPages: 2,
};

export const sleep = time => {
  return new Promise(resolve => setTimeout(resolve, time));
};

export const downloadListMock = () => {
  jest.spyOn(global, 'fetch').mockImplementation(() => {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(downloadList),
    });
  });
};

export const paginatedDownloadListMock = () => {
  jest.spyOn(global, 'fetch').mockImplementation(url => {
    if (url.includes('2')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(pageTwoDownloadList),
      });
    }

    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(pageOneDownloadList),
    });
  });
};

export const filteredDownloadListMock = () => {
  jest.spyOn(global, 'fetch').mockImplementation(url => {
    if (url.includes('Completed,Error') && url.includes('1')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(pageOneCompletedDownloadList),
      });
    } else if (url.includes('Completed,Error') && url.includes('2')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(pageTwoCompletedDownloadList),
      });
    } else if (url.includes('In Progress') && url.includes('2')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(pageTwoInProgressDownloadList),
      });
    }

    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(pageOneInProgressDownloadList),
    });
  });
};

export const downloadListError = () => {
  jest.spyOn(global, 'fetch').mockImplementation(() => {
    return Promise.resolve({
      ok: false,
      json: () =>
        Promise.resolve({
          downloads: undefined,
          totalPages: undefined,
        }),
    });
  });
};

export const defaultDownloadSettings = () => {
  const settingsMock = {
    settings: {
      downloadDirectory: '/downloads',
    },
  };

  jest.spyOn(global, 'fetch').mockImplementation(() => {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(settingsMock),
    });
  });
};
