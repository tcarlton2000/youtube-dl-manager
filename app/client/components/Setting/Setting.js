// React Imports
import React from 'react';
import PropTypes from 'prop-types';

// Antd Imports
import { Form, Input } from 'antd';

export const Setting = ({ label, name }) => {
  return (
    <Form.Item label={label} name={name}>
      <Input data-testid={name} />
    </Form.Item>
  );
};

Setting.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
};
