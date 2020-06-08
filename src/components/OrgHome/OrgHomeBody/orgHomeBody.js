import React, {useContext, useEffect, useState} from "react";
import {AppContext} from "../../Context/appContext";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import Grid from "@material-ui/core/Grid";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";


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
    setNetworkList) => {
    const shard = await getOrgShard(contextOrg, orgId);
    if (shard !== '') {
        const url = contextOrg.proxyURL + "https://" + shard + ".meraki.com/api/v0/organizations/" + orgId + "/networks";
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
        }, 2500);
    }
}

function filterNetworks(unfiltered, columnName, searchString) {
    if (searchString === "") return [...unfiltered]

    // Filter for Tags
    if (columnName === "tags")
        return unfiltered.filter((entry) => {
            let isValidRow = false;
            if (entry[columnName])
                // eslint-disable-next-line array-callback-return
                entry[columnName].toString().split(" ").map(tag => {
                    if (tag.length && tag === searchString)
                        isValidRow = true;
                })
            return isValidRow;
        })

    // Filter for other fields
    return unfiltered.filter((entry) => {
        return (entry[columnName] && entry[columnName].toUpperCase().indexOf(searchString.toUpperCase()) >= 0)
    })
}

const OrgHomeBody = (props) => {
    const [contextOrg] = useContext(AppContext);
    const [networkList, setNetworkList] = useState('');
    const [isNotLoaded, setIsNotLoaded] = useState(true);

    // Initialization
    useEffect(function () {
        if (contextOrg.orgList.length > 0 && isNotLoaded) {
            setIsNotLoaded(false);
            getNetworkList(
                contextOrg,
                props.orgId,
                setNetworkList);
            getNetworkList(
                contextOrg,
                props.orgId,
                setNetworksFiltered);
        }
    }, [contextOrg, isNotLoaded, props.orgId]);

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

    // Network Search filter field
    const [searchString, setSearchString] = useState("");
    const [networksFiltered, setNetworksFiltered] = useState('');
    const [searchColumn, setSearchColumn] = useState("name");
    const handleChange = (event) => {
        setSearchColumn(event.target.value);
        setPage(0);
    };
    useEffect(() => {
            let filteredResults = filterNetworks(networkList, searchColumn, searchString)
            setNetworksFiltered(filteredResults)
        },
        [searchString, searchColumn, networkList])

    return (
        <div>
            <h4 style={{marginTop: 5, marginBottom: 20}}>ORG NETWORKS</h4>
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
                            value={searchColumn}
                            onChange={handleChange}
                            displayEmpty>
                            <MenuItem value={'name'}>Network Name</MenuItem>
                            <MenuItem value={'id'}>Network ID</MenuItem>
                            <MenuItem value={'type'}>Type</MenuItem>
                            <MenuItem value={'tags'}>Tags</MenuItem>
                        </Select>
                    </Grid>
                    <Grid sm={8} xs={12} item>
                        <TextField
                            id="networkFilter"
                            label="Search"
                            type="search"
                            fullWidth
                            value={searchString}
                            onChange={e => setSearchString(e.target.value)}
                            variant="outlined"/>
                    </Grid>
                </Grid>

                <Grid item>
                    <TableContainer>
                        <Table id="detailedNetworkTable" stickyHeader>
                            <TableHead style={{backgroundColor: '#efed78'}}>
                                <TableRow>
                                    <TableCell align="right"
                                               style={{fontWeight: "bold", fontSize: 16}}>S.No</TableCell>
                                    <TableCell align="center" style={{fontWeight: "bold", fontSize: 16, width: 150}}>Network
                                        Name</TableCell>
                                    <TableCell align="center" style={{fontWeight: "bold", fontSize: 16}}>Network
                                        ID</TableCell>
                                    <TableCell align="center"
                                               style={{fontWeight: "bold", fontSize: 16}}>Type</TableCell>
                                    <TableCell align="center"
                                               style={{fontWeight: "bold", fontSize: 16}}>Tags</TableCell>
                                    <TableCell align="center"
                                               style={{fontWeight: "bold", fontSize: 16}}>Timezone</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/* eslint-disable-next-line array-callback-return */}
                                {Object.entries(networksFiltered).map((entry, index) => {
                                    if (index >= rowsPerPage * page && index < rowsPerPage * (page + 1)) {
                                        return (
                                            <TableRow key={entry[1].id}>
                                                <TableCell align="left" style={{width: 90}}>
                                                    <Tooltip title={JSON.stringify(entry[1])} interactive>
                                                        <IconButton size="small">
                                                            <InfoIcon
                                                                fontSize="small"
                                                            />
                                                        </IconButton>
                                                    </Tooltip>
                                                    {(index + 1)}
                                                </TableCell>
                                                <TableCell align="left">{entry[1].name}</TableCell>
                                                <TableCell align="center"
                                                           style={{fontSize: 12}}>{entry[1].id}</TableCell>
                                                <TableCell align="center">{entry[1].type}</TableCell>
                                                <TableCell align='center'>
                                                    {entry[1].tags === null ?
                                                        "" :
                                                        // eslint-disable-next-line array-callback-return
                                                        entry[1].tags.toString().split(" ").map(tag => {
                                                            if (tag.length) {
                                                                return (
                                                                    <Button
                                                                        key={tag}
                                                                        onClick={(e) => {
                                                                            setSearchString(tag);
                                                                            setSearchColumn('tags');
                                                                            setPage(0);
                                                                        }}
                                                                        style={{
                                                                            backgroundColor: '#0c9ed9',
                                                                            color: '#ffffff',
                                                                            fontWeight: 'bold',
                                                                            borderRadius: 3,
                                                                            fontSize: 10,
                                                                            width: 'auto',
                                                                            paddingTop: 0,
                                                                            paddingBottom: 0,
                                                                            paddingLeft: 3,
                                                                            paddingRight: 3
                                                                        }}>
                                                                        {tag}
                                                                    </Button>
                                                                )
                                                            }
                                                        })}
                                                </TableCell>
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
                        rowsPerPageOptions={[5, 25, 100]}
                        count={networksFiltered.length}
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