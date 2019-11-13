import React from 'react';
import PropTypes from 'prop-types';
import { map, size, filter } from 'lodash';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
// core components
import tableStyle from 'assets/jss/material-dashboard-react/components/tableStyle';

function TableList({ ...props }) {
  const {
    classes, tableHead, tableColumns, tableData, deleteAction, editAction, tableHeaderColor, onSelectAll,
    onSelect, selected
  } = props;
  const numSelected = size(filter(selected, s => !!s));

  return (
    <div className={classes.tableResponsive}>
      <Table className={classes.table}>
        {tableHead !== undefined ? (
          <TableHead className={classes[`${tableHeaderColor}TableHeader`]}>
            <TableRow>
              {onSelectAll ? (
                <TableCell className={classes.tableCell} key="edit" style={{ width: 30 }}>
                  <Checkbox
                    indeterminate={numSelected > 0 && numSelected < tableData.length}
                    checked={numSelected === tableData.length}
                    onChange={onSelectAll}
                    inputProps={{ 'aria-label': 'select all desserts' }}
                  />
                </TableCell>
              ) : null}
              {tableHead.map(prop => (
                <TableCell className={`${classes.tableCell} ${classes.tableHeadCell}`} key={prop}>
                  {prop}
                </TableCell>
              ))}
              {editAction || deleteAction ? (
                <TableCell
                  className={`${classes.tableCell} ${classes.tableHeadCell}`}
                  key="actions"
                  style={{ textAlign: 'right' }}
                >
                  Actions
                </TableCell>
              ) : null}
            </TableRow>
          </TableHead>
        ) : null}
        <TableBody>
          {map(tableData, (prop, key) => (
            <TableRow key={key}>
              {onSelect ? (
                <TableCell className={classes.tableCell} key="edit" style={{ textAlign: 'right' }}>
                  <Checkbox
                    checked={!!selected[prop.name]}
                    onChange={onSelect(prop)}
                    inputProps={{ 'aria-label': 'select all desserts' }}
                  />
                </TableCell>
              ) : null}
              {map(prop, (subprop, key2) => {
                if (tableColumns.includes(key2)) {
                  return (
                    <TableCell className={classes.tableCell} key={key2}>
                      {subprop}
                    </TableCell>
                  );
                }
              })}
              {editAction || deleteAction ? (
                <TableCell className={classes.tableCell} key="edit" style={{ textAlign: 'right' }}>
                  {editAction ? (
                    <IconButton
                      className={classes.button}
                      aria-label="delete"
                      color="secondary"
                      onClick={() => {
                        editAction(prop);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  ) : null}
                  {deleteAction ? (
                    <IconButton
                      className={classes.button}
                      aria-label="delete"
                      color="secondary"
                      onClick={() => {
                        deleteAction(prop);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  ) : null}
                </TableCell>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

TableList.defaultProps = {
  tableHeaderColor: 'gray'
};

TableList.propTypes = {
  classes: PropTypes.object.isRequired,
  onSelectAll: PropTypes.func,
  onSelect: PropTypes.func,
  deleteAction: PropTypes.func,
  editAction: PropTypes.func,
  selected: PropTypes.number,
  tableHeaderColor: PropTypes.oneOf(['warning', 'primary', 'danger', 'success', 'info', 'rose', 'gray']),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableColumns: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.object)
};

export default withStyles(tableStyle)(TableList);
