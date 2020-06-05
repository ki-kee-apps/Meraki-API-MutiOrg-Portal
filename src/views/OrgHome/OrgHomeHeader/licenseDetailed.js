import React from "react";
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";

const LicenseDetailed = (props) => {

    const licensedDevices = Object.entries(props.licensedDevices);

    return (
        <TableContainer>
            <Table>
                <TableHead style={{backgroundColor: '#efed78'}}>
                    <TableRow>
                        <TableCell style={{fontWeight: "bold", align: "center", fontSize: 16}}>DEVICES</TableCell>
                        <TableCell style={{fontWeight: "bold", align: "center", fontSize: 16}}>LICENSES</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {licensedDevices.map((entry) => (
                        <TableRow key={entry[0]}>
                            <TableCell style={{align: "center"}}>
                                {entry[0]}
                            </TableCell>
                            <TableCell align="center">{entry[1]}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default LicenseDetailed;