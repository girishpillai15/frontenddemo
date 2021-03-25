import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
// import "./tableStyle.css";

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };
  render() {
    const {
      order,
      orderBy,
      data } = this.props;

    return (
      <TableHead>
        <TableRow className="tableHead">
          {Object.keys(data[0]).map(
            row => (
              (row === "Author" ||
                row === "Title" ||
                row === "Creation_Date") &&
              <TableCell
                key={row}
                align={"left"}
                sortDirection={orderBy === row ? order : false}
              >
                <TableSortLabel
                  active={orderBy === row}
                  direction={order}
                  onClick={this.createSortHandler(row)}
                  style={{ color: 'white' }}
                >
                  {row.toUpperCase().replace("_", " ")}
                </TableSortLabel>
              </TableCell>
            )
          )}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  // onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

const styles = () => ({
  root: {
    width: "100%",
    backgroundColor: '#8b0000',
    color: 'white'
    //marginTop: theme.spacing.unit * 3
  },
  table: {
    minWidth: "100%"
  },
  tableWrapper: {
    overflowX: "auto",
  }
});

class EnhancedTable extends React.Component {
  state = {
    order: "asc",
    orderBy: "",
    selected: [],
    page: 0,
    openSelectedDialog: false,
    openSelectedDialogData: {},
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {

    const { classes, limit } = this.props;
    const { order, orderBy, selected, page } = this.state;
    // const emptyRows =
    //   limit -
    //   Math.min(limit, this.props.data.length - page * limit);

    return (
      <>
        <Paper className={classes.root}>
          <div className={classes.tableWrapper}>
            <Table className={classes.table} aria-labelledby="tableTitle" >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onRequestSort={this.handleRequestSort}
                rowCount={this.props.data.length}
                data={this.props.data}
                actions={this.props.actions}
              />
              <TableBody>
                {stableSort(this.props.data, getSorting(order, orderBy))
                  .slice(page * limit, page * limit + limit)
                  .map((n, index) => {
                    return (
                      <TableRow
                        onClick={() => {
                          this.setState({
                            openSelectedDialog: !this.state.openSelectedDialog,
                            openSelectedDialogData: n
                          })

                        }}
                        inline
                        hover
                        key={index}
                        className="tableRow"
                        style={{
                          height: 20,
                          color: 'white'
                        }}
                      >
                        {Object.keys(this.props.data[0]).map(
                          row => {

                            return (
                              (row === "Author" ||
                                row === "Title" ||
                                row === "Creation_Date") &&
                              <TableCell style={{ color: 'white' }} key={row} align="left" component="td" scope="row"  >
                                {n[row]}
                              </TableCell>
                            )
                          }

                        )}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
        </Paper>
        <Dialog
          open={this.state.openSelectedDialog}
          onClose={() => {
            this.setState({
              openSelectedDialog: !this.state.openSelectedDialog
            })
          }}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
            Question
        </DialogTitle>
          <DialogContent>
            <DialogContentText className="main-dialog-container">

              <span>
                {this.state.openSelectedDialogData.Title}
              </span>
              <div style={{ textAlign: 'center',marginTop:20 }}>
                <button>
                  <a target="_blank" rel="noreferrer" href={this.state.openSelectedDialogData.link} className="anchor-tag">
                    <span style={{ fontSize: 22 }}>
                      {"Link"}
                    </span>
                  </a>
                </button>
              </div>

            </DialogContentText>
          </DialogContent >
          <DialogActions>
            <Button autoFocus onClick={() => {
              this.setState({
                openSelectedDialog: !this.state.openSelectedDialog
              })
            }} color="primary">
              ok
          </Button>
          </DialogActions>
        </Dialog >
      </>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(EnhancedTable);
