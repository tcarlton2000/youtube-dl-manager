import React, { useState } from 'react';
import getRoute from 'Utils/getRoute';
import { Tree } from 'antd';
import PropTypes from 'prop-types';

const { DirectoryTree } = Tree;
const initTreeDate = [
  {
    title: 'downloads',
    key: '/downloads',
  },
];

/**
 * Update the tree data for new directory
 * @param {array} list
 * @param {string} key
 * @param {object} children
 * @return {array} New tree mapping
 */
const updateTreeData = (list, key, children) => {
  return list.map(node => {
    if (node.key === key) {
      return { ...node, children };
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }

    return node;
  });
};

/**
 * Format the API directory response for the tree component
 * @param {string} basePath The base path of all the directories
 * @param {array} directories List of directories in the basePath
 * @return {array} Directories as a list of objects
 */
const formatDirectoryList = (basePath, directories) => {
  return directories.map(directory => {
    return {
      title: directory,
      key: basePath + '/' + directory,
    };
  });
};

export const DownloadDirectoryList = ({ setDirectory }) => {
  const [treeData, setTreeData] = useState(initTreeDate);

  /**
   * Called when tree data needs to be reloaded
   * @param {string} key Key which needs to be updated
   * @param {array} children Array of the children of key, if present
   * @return {Promise<any>}
   */
  const onLoadData = ({ key, children }) => {
    return new Promise(resolve => {
      if (children) {
        resolve();
        return;
      }

      fetch(getRoute('/api/directories'), {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: key,
        }),
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          }

          throw new Error('Received non-2xx status code');
        })
        .then(responseJson => {
          setTreeData(origin =>
            updateTreeData(
              origin,
              key,
              formatDirectoryList(key, responseJson.directories),
            ),
          );
          resolve();
        });
    });
  };

  const onSelect = (key, event) => {
    setDirectory(key[0]);
  };

  return (
    <DirectoryTree
      loadData={onLoadData}
      onSelect={onSelect}
      treeData={treeData}
    />
  );
};

DownloadDirectoryList.propTypes = {
  setDirectory: PropTypes.func,
};
