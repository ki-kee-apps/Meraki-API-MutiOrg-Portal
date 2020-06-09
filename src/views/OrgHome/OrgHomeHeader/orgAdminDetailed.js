import React, {useContext, useEffect, useState} from "react";
import moment from "moment";
import Grid from "@material-ui/core/Grid";
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
import {AppContext} from "../../../components/Context/appContext";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from '@material-ui/icons/Info';
import Tooltip from "@material-ui/core/Tooltip";


function filterAdmins(unfiltered, columnName, searchString) {
    if (searchString === "") return [...unfiltered];

    // tags and networks are objects within an object.
    if (columnName === "tags" || columnName === "networks") {
        return unfiltered.filter((entry) => {
            let isValidEntry = false;
            if (entry[columnName].length > 0)
                ((entry[columnName].map((subEntry) => {
                    if (columnName === "tags") {
                        if (subEntry.tag && subEntry.tag.toUpperCase() === (searchString.toUpperCase()))
                            isValidEntry = true;
                    } else if (subEntry.id && subEntry.id.toUpperCase() === (searchString.toUpperCase()))
                        isValidEntry = true;
                    return (subEntry.id && (subEntry.id).indexOf(searchString) >= 0)
                })))
            return isValidEntry;
        })
    }

    // Filter for the rest of the columns
    return unfiltered.filter((entry) => {
        return (entry[columnName] && entry[columnName].toUpperCase().indexOf(searchString.toUpperCase()) >= 0)
    })
}

const OrgAdminsDetailed = (props) => {
    const [contextOrg] = useContext(AppContext);
    const [searchString, setSearchString] = useState("");
    const [adminsFiltered, setAdminsFiltered] = useState([]);
    const [searchColumn, setSearchColumn] = useState("name");
    const handleChange = (event) => {
        setSearchColumn(event.target.value);
    };

    useEffect(() => {
            let filteredResults = filterAdmins(props.orgAdminsDetailed, searchColumn, searchString)
            setAdminsFiltered(filteredResults)
        },
        [searchString, searchColumn])

    const getNetworkName = (networkId) => {
        let name = "-";
        if (networkId !== '') {
            // eslint-disable-next-line array-callback-return
            contextOrg.networkIdToNameMap.map(entry => {
                if (entry.id === networkId) name = entry.name
                else return 0;
            })
        }
        return name;
    }

    return (
        <div>
            <Grid
                container
                spacing={3}
                direction="row"
                justify="left"
                alignItems="flex-start">
                <Grid item>
                    <InputLabel shrink id="select-device-search-by-filter">
                        Search By...
                    </InputLabel>
                    <Select
                        labelId="select-device-search-by-filter"
                        value={searchColumn}
                        onChange={handleChange}
                        displayEmpty
                    >
                        <MenuItem value={'name'}>Name</MenuItem>
                        <MenuItem value={'email'}>Email</MenuItem>
                        <MenuItem value={'orgAccess'}>Org Access Privilege</MenuItem>
                        <MenuItem value={'networks'}>Network Privilege</MenuItem>
                        <MenuItem value={'id'}>User ID</MenuItem>
                        <MenuItem value={'tags'}>Tag</MenuItem>
                    </Select>
                </Grid>
                <Grid sm={8} xs={12} item>
                    <TextField
                        id="deviceFilter"
                        label="Search"
                        type="search"
                        fullWidth
                        value={searchString}
                        onChange={e => setSearchString(e.target.value)}
                        variant="outlined"/>
                </Grid>
            </Grid>

            <TableContainer>
                <Table id="detailedDevicedTable">
                    <TableHead style={{backgroundColor: '#efed78'}}>
                        <TableRow>
                            <TableCell style={{fontWeight: "bold", align: "center", fontSize: 16}}>S.No</TableCell>
                            <TableCell align='center' style={{fontWeight: "bold", fontSize: 16}}>Name</TableCell>
                            <TableCell align='center' style={{fontWeight: "bold", fontSize: 16}}>Email</TableCell>
                            <TableCell style={{fontWeight: "bold", align: "center", fontSize: 16}}>Status</TableCell>
                            <TableCell
                                style={{fontWeight: "bold", align: "center", fontSize: 16}}>Privileges</TableCell>
                            <TableCell align='center' style={{fontWeight: "bold", fontSize: 16, width: 90}}>Last
                                Active</TableCell>
                            <TableCell align='left' style={{fontWeight: "bold", fontSize: 16}}>Tags</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {adminsFiltered.map((entry, index) => (
                            <TableRow key={index} style={{padding: 0}}>
                                <TableCell align="left" style={{width: 90}}>
                                    <Tooltip title={JSON.stringify(entry)} interactive>
                                        <IconButton size="small">
                                            <InfoIcon
                                                fontSize="small"
                                            />
                                        </IconButton>
                                    </Tooltip>
                                    {index + 1}
                                </TableCell>
                                <TableCell align="left">
                                    {entry.name}
                                </TableCell>
                                <TableCell align="left">{entry.email}</TableCell>
                                <TableCell align="center">
                                    <p style={entry.accountStatus === 'ok' ? {
                                            backgroundColor: 'limegreen',
                                            borderRadius: 5
                                        } :
                                        entry.accountStatus === 'unverified' ? {
                                                backgroundColor: 'orange',
                                                borderRadius: 5,
                                                paddingLeft: 3,
                                                paddingRight: 3
                                            } :
                                            {backgroundColor: 'red', borderRadius: 5}}>
                                        {entry.accountStatus}
                                    </p>
                                </TableCell>
                                <TableCell align="left">
                                    <Button
                                        onClick={() => {
                                            setSearchString(entry.orgAccess);
                                            setSearchColumn('orgAccess');
                                        }}
                                        style={{
                                            backgroundColor: 'limegreen',
                                            borderRadius: 3,
                                            fontSize: 10,
                                            paddingTop: 0,
                                            paddingBottom: 0,
                                            paddingLeft: 3,
                                            paddingRight: 3
                                        }}>
                                        {entry.orgAccess === 'none' ? "" : "Org (" + entry.orgAccess + ")"}
                                    </Button>
                                    {(entry.networks).map(nw => {
                                        return <p style={{fontSize: 10}}>
                                            <Button
                                                onClick={() => {
                                                    setSearchString(nw.id);
                                                    setSearchColumn('networks');
                                                }}
                                                style={{
                                                    backgroundColor: 'orange',
                                                    borderRadius: 3,
                                                    fontSize: 10,
                                                    paddingTop: 0,
                                                    paddingBottom: 0,
                                                    paddingLeft: 3,
                                                    paddingRight: 3
                                                }}>
                                                {getNetworkName(nw.id)}
                                            </Button>
                                            ({nw.access})
                                        </p>
                                    })}
                                </TableCell>
                                <TableCell align="center"
                                           style={{fontSize: 10}}>{moment.unix(entry.lastActive).format('MM-DD-YYYY HH:mm')}</TableCell>
                                <TableCell align="left">{
                                    Object.values(entry.tags).length ? (
                                            (entry.tags).map(tag => {
                                                return <p style={{fontSize: 10}}>
                                                    <Button
                                                        onClick={() => {
                                                            setSearchString(tag.tag);
                                                            setSearchColumn('tags');
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
                                                        {tag.tag}
                                                    </Button>
                                                    ({tag.access})
                                                </p>
                                            })) :
                                        "-"
                                }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>

    )
}

export default OrgAdminsDetailed;