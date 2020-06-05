import React, {useContext, useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {AppContext} from "../../Context/appContext";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";

const httpReq = (url) => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('X-Cisco-Meraki-API-Key', localStorage.getItem('meraki-api-key'));

    const req = new Request(url, {
        method: 'GET',
        headers: headers,
        mode: 'cors',
    });
    return req;
}

const getOrgShard = (contextOrg, orgId) => {
    /* Return shard number of the current Org */
    let shard = '';
    // eslint-disable-next-line array-callback-return
    contextOrg.orgList.map(entry => {
        if (entry.id === orgId) {
            const indexOfPeriod = entry.url.indexOf('.');
            shard = entry.url.substring(8, indexOfPeriod);
            return entry;
        }
    });
    return shard;
}

const getNetworkList = async (
    contextOrg,
    orgId,
    setNetworkList) =>
{
    const shard = await getOrgShard(contextOrg, orgId);
    if (shard !== '') {
        const url = "https://" + shard + ".meraki.com/api/v0/organizations/" + orgId + "/networks";
        setTimeout(() => {
            fetch(httpReq(url))
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw Error(response.statusText);
                    }
                })
                .then(data => {
                    setNetworkList(data);
                })
                .catch(error => {
                    return error;
                });
        }, 750);
    }
}

function filterNetworks(searchColumnIndex) {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("networkFilter");
    filter = input.value.toUpperCase();
    table = document.getElementById("detailedNetworkTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[searchColumnIndex];
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

const OrgHomeBody = (props) => {
    const [contextOrg] = useContext(AppContext);
    const [networkList, setNetworkList] = useState('');

    // Network List Pagination
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(function(){
        if(contextOrg.orgList !== '') {
            getNetworkList(
                contextOrg,
                props.orgId,
                setNetworkList);

        }
    }, [contextOrg]);

    // Network Search filter field
    const [searchColumnIndex, setSearchColumnIndex] = React.useState(1);
    const handleChange = (event) => {
        setSearchColumnIndex(event.target.value);
    };

    return(
        <div>
            <h4>NETWORK LIST</h4>
            <Grid
                container
                spacing={3}
                direction="column">

                <Grid
                    container
                    direction="row"
                    alignItems="flex-start">
                    <Grid xs={5} sm={3} item>
                        <InputLabel shrink id="select-network-search-by-filter">
                            Search By...
                        </InputLabel>
                        <Select
                            labelId="select-network-search-by-filter"
                            value={searchColumnIndex}
                            onChange={handleChange}
                            displayEmpty>
                            <MenuItem value={1}>Network Name</MenuItem>
                            <MenuItem value={2}>Network ID</MenuItem>
                            <MenuItem value={3}>Type</MenuItem>
                            <MenuItem value={4}>Tags</MenuItem>
                        </Select>
                    </Grid>
                    <Grid sm={8} xs={12} item>
                        <TextField
                            id="networkFilter"
                            label="Search"
                            type="search"
                            fullWidth
                            onChange={ () => filterNetworks(searchColumnIndex) }
                            variant="outlined" />
                    </Grid>
                </Grid>

                <Grid item>
                    <TableContainer>
                        <Table id="detailedNetworkTable">
                            <TableHead style={{backgroundColor: '#efed78'}}>
                                <TableRow>
                                    <TableCell align="center" style={{fontWeight: "bold", fontSize: 16}}>S.No</TableCell>
                                    <TableCell align="center" style={{fontWeight: "bold", fontSize: 16}}>Network Name</TableCell>
                                    <TableCell align="center" style={{fontWeight: "bold", fontSize: 16}}>Network ID</TableCell>
                                    <TableCell align="center" style={{fontWeight: "bold", fontSize: 16}}>Type</TableCell>
                                    <TableCell align="center" style={{fontWeight: "bold", fontSize: 16}}>Tags</TableCell>
                                    <TableCell align="center" style={{fontWeight: "bold", fontSize: 16}}>Timezone</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.entries(networkList).map((entry, index) => {
                                    if (index >= rowsPerPage*page && index < rowsPerPage*(page+1)) {
                                        return (
                                            <TableRow key={entry[1].id}>
                                                <TableCell style={{align: "center"}}>{index + 1}</TableCell>
                                                <TableCell style={{align: "center"}}>{entry[1].name}</TableCell>
                                                <TableCell align="center">{entry[1].id}</TableCell>
                                                <TableCell align="center">{entry[1].type}</TableCell>
                                                <TableCell align="center">{(entry[1].tags)}</TableCell>
                                                <TableCell align="left">{entry[1].timeZone}</TableCell>
                                            </TableRow>
                                        )
                                    }
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        component="div"
                        rowsPerPageOptions={[10, 25, 100]}
                        count={networkList.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </Grid>

            </Grid>

        </div>
    );
}

export default OrgHomeBody;