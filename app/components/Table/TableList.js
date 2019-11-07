import React from "react";
import PropTypes from "prop-types";
import { map } from 'lodash';
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
// core components
import tableStyle from "assets/jss/material-dashboard-react/components/tableStyle.jsx";

function TableList({ ...props }) {
  const { classes, tableHead, tableColumns, tableData, deleteAction, editAction, tableHeaderColor } = props;
  return (
    <div className={classes.tableResponsive}>
      <Table className={classes.table}>
        {tableHead !== undefined ? (
          <TableHead className={classes[tableHeaderColor + "TableHeader"]}>
            <TableRow>
              {tableHead.map((prop, key) => {
                return (
                  <TableCell
                    className={classes.tableCell + " " + classes.tableHeadCell}
                    key={key}
                  >
                    {prop}
                  </TableCell>
                );
              })}
              {editAction || deleteAction ? (
                <TableCell
                  className={classes.tableCell + " " + classes.tableHeadCell}
                  key="actions"
                  style={{ textAlign: 'right'}}
                >
                  Actions
                </TableCell>
                ) : null
              }
            </TableRow>
          </TableHead>
        ) : null}
        <TableBody>
          {map(tableData, (prop, key) => {
            return (
              <TableRow key={key}>
                {map(prop, (prop, key) => {
                  if (tableColumns.includes(key)) {
                    return (
                      <TableCell className={classes.tableCell} key={key}>
                        {prop}
                      </TableCell>
                    );
                  }
                })}
                {editAction || deleteAction ? (
                  <TableCell className={classes.tableCell} key="edit" style={{ textAlign: 'right'}}>
                    {editAction ? (
                      <IconButton className={classes.button} aria-label="delete" color="secondary" onClick={() => {editAction(prop)}}>
                        <EditIcon />
                      </IconButton>
                    ) : null}
                    {deleteAction ? (
                      <IconButton className={classes.button} aria-label="delete" color="secondary" onClick={() => {deleteAction(prop)}}>
                        <DeleteIcon />
                      </IconButton>
                    ) : null}
                  </TableCell>
                ) : null}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

TableList.defaultProps = {
  tableHeaderColor: "gray"
};

TableList.propTypes = {
  classes: PropTypes.object.isRequired,
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray"
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.object)
};

export default withStyles(tableStyle)(TableList);
