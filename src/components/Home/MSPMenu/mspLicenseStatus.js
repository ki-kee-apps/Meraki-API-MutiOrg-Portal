import React, {useContext, useEffect, useState} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Button from "@material-ui/core/Button";
import MUIDataTable from "mui-datatables";
import DialogActions from "@material-ui/core/DialogActions";
import {AppContext} from "../../Context/appContext";

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

const getLicenseStatus = (
    appContext,
    orgLicensesList,
    setOrgLicensesList) =>
{
    let updatedOrgLicenseList = [];
    //console.log(appContext.orgList)
    appContext.orgList.forEach(async (entry, index) => {
        //console.log(entry.id)

        const shard =  await getOrgShard(appContext, entry.id);
        if (shard !== '') {
            const url = appContext.proxyURL + "https://" +
                shard + ".meraki.com/api/v0/organizations/" + entry.id + "/licenseState";
            await setTimeout(() => {
                fetch(httpReq(url))
                    .then(response => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            throw Error(response.statusText);
                        }
                    })
                    .then(data => {
                        const indexOfUInExpiry = data['expirationDate'].indexOf('U');
                        let expiryDate = 'N/A';
                        if(indexOfUInExpiry > 0)
                            expiryDate = data['expirationDate'].substring(0, indexOfUInExpiry - 1);
                        updatedOrgLicenseList.push({
                            id: entry.id,
                            name: entry.name,
                            status: data.status,
                            expirationDate: expiryDate,
                            licensedDeviceCount: data.licensedDeviceCount,
                        })
                        if(updatedOrgLicenseList.length === appContext.orgList.length)
                            setOrgLicensesList(updatedOrgLicenseList);
                    })
                    .catch(error => {
                        return error;
                    });
            }, index * 200)
        }
    })
}

const MSPLicenseStatus = (props) => {
    const [appContext] = useContext(AppContext);
    const [orgLicensesList, setOrgLicensesList] = useState([]);

    useEffect(function () {
        if(appContext.orgList.length > 0){
            getLicenseStatus(
                appContext,
                orgLicensesList,
                setOrgLicensesList)
        }
    }, [appContext])

    return(
        <div>
            <Dialog
                open={props.open}
                onClose={() => props.setShowMSPLicenseStatus(false)}
                fullScreen
                disableEscapeKeyDown
                disableBackdropClick
                style={{maxHeight: '80%', maxWidth: '90%', left: '5%', top: '10%'}}
                scroll='paper'>
                <DialogTitle>License Status</DialogTitle>

                <DialogContent>
                    <Grid
                        container
                        spacing={5}
                        direction="row"
                        justify="center"
                        alignItems="flex-start">

                        <Grid item>
                            <Paper variant="outlined">
                                <MUIDataTable
                                    columns={[
                                        {
                                            name: "name",
                                            label: "Org Name",
                                            options: {
                                                filter: false,
                                                sort: true,
                                            }
                                        },
                                        {
                                            name: "id",
                                            label: "Org ID",
                                            options: {
                                                filter: false,
                                                sort: true,
                                            }
                                        },
                                        {
                                            name: "status",
                                            label: "License Status",
                                            options: {
                                                filter: true,
                                                sort: true,
                                            },
                                        },
                                        {
                                            name: "expirationDate",
                                            label: "Expiry Date",
                                            options: {
                                                filter: false,
                                                sort: true,
                                            }
                                        },
                                    ]}
                                    data={orgLicensesList.map(entry => {
                                        return (
                                            {
                                                name: entry.name,
                                                id: entry.id,
                                                status: entry.status.toUpperCase()==='OK' ?
                                                        <p style={{backgroundColor: 'limegreen', width: 'auto'}}>{entry.status}</p> :
                                                        <p style={{backgroundColor: 'red'}}>{entry.status}</p>,
                                                expirationDate: entry.expirationDate
                                            })
                                    })}
                                    options={{
                                        filterType: 'dropdown',
                                        selectableRowsHideCheckboxes: true,
                                        selectableRowsHeader: false,
                                    }}
                                />
                            </Paper>
                        </Grid>

                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => props.setShowMSPLicenseStatus(false)}
                        style={{margin: 10}}
                        variant="contained"
                        color="primary">
                        Done
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default MSPLicenseStatus;