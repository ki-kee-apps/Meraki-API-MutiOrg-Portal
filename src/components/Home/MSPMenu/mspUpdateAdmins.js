import React, {useContext, useEffect, useState} from "react";
import {AppContext} from "../../Context/appContext";
import moment from "moment";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import MUIDataTable from "mui-datatables";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";

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

const getOrgwiseAdminList = (
    appContext,
    setOrgAdminList
) => {
    let updatedOrgAdminList = [];
    appContext.orgList.forEach(async (entry, index) => {
        const shard = await getOrgShard(appContext, entry.id);
        if (shard !== '') {
            const url = appContext.proxyURL + "https://" +
                shard + ".meraki.com/api/v0/organizations/" + entry.id + "/admins";
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
                        updatedOrgAdminList.push({
                            orgId: entry.id,
                            orgName: entry.name,
                            admins: data
                        })
                        if (updatedOrgAdminList.length === appContext.orgList.length)
                            setOrgAdminList(updatedOrgAdminList);
                    })
                    .catch(error => {
                        return error;
                    });
            }, index * 200)
        }
    })
}

const flattenAdminList = (orgAdminList, setFlattenedList) => {
    let adminList = [];
    orgAdminList.forEach((entry, index) => {
        Object.entries(entry.admins).forEach(admin => {
            adminList.push(
                {
                    orgName: entry.orgName,
                    orgId: entry.orgId,
                    userId: admin[1].id,
                    email: admin[1].email,
                    userName: admin[1].name,
                    networks: admin[1].networks,
                    tags: admin[1].tags,
                    orgAccess: admin[1].orgAccess,
                    accountStatus: admin[1].accountStatus,
                    lastActive: admin[1].lastActive,
                    hasApiKey: admin[1].hasApiKey.toString(),
                })
        })
        if (index === orgAdminList.length - 1) {
            setFlattenedList(adminList);
        }
    })
}

const setNetworksContext = (
    appContext,
    setAppContext) => {
    let networkIdToNameMap = [];
    appContext.orgList.forEach(async (org, index) => {
        const shard = await getOrgShard(appContext, org.id);
        if (shard !== '') {
            const url = appContext.proxyURL + "https://" + shard + ".meraki.com/api/v0/organizations/" + org.id + "/networks";
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
                        data.forEach(entry => {
                            networkIdToNameMap.push({orgId: org.id, id: entry.id, name: entry.name})
                        })
                    })
                    .catch(error => {
                        return error;
                    });
            }, index * 200);
        }
        if (index === appContext.orgList.length - 1)
            setAppContext({allOrgAllNetworkList: networkIdToNameMap});
    })
}

const setupAdminPrivileges = (
    appContext,
    updateAdminName,
    updateAdminEmail,
    flattenedList,
    setConfirmedAdminPrivileges,
    setShowUpdateDialog,
    setShowConfirmUpdateDialog,
    setShowLoadingProgress
) => {
    // seshagirirao1992@gmail.com
    // Setup the initial blank org-networks object
    let orgNetworkPrivileges = [];
    appContext.orgList.forEach(org => {
        let networkPrivileges = appContext.allOrgAllNetworkList.filter(network => {
            return org.id === network.orgId
        });
        orgNetworkPrivileges.push(
            {
                orgId: org.id,
                orgName: org.name,
                orgAccess: 'none',
                accountStatus: 'ok',
                networks: networkPrivileges.map(network => {
                    return {id: network.id, name: network.name, access: 'none'};
                })
            })

        if (orgNetworkPrivileges.length === appContext.orgList.length) {
            console.log(orgNetworkPrivileges)
            setShowConfirmUpdateDialog(true);
            setShowUpdateDialog(false);
            setShowLoadingProgress(false);
            setConfirmedAdminPrivileges(orgNetworkPrivileges);
        }
    })

    // Set the Initial Privileges


    // Enable submit

    /*let currentAdminPrivileges = [];
    flattenedList.forEach((entry, index) => {
        console.log(entry)
        if (updateAdminEmail.toLowerCase() === entry.email.toLowerCase()) {
            currentAdminPrivileges.push(entry);
        }
        if (index === flattenedList.length - 1) {
            setShowConfirmUpdateDialog(true);
            setShowUpdateDialog(false);
            setTimeout(() => {
                setConfirmedAdminPrivileges([...appContext.allOrgAllNetworkList, currentAdminPrivileges]);
                setShowLoadingProgress(false);
            }, 2000)
        }
    })*/
}

const MSPAdmins = (props) => {
    const [appContext, setAppContext] = useContext(AppContext);
    const [orgAdminList, setOrgAdminList] = useState([]);

    // Full List of All Org Admins across all Orgs
    const [flattenedList, setFlattenedList] = useState([]);
    const [isNotLoaded, setIsNotLoaded] = useState(true);

    const getNetworkName = (networkId) => {
        let name = "-";
        if (networkId !== '') {
            appContext.allOrgAllNetworkList.map(entry => {
                if (entry.id === networkId)
                    name = entry.name
                return 0;
            })
        }
        return name;
    }

    useEffect(function () {
        if (appContext.orgList.length > 0 && isNotLoaded) {
            setIsNotLoaded(false);
            getOrgwiseAdminList(
                appContext,
                setOrgAdminList
            );
        }
    }, [appContext])

    useEffect(function () {
        if (orgAdminList.length) {
            flattenAdminList(orgAdminList, setFlattenedList);
            setNetworksContext(appContext, setAppContext)
        }
    }, [orgAdminList])

    // Update Dialog
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const [showLoadingProgress, setShowLoadingProgress] = useState(false);
    const [showConfirmUpdateDialog, setShowConfirmUpdateDialog] = useState(false);
    const [updateAdminName, setUpdateAdminName] = useState('');
    const [updateAdminEmail, setUpdateAdminEmail] = useState('');
    const [confirmedAdminPrivileges, setConfirmedAdminPrivileges] = useState([]);

    return (
        <div>
            <Dialog
                open={props.open}
                onClose={() => props.setShowMSPAdmins(false)}
                fullScreen
                disableEscapeKeyDown
                disableBackdropClick
                style={{maxHeight: '80%', maxWidth: '90%', left: '5%', top: '10%'}}
                scroll='paper'>
                <DialogTitle>
                    Administrators
                    <Button
                        onClick={() => setShowUpdateDialog(true)}
                        style={{margin: 10, alignContent: 'center'}}
                        variant="contained"
                        color="secondary">
                        ADD - REMOVE - UPDATE ADMIN
                    </Button>
                </DialogTitle>

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
                                            name: "orgName",
                                            label: "Org Name",
                                            options: {
                                                filter: false,
                                                sort: true,
                                            }
                                        },
                                        {
                                            name: "userName",
                                            label: "Name",
                                            options: {
                                                filter: false,
                                                sort: true,
                                            }
                                        },
                                        {
                                            name: "email",
                                            label: "Email",
                                            options: {
                                                filter: false,
                                                sort: true,
                                            }
                                        },
                                        {
                                            name: "orgAccess",
                                            label: "Org Access",
                                            options: {
                                                filter: true,
                                                sort: true,
                                            }
                                        },
                                        {
                                            name: "accountStatus",
                                            label: "Account Status",
                                            options: {
                                                filter: true,
                                                sort: true,
                                            }
                                        },
                                        {
                                            name: "lastActive",
                                            label: "Last Active",
                                            options: {
                                                filter: false,
                                                sort: true,
                                            }
                                        },
                                        {
                                            name: "hasApiKey",
                                            label: "API Key",
                                            options: {
                                                filter: true,
                                                sort: true,
                                            }
                                        },
                                        {
                                            name: "networks",
                                            label: "Networks",
                                            options: {
                                                filter: false,
                                                sort: false,
                                                display: 'excluded',
                                            }
                                        },
                                        {
                                            name: "tags",
                                            label: "Tags",
                                            options: {
                                                filter: false,
                                                sort: false,
                                                display: 'excluded',
                                            }
                                        },
                                    ]}
                                    data={flattenedList.map(entry => {
                                        return (
                                            {
                                                orgName: entry.orgName,
                                                orgId: entry.orgId,
                                                userId: entry.userId,
                                                email: entry.email,
                                                userName: entry.userName,
                                                networks: entry.networks,
                                                tags: entry.tags,
                                                orgAccess: entry.orgAccess,
                                                accountStatus: entry.accountStatus.toUpperCase(),
                                                lastActive: moment.unix(entry.lastActive).format('YYYY-MM-DD HH:mm'),
                                                hasApiKey: entry.hasApiKey,
                                            }
                                        )
                                    })}
                                    options={{
                                        filterType: 'dropdown',
                                        selectableRowsHideCheckboxes: true,
                                        selectableRowsHeader: false,
                                        expandableRows: true,
                                        expandableRowsHeader: false,
                                        setRowProps: () => {
                                            return {style: {maxHeight: 5}}
                                        },
                                        renderExpandableRow: (rowData, rowMeta) => {
                                            if (rowData[7].length > 0)
                                                return (
                                                    <TableRow style={{
                                                        backgroundColor: 'rgba(193,193,193,0.24)',
                                                        width: '100%'
                                                    }}>
                                                        <TableCell colSpan={8}>
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell/>
                                                                    <TableCell/>
                                                                    <TableCell colSpan={2}
                                                                               style={{align: "center"}}>Network/Tag</TableCell>
                                                                    <TableCell colSpan={3} style={{align: "center"}}>Network
                                                                        ID</TableCell>
                                                                    <TableCell colSpan={2}>Access</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {rowData[7].map((entry) => (
                                                                    <TableRow style={{height: 30}}>
                                                                        <TableCell/>
                                                                        <TableCell/>
                                                                        <TableCell colSpan={2} style={{align: "left"}}>
                                                                            {getNetworkName(entry.id.toString())}
                                                                        </TableCell>
                                                                        <TableCell colSpan={3} style={{align: "left"}}>
                                                                            {entry.id.toString()}
                                                                        </TableCell>
                                                                        <TableCell colSpan={2} align="center">
                                                                            {entry.access}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                                {rowData[8].map((entry) => (
                                                                    <TableRow>
                                                                        <TableCell/>
                                                                        <TableCell/>
                                                                        <TableCell colSpan={2} style={{align: "left"}}>
                                                                            {entry.tag}
                                                                        </TableCell>
                                                                        <TableCell colSpan={3}/>
                                                                        <TableCell colSpan={2} align="left">
                                                                            {entry.access}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                        },
                                    }}
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => props.setShowMSPAdmins(false)}
                        style={{margin: 10}}
                        variant="contained"
                        color="primary">
                        Close
                    </Button>
                </DialogActions>

            </Dialog>

            <Dialog
                open={showUpdateDialog}
                onClose={() => setShowUpdateDialog(false)}
                fullScreen
                disableEscapeKeyDown
                disableBackdropClick
                style={{maxHeight: '40%', maxWidth: '30%', left: '35%', top: '30%'}}
                scroll='paper'>
                <DialogTitle>
                    ADD - REMOVE - UPDATE ADMIN
                </DialogTitle>

                <DialogContent>
                    <p style={{fontSize: 12, color: 'grey'}}>
                        Make sure the user is already a dashboard admin and account is not locked
                    </p>
                    <TextField
                        label="Admin Name"
                        helperText="* Required"
                        variant="outlined"
                        maxLength={30}
                        value={updateAdminName}
                        onChange={e => setUpdateAdminName(e.target.value)}
                    />
                    <p/>
                    <TextField
                        label="Admin Email"
                        helperText="* Required"
                        variant="outlined"
                        type='email'
                        maxLength={50}
                        value={updateAdminEmail}
                        onChange={e => setUpdateAdminEmail(e.target.value)}
                    />

                    <Backdrop
                        style={{zIndex: 4, color: '#fff',}}
                        open={showLoadingProgress}>
                        <CircularProgress color="secondary"/>
                    </Backdrop>

                </DialogContent>

                <DialogActions>
                    <div style={{width: '100%'}}>
                        <Button
                            onClick={() => {
                                setShowLoadingProgress(true);
                                setupAdminPrivileges(
                                    appContext,
                                    updateAdminName,
                                    updateAdminEmail,
                                    flattenedList,
                                    setConfirmedAdminPrivileges,
                                    setShowUpdateDialog,
                                    setShowConfirmUpdateDialog,
                                    setShowLoadingProgress
                                );
                            }}
                            disabled={
                                updateAdminName.length === 0 ||
                                updateAdminEmail.length === 0 ||
                                !(/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/).test(updateAdminEmail)
                            }
                            style={{margin: 10}}
                            variant="contained"
                            color="primary">
                            Check User
                        </Button>
                        <Button
                            onClick={() => setShowUpdateDialog(false)}
                            style={{margin: 10}}
                            variant="contained"
                            color="secondary">
                            Cancel
                        </Button>
                    </div>
                </DialogActions>
            </Dialog>


            <Dialog
                open={showConfirmUpdateDialog}
                onClose={() => setShowConfirmUpdateDialog(false)}
                fullScreen
                disableEscapeKeyDown
                disableBackdropClick
                style={{maxHeight: '60%', maxWidth: '70%', left: '15%', top: '20%'}}
                scroll='paper'>
                <DialogTitle>
                    ADD - REMOVE - UPDATE ADMIN
                </DialogTitle>

                <DialogContent>
                    <p>Name: {updateAdminName}</p>
                    <p>Email: {updateAdminEmail}</p>
                    <Paper variant="outlined">
                        <MUIDataTable
                            columns={[
                                {
                                    name: "orgName",
                                    label: "Org Name",
                                    options: {
                                        filter: false,
                                        sort: true,
                                    }
                                },
                                {
                                    name: "orgId",
                                    label: "Org ID",
                                    options: {
                                        filter: false,
                                        sort: true,
                                        display: 'excluded',
                                    }
                                },
                                {
                                    name: "orgAccess",
                                    label: "Org Access",
                                    options: {
                                        filter: true,
                                        sort: true,
                                        customBodyRender: value => {
                                            return (
                                                <Select
                                                    native
                                                    onChange={e => value=e.target.value}
                                                    defaultValue={value}
                                                    inputProps={{name: 'age',}}>
                                                    <option value={'none'}>None</option>
                                                    <option value={'full'}>Full</option>
                                                    <option value={'read-only'}>Ready Only</option>
                                                </Select>
                                            )
                                        }
                                    }
                                },
                                {
                                    name: "accountStatus",
                                    label: "Account Status",
                                    options: {
                                        filter: true,
                                        sort: true,
                                    }
                                },
                                {
                                    name: "networks",
                                    label: "Networks",
                                    options: {
                                        filter: false,
                                        sort: true,
                                        display: 'excluded',
                                    }
                                },
                            ]}
                            data={
                                confirmedAdminPrivileges.map(entry => {
                                    return (
                                        {
                                            orgName: entry.orgName,
                                            orgId: entry.orgId,
                                            orgAccess: entry.orgAccess,
                                            networks: entry.networks,
                                        })
                                })
                            }
                            options={{
                                filterType: 'dropdown',
                                selectableRowsHideCheckboxes: true,
                                selectableRowsHeader: false,
                                rowsPerPage: 5,
                                rowsPerPageOptions: [5, 20, 100, 300],
                                expandableRows: true,
                                expandableRowsHeader: false,
                                renderExpandableRow: (rowData, rowMeta) => {
                                    return (
                                        <TableRow style={{backgroundColor: 'rgba(193,193,193,0.24)', width: '100%'}}>
                                            <TableCell colSpan={8}>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell/>
                                                        <TableCell/>
                                                        <TableCell colSpan={2} style={{align: "center"}}>Network
                                                            Name</TableCell>
                                                        <TableCell colSpan={3} style={{align: "center"}}>Network
                                                            ID</TableCell>
                                                        <TableCell colSpan={2}>Access</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {rowData[4].map((entry) => {
                                                        return (
                                                            <TableRow style={{height: 30}}>
                                                                <TableCell/>
                                                                <TableCell/>
                                                                <TableCell colSpan={2} style={{align: "left"}}>
                                                                    {getNetworkName(entry.id.toString())}
                                                                </TableCell>
                                                                <TableCell colSpan={3} style={{align: "left"}}>
                                                                    {entry.id.toString()}
                                                                </TableCell>
                                                                <TableCell colSpan={2} align="center">
                                                                    <FormControl>
                                                                        <Select
                                                                            native
                                                                            defaultValue={entry.access}
                                                                            inputProps={{name: 'age',}}>
                                                                            <option value={'none'}>None</option>
                                                                            <option value={'full'}>Full</option>
                                                                            <option value={'read-only'}>Ready Only</option>
                                                                            <option value={'monitor-only'}>Monitor Only
                                                                            </option>
                                                                        </Select>
                                                                    </FormControl>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    })}
                                                </TableBody>
                                            </TableCell>
                                        </TableRow>
                                    )
                                },
                            }}
                        />
                    </Paper>
                </DialogContent>

                <DialogActions>
                    <Button
                        style={{margin: 10}}
                        variant="contained"
                        color="primary">
                        Submit
                    </Button>
                    <Button
                        onClick={() => setShowConfirmUpdateDialog(false)}
                        style={{margin: 10}}
                        variant="contained"
                        color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default MSPAdmins;