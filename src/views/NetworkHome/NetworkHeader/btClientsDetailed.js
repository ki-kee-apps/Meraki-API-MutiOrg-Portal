import React, { useEffect, useState} from "react";
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
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
import moment from "moment";


function filterBtClients(unfiltered, columnName, searchString) {
    if (searchString==="") return [...unfiltered]
    return unfiltered.filter((entry) => {
        return (entry[columnName] && entry[columnName].toUpperCase().indexOf(searchString.toUpperCase())>=0)
    })
}

const BtClientsDetailed = (props) => {
    const [searchString, setSearchString] = useState("");
    const [btClientsFiltered, setBtClientsFiltered] = useState([]);
    const [searchColumn, setSearchColumn] = useState("deviceName");
    const handleChange = (event) => {
        setSearchColumn(event.target.value);
    };

    useEffect(() => {
            let filteredResults = filterBtClients(props.btClientList, searchColumn, searchString)
            setBtClientsFiltered(filteredResults)
        },
        [searchString, searchColumn])

    return(
        <div>
            <Grid
                container
                spacing={3}
                direction="row">
                <Grid item>
                    <InputLabel shrink>
                        Search By...
                    </InputLabel>
                    <Select
                        value={searchColumn}
                        onChange={handleChange}
                        displayEmpty>
                        <MenuItem value={"deviceName"}>Device Name</MenuItem>
                        <MenuItem value={"manufacturer"}>Manufacturer</MenuItem>
                        <MenuItem value={"mac"}>MAC Address</MenuItem>
                        <MenuItem value={"seenByDeviceMac"}>Seen by</MenuItem>
                    </Select>
                </Grid>
                <Grid item>
                    <TextField
                        label="Search"
                        type="search"
                        value={searchString}
                        onChange={ e =>  setSearchString(e.target.value) }
                        variant="outlined" />
                </Grid>
            </Grid>

            <TableContainer>
                <Table id="detailedDevicedTable">
                    <TableHead style={{backgroundColor: '#efed78'}}>
                        <TableRow>
                            <TableCell style={{fontWeight: "bold", align: "center", fontSize: 16}}>S.No</TableCell>
                            <TableCell align='center' style={{fontWeight: "bold", fontSize: 16}}>Device Name</TableCell>
                            <TableCell align='center' style={{fontWeight: "bold", fontSize: 16}}>MAC Address</TableCell>
                            <TableCell align='center' style={{fontWeight: "bold", fontSize: 16}}>Manufacturer</TableCell>
                            <TableCell align='center' style={{fontWeight: "bold", fontSize: 16}}>Seen By</TableCell>
                            <TableCell align='center' style={{fontWeight: "bold", fontSize: 16}}>Last Seen</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {btClientsFiltered.map((entry, index) => (
                            <TableRow key={index}>
                                <TableCell style={{width: 70}}>
                                    <Tooltip title={JSON.stringify(entry)} interactive>
                                        <IconButton size="small">
                                            <InfoIcon
                                                fontSize="small"
                                            />
                                        </IconButton>
                                    </Tooltip>
                                    {(index+1)}
                                </TableCell>
                                <TableCell align='center' style={{fontWeight: "bold", fontSize: 16}}>{entry.deviceName}</TableCell>
                                <TableCell align='center' style={{fontSize: 14}}>{entry.mac}</TableCell>
                                <TableCell align='center' style={{fontSize: 16}}>{entry.manufacturer}</TableCell>
                                <TableCell align='center' style={{fontSize: 14}}>{entry.seenByDeviceMac}</TableCell>
                                <TableCell align='center' style={{fontSize: 16}}>
                                    {moment.unix(entry.lastSeen).format('MM-DD-YYYY HH:mm')}                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default BtClientsDetailed;