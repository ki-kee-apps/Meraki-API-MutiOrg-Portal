import React from "react";
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

function filterDevices(searchColumnIndex) {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("deviceFilter");
    filter = input.value.toUpperCase();
    table = document.getElementById("detailedDevicedTable");
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

const DeviceDetailed = (props) => {
    const [searchColumnIndex, setSearchColumnIndex] = React.useState(1);
    const handleChange = (event) => {
        setSearchColumnIndex(event.target.value);
    };

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
                        value={searchColumnIndex}
                        onChange={handleChange}
                        displayEmpty
                    >
                        <MenuItem value={1}>Device Name</MenuItem>
                        <MenuItem value={2}>MAC Address</MenuItem>
                        <MenuItem value={3}>Serial Number</MenuItem>
                        <MenuItem value={4}>Network</MenuItem>
                        <MenuItem value={5}>Model</MenuItem>
                        <MenuItem value={6}>Tag</MenuItem>
                    </Select>
                </Grid>
                <Grid item>
                    <TextField
                        id="deviceFilter"
                        label="Search"
                        type="search"
                        onChange={ () => filterDevices(searchColumnIndex) }
                        variant="outlined" />
                </Grid>
            </Grid>

            <TableContainer>
                <Table id="detailedDevicedTable">
                    <TableHead style={{backgroundColor: '#efed78'}}>
                        <TableRow>
                            <TableCell style={{fontWeight: "bold", align: "center", fontSize: 16}}>S.No</TableCell>
                            <TableCell style={{fontWeight: "bold", align: "center", fontSize: 16}}>Name</TableCell>
                            <TableCell style={{fontWeight: "bold", align: "center", fontSize: 16}}>MAC Address</TableCell>
                            <TableCell style={{fontWeight: "bold", align: "center", fontSize: 16}}>Serial</TableCell>
                            <TableCell style={{fontWeight: "bold", align: "center", fontSize: 16}}>Network</TableCell>
                            <TableCell style={{fontWeight: "bold", align: "center", fontSize: 16}}>Model</TableCell>
                            <TableCell style={{fontWeight: "bold", align: "center", fontSize: 16}}>Tags</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.deviceDetailed.map((entry, index) => (
                            <TableRow key={index}>
                                <TableCell style={{align: "center"}}>{index+1}</TableCell>
                                <TableCell style={{align: "center"}}>{entry.name}</TableCell>
                                <TableCell align="center">{entry.mac}</TableCell>
                                <TableCell style={{minWidth: 90}}>{entry.serial}</TableCell>
                                <TableCell align="center">{entry.networkId}</TableCell>
                                <TableCell align="center">{entry.model}</TableCell>
                                <TableCell align="center">{Object.values(entry.tags)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default DeviceDetailed;