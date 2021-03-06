import React from 'react';
import {
  FormControl,
  Select as MuiSelect,
  MenuItem,
  FormHelperText,
} from '@material-ui/core';

export default function Select(props) {
  const {
    name,
    label,
    value,
    error = null,
    onChange,
    options,
    placeHolder,
  } = props;

  return (
    <FormControl fullWidth {...(error && { error: true })} variant='outlined'>
      <MuiSelect
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        SelectDisplayProps={{ style: { paddingTop: 10, paddingBottom: 10 } }}
      >
        <MenuItem value={value}>{placeHolder}</MenuItem>
        {options.map((item) => (
          <MenuItem
            key={item.value}
            value={item.value}
            style={{
              whiteSpace: 'normal',
              fontSize: 14,
            }}
          >
            {/* ({item.value})-{item.label} */}
            {item.label}
          </MenuItem>
        ))}
      </MuiSelect>
      <FormHelperText>{error}</FormHelperText>
    </FormControl>
  );
}
