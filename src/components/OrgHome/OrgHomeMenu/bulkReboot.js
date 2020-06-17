import React, {useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../../Context/appContext";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import MUIDataTable from "mui-datatables";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import NotInterestedIcon from '@material-ui/icons/NotInterested';

const httpReq = (url) => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('X-Cisco-Meraki-API-Key', localStorage.getItem('meraki-api-key'));

    const req = new Request(url, {
        method: 'POST',
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

const submitRebootDevices = async (
    contextOrg,
    orgId,
    rebootList,
    setRebootList) => {
    const shard = await getOrgShard(contextOrg, orgId);
    if (shard !== '') {
        let listAfterReboot = [];
        const listBeforeReboot = [...rebootList];

        // eslint-disable-next-line array-callback-return
        listBeforeReboot.forEach((entry, index) => {
            const url = contextOrg.proxyURL + "https://" + shard +
                ".meraki.com/api/v0/networks/" + entry.networkId +
                "/devices/" + entry.serial + "/reboot";
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
                        setRebootList([...listAfterReboot, ({
                            serial: entry.serial,
                            networkId: entry.networkId,
                            model: entry.model,
                            success: data.success === true ? 'Complete' : 'Failed',
                            rebootStatus: data.success === true ?
                                <CheckCircleIcon style={{color: "limegreen"}}/> :
                                <NotInterestedIcon style={{color: 'red'}}/>
                        })])
                        listAfterReboot.push({
                            serial: entry.serial,
                            networkId: entry.networkId,
                            model: entry.model,
                            success: data.success === true ? 'Complete' : 'Failed',
                            rebootStatus: data.success === true ?
                                <CheckCircleIcon style={{color: "limegreen"}}/> :
                                <NotInterestedIcon style={{color: 'red'}}/>
                        });
                    })
                    .catch(error => {
                        return error;
                    });
            }, index * 500);
        })
    }
}

const addRebootListItem = (serialsList, orgDeviceInventory, rebootList, setRebootList) => {
    const serialsArray = serialsList.toString().split("\n");
    let updatedSerialsArray = []
    let isValidReq = 0;
    let currentNetworkId = '';
    serialsArray.map(newSerial => {
        if (!rebootList.some(row => row.serial.toUpperCase() === newSerial.toUpperCase()))
            orgDeviceInventory.map(entry => {
                isValidReq = 0;
                if (entry.serial.toString().toUpperCase() === newSerial.trimEnd().toUpperCase() &&
                    newSerial.trimEnd().length === 14) {
                    if (entry.networkId !== null && entry.networkId !== '') {
                        currentNetworkId = entry.networkId;
                        isValidReq = 1;
                        updatedSerialsArray.push({
                            serial: newSerial,
                            networkId: currentNetworkId,
                            model: entry.model,
                            success: '-',
                            rebootStatus: 'Pending'
                        });
                    }
                }
            })
    })
    updatedSerialsArray = rebootList.concat(updatedSerialsArray)
    setRebootList(updatedSerialsArray);
}

const BulkReboot = (props) => {
    const [contextOrg] = useContext(AppContext);
    const [orgDeviceInventory, setOrgDeviceInventory] = useState();
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

    // User Uploaded list of devices to be rebooted
    const [rebootList, setRebootList] = useState([]);
    const [textAreaSerials, setTextAreaSerials] = useState([]);

    // Initialize
    useEffect(function () {
        props.setShowBulkReboot(props.open);
        setOrgDeviceInventory(props.orgDeviceList);
    }, [props.open, props.orgDeviceList]);

    // Static Org Device Inventory
    const descriptionElementRef = useRef(null);
    useEffect(() => {
        if (props.open) {
            const {current: descriptionElement} = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [props.open]);

    return (
        <div>
            <Dialog
                open={props.open}
                onClose={() => props.setShowBulkReboot(false)}
                fullScreen
                disableEscapeKeyDown
                disableBackdropClick
                style={{maxHeight: '80%', maxWidth: '90%', left: '5%', top: '10%'}}
                scroll='paper'>
                <DialogTitle>Bulk Reboot Devices</DialogTitle>

                <DialogContent>
                    <Grid
                        container
                        spacing={5}
                        direction="row"
                        justify="center"
                        alignItems="flex-start">
                        <Grid item>
                            <input
                                type="file"
                                onChange={e => {
                                    if (e.target.files.length)
                                        (e.target.files[0].text()
                                            .then(data => {
                                                addRebootListItem(
                                                    data.toString(),
                                                    orgDeviceInventory,
                                                    rebootList,
                                                    setRebootList
                                                );
                                            }))
                                }}
                                accept='text/csv'/>
                            <Grid item>
                                <a href='src/assets/files/serials.csv' download='serials.csv'>Download Sample file</a>
                            </Grid>
                            <Paper variant="outlined">
                                <TextareaAutosize style={{width: '100%', minHeight: 300}}
                                                  value={textAreaSerials}
                                                  onChange={e => setTextAreaSerials(e.target.value)}
                                                  placeholder="One Serial Per Line"/>
                            </Paper>

                            <Button
                                style={{margin: 10}}
                                onClick={() => {
                                    addRebootListItem(
                                        textAreaSerials,
                                        orgDeviceInventory,
                                        rebootList,
                                        setRebootList
                                    );
                                }}
                                variant="contained"
                                color="primary"
                                component="span">
                                Process Serials
                            </Button>
                        </Grid>

                        <Grid item>
                            <Paper variant="outlined">
                                <MUIDataTable
                                    title='DEVICES TO BE REBOOTED'
                                    columns={[
                                        {
                                            name: "serial",
                                            label: "Serial",
                                            options: {
                                                filter: false,
                                                sort: true,
                                            }
                                        },
                                        {
                                            name: "network",
                                            label: "Network",
                                            options: {
                                                filter: true,
                                                sort: true,
                                            }
                                        },
                                        {
                                            name: "model",
                                            label: "Model",
                                            options: {
                                                filter: true,
                                                sort: true,
                                            }
                                        },
                                        {
                                            name: "success",
                                            label: "Success",
                                            options: {
                                                filter: true,
                                                sort: true,
                                            }
                                        },
                                        {
                                            name: "status",
                                            label: "Status",
                                            options: {
                                                filter: true,
                                                sort: true,
                                            }
                                        }
                                    ]}
                                    data={rebootList.map(entry => {
                                        return (
                                            {
                                                serial: entry.serial,
                                                network: getNetworkName(entry.networkId),
                                                model: entry.model,
                                                success: entry.success,
                                                status: entry.rebootStatus
                                            })
                                    })}
                                    options={{
                                        filterType: 'dropdown',
                                        selectableRowsHideCheckboxes: true,
                                        selectableRowsHeader: false,
                                    }}
                                />
                            </Paper>

                            <Button
                                style={{margin: 10}}
                                variant="contained"
                                onClick={() => {
                                    submitRebootDevices(
                                        contextOrg,
                                        props.orgId,
                                        rebootList,
                                        setRebootList
                                    );
                                }}
                                disabled={rebootList.length === 0}
                                color="primary"
                                component="span">
                                Reboot
                            </Button>
                            <Button
                                onClick={() => props.setShowBulkReboot(false)}
                                style={{margin: 10}}
                                variant="contained"
                                color="secondary"
                                component="span">
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default BulkReboot;