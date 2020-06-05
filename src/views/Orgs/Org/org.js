import React, {useContext} from "react";

import './org.css'
import { AppContext } from "../../../components/Context/appContext";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TextField from "@material-ui/core/TextField";
import {Link} from "react-router-dom";

function filterOrgs() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("orgSearch");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

const Org = () => {
    const [contextValue] = useContext(AppContext);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const rows = [];
    const columns = [
        { id: 'id', label: 'Org ID', minWidth: 100 },
        { id: 'name', label: 'Org Name', minWidth: 170 },
    ];

    contextValue.orgList.map(entry  => {
        rows.push({
            id: entry.id,
            name: entry.name
        })
        return 0;
    });

    const useStyles = makeStyles({
        root: {
            maxWidth: '70%',
        },
        container: {
            maxHeight: 440,
        },
    });
    const classes = useStyles();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return(
        <div className="orgListSection">
            <h3>LIST OF ORGS</h3>

            <TextField
                id="orgSearch"
                label="Org Search"
                type="search"
                onKeyUp={ filterOrgs }
                variant="outlined" />

            <div>
                <TableContainer className={classes.container}>
                    <Table id="myTable" stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    <Link to={`${row.id}/`}>
                                                        {column.format && typeof value === 'number' ? column.format(value) : value}
                                                    </Link>
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component="div"
                    rowsPerPageOptions={[10, 25, 100]}
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </div>
        </div>
    );
}

export default Org;