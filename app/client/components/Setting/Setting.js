import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';

export const Setting = ({ label, name, value, changeSetting }) => {
  return (
    <Form.Field>
      <label>{label}</label>
      <input
        aria-label={name}
        onChange={changeSetting}
        name={name}
        value={value}
      />
    </Form.Field>
  );
};

Setting.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  changeSetting: PropTypes.func,
};
