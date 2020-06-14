import React, {useContext, useEffect, useState} from "react";
import {useHistory} from 'react-router';
import './org.css'
import {AppContext} from "../../../components/Context/appContext";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";


function filterOrgs(unfiltered, columnName, searchString) {
    if (searchString === "") return [...unfiltered]
    return unfiltered.filter((entry) => {
        return (entry[columnName] && entry[columnName].toUpperCase().indexOf(searchString.toUpperCase()) >= 0)
    })
}

const Org = () => {
    const history = useHistory();
    const [contextValue] = useContext(AppContext);
    const [orgList, setOrgList] = useState([]);
    const [orgListFiltered, setOrgListFiltered] = useState([]);
    const [isNotLoaded, setIsNotLoaded] = useState(true);

    // Initialization
    useEffect(() => {
        if (contextValue.orgList.length > 0 && isNotLoaded) {
            setIsNotLoaded(false);
            let orgs = []
            contextValue.orgList.forEach(entry => {
                orgs.push({
                    id: entry.id,
                    name: entry.name,
                    url: entry.url
                })
            });
            setOrgList([...orgs]);
        }
    }, [contextValue, isNotLoaded]);

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
        [searchString, searchColumn, orgList])


    return (
        <div className="orgListSection">
            <h3>LIST OF ORGS</h3>

            <TextField
                id="orgSearch"
                label="Org Search"
                type="search"
                value={searchString}
                onChange={e => {
                    setPage(0);
                    setSearchString(e.target.value);
                }}
                variant="outlined"/>

            <div>
                <TableContainer>
                    <Table id="myTable" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell align="right"
                                           style={{fontWeight: "bold", fontSize: 16, width: 120}}>S.No</TableCell>
                                <TableCell align="center" style={{fontWeight: "bold", fontSize: 16, width: 150}}>Org
                                    Name</TableCell>
                                <TableCell align="center" style={{fontWeight: "bold", fontSize: 16}}>Org
                                    ID</TableCell>
                                <TableCell align='center'
                                           style={{fontWeight: "bold", fontSize: 16}}>URL</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* eslint-disable-next-line array-callback-return */}
                            {orgListFiltered.map((entry, index) => {
                                if (index >= rowsPerPage * page && index < rowsPerPage * (page + 1)) {
                                    return (
                                        <TableRow key={entry.id}>
                                            <TableCell align="left" onClick={() => history.push(`${entry.id}/`)}>
                                                <Tooltip title={JSON.stringify(entry)} interactive>
                                                    <IconButton size="small">
                                                        <InfoIcon
                                                            fontSize="small"
                                                        />
                                                    </IconButton>
                                                </Tooltip>
                                                {(index + 1)}
                                            </TableCell>
                                            <TableCell align="left" onClick={() => history.push(`${entry.id}/`)}>
                                                {entry.name}
                                            </TableCell>
                                            <TableCell align="center"
                                                       onClick={() => history.push(`${entry.id}/`)}
                                                       style={{fontSize: 12}}>
                                                {entry.id}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Button
                                                    color='primary'
                                                    style={{backgroundColor: "white", padding: 0}}
                                                    onClick={() => {
                                                        window.open(entry.url, '_blank').focus();
                                                    }}>
                                                    Dashboard
                                                </Button>
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