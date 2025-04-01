import React from 'react';
import { Tooltip } from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ListIcon from '@mui/icons-material/List';
import AppsIcon from '@mui/icons-material/Apps';
import SortIcon from '@mui/icons-material/Sort';
import TableChartIcon from '@mui/icons-material/TableChart';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const KeyTypeIcon = ({ type, fontSize = 'medium' }) => {
  let icon;
  let tooltip;

  switch (type) {
    case 'string':
      icon = <TextFieldsIcon fontSize={fontSize} color="primary" />;
      tooltip = 'String';
      break;
    case 'list':
      icon = <ListIcon fontSize={fontSize} color="secondary" />;
      tooltip = 'List';
      break;
    case 'set':
      icon = <AppsIcon fontSize={fontSize} style={{ color: '#4caf50' }} />;
      tooltip = 'Set';
      break;
    case 'zset':
      icon = <SortIcon fontSize={fontSize} style={{ color: '#ff9800' }} />;
      tooltip = 'Sorted Set';
      break;
    case 'hash':
      icon = <TableChartIcon fontSize={fontSize} style={{ color: '#2196f3' }} />;
      tooltip = 'Hash';
      break;
    default:
      icon = <HelpOutlineIcon fontSize={fontSize} color="action" />;
      tooltip = 'Unknown';
  }

  return <Tooltip title={tooltip}>{icon}</Tooltip>;
};

export default KeyTypeIcon;