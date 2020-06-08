import React, {useContext, useEffect, useState} from "react";

//import './org.css'
import {AppContext} from "../../../components/Context/appContext";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TextField from "@material-ui/core/TextField";
import {Link} from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import InfoIcon from "@material-ui/icons/Info";

function filterOrgs(unfiltered, columnName, searchString) {
    if (searchString === "") return [...unfiltered]
    return unfiltered.filter((entry) => {
        return (entry[columnName] && entry[columnName].toUpperCase().indexOf(searchString.toUpperCase()) >= 0)
    })
}

const Org = () => {
    const [contextValue] = useContext(AppContext);
    const [orgList, setOrgList] = useState([]);
    const [orgListFiltered, setOrgListFiltered] = useState([]);

    // Initialization
    useEffect(() => {
        if (contextValue.orgList.length > 0) {
            let orgs = []
            contextValue.orgList.forEach(entry => {
                orgs.push({
                    id: entry.id,
                    name: entry.name,
                    url: entry.url
                })
            });
            setOrgList([...orgs]);
            setOrgListFiltered([...orgs]);
        }
    }, [contextValue]);

    // Network List Pagination
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    // Org Search filter field
    const [searchString, setSearchString] = useState("");
    const [searchColumn, setSearchColumn] = useState("name");
    useEffect(() => {
            let filteredResults = filterOrgs(orgList, searchColumn, searchString)
            setOrgListFiltered(filteredResults)
        },
        [searchString, searchColumn, orgListFiltered])


    return (
        <div className="orgListSection">
            <h3>LIST OF ORGS</h3>

            <TextField
                id="orgSearch"
                label="Org Search"
                type="search"
                value={searchString}
                onChange={e => setSearchString(e.target.value)}
                variant="outlined"/>

            <div>
                <TableContainer>
                    <Table id="myTable" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell align="right"
                                           style={{fontWeight: "bold", fontSize: 16}}>S.No</TableCell>
                                <TableCell align="center" style={{fontWeight: "bold", fontSize: 16, width: 150}}>Org
                                    Name</TableCell>
                                <TableCell align="center" style={{fontWeight: "bold", fontSize: 16}}>Org
                                    ID</TableCell>
                                <TableCell align="center"
                                           style={{fontWeight: "bold", fontSize: 16}}>URL</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orgListFiltered.map((entry, index) => {
                                if (index >= rowsPerPage * page && index < rowsPerPage * (page + 1)) {
                                    return (
                                        <TableRow key={entry.id}>
                                            <TableCell align="left" style={{width: 110}}>
                                                <Tooltip title="test">
                                                    <InfoIcon
                                                        fontSize="small"
                                                    />
                                                </Tooltip>
                                                {(index + 1)}
                                            </TableCell>
                                            <TableCell align="left">
                                                <Link to={`${entry.id}/`}>
                                                    {entry.name}
                                                </Link>
                                            </TableCell>
                                            <TableCell align="center"
                                                       style={{fontSize: 12}}>{entry.id}</TableCell>
                                            <TableCell align="center">
                                                <Link
                                                    component="button"
                                                    variant="body2"
                                                    onClick={() => {
                                                        window.open(entry.url, '_blank').focus();
                                                    }}>
                                                    Dashboard
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                            })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component="div"
                    rowsPerPageOptions={[5, 25, 100]}
                    count={orgListFiltered.length}
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