import React, {useContext, useEffect, useState} from "react";
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
import {AppContext} from "../../../components/Context/appContext";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
import Tooltip from "@material-ui/core/Tooltip";

function filterTemplates(unfiltered, columnName, searchString) {
    if (searchString==="") return [...unfiltered]
    return unfiltered.filter((entry) => {
        return (entry[columnName] && entry[columnName].toString().toUpperCase().indexOf(searchString.toUpperCase())>=0)
    })
}

const ConfigTemplatesDetailed = (props) => {
    const [contextOrg] = useContext(AppContext);
    const [searchString, setSearchString] = useState("");
    const [templatesFiltered, setTemplatesFiltered] = useState([]);
    const [searchColumn, setSearchColumn] = useState("name");
    const handleChange = (event) => {
        setSearchColumn(event.target.value);
    };

    useEffect(() => {
            let filteredResults = filterTemplates(props.templatesList, searchColumn, searchString)
            setTemplatesFiltered(filteredResults)
        },
        [searchString, searchColumn])

    const getNetworkName = (networkId) => {
        let name = "-";
        if (networkId !== '') {
            contextOrg.networkIdToNameMap.map(entry => {
                if (entry.id === networkId)
                    name = entry.name
                return 0;
            })
        }
        return name;
    }

    return (
        <div>
            <Grid
                container
                spacing={3}
                direction="row">
                <Grid item>
                    <InputLabel shrink id="select-device-search-by-filter">
                        Search By...
                    </InputLabel>
                    <Select
                        labelId="select-device-search-by-filter"
                        value={searchColumn}
                        onChange={handleChange}
                        displayEmpty>
                        <MenuItem value={"name"}>Device Name</MenuItem>
                        <MenuItem value={"id"}>ID</MenuItem>
                        <MenuItem value={"productTypes"}>Product</MenuItem>
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
                            <TableCell align='center' style={{fontWeight: "bold", fontSize: 16}}>Name</TableCell>
                            <TableCell align='center' style={{fontWeight: "bold", fontSize: 16}}>ID</TableCell>
                            <TableCell align='center' style={{fontWeight: "bold", fontSize: 16}}>Products</TableCell>
                            <TableCell align='left' style={{fontWeight: "bold", fontSize: 16}}>Timezone</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {templatesFiltered.map((entry, index) => (
                            <TableRow key={index}>
                                <TableCell style={{width: 120}}>
                                    <Tooltip title={JSON.stringify(entry)} interactive>
                                        <IconButton size="small">
                                            <InfoIcon
                                                fontSize="small"
                                            />
                                        </IconButton>
                                    </Tooltip>
                                    {(index+1)}
                                </TableCell>
                                <TableCell align='left' style={{width: 250}}>{entry.name}</TableCell>
                                <TableCell align="center">{entry.id}</TableCell>
                                <TableCell align="center">{
                                    // eslint-disable-next-line array-callback-return
                                    (entry.productTypes.toString().split(",").map(product => {
                                            if (product !== "")
                                                return (
                                                    <Button
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
                                                        }}
                                                        onClick={() => {
                                                            setSearchColumn("productTypes");
                                                            setSearchString(product);
                                                        }}
                                                        color="primary" >
                                                        {product}
                                                    </Button>
                                                );
                                        }
                                    ))
                                }
                                </TableCell>
                                <TableCell align='left' style={{width: 225}}>{entry.timeZone}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default ConfigTemplatesDetailed;