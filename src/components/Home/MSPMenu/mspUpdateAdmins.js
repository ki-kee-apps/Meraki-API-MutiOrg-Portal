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

const getOrgwiseAdminList = (
    appContext,
    orgAdminList,
    setOrgAdminList
) => {
    let updatedOrgAdminList = [];
    appContext.orgList.forEach(async (entry, index) => {
        const shard =  await getOrgShard(appContext, entry.id);
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
                           /* userId: data.id,
                            userName: data.name,
                            orgAccess: data.orgAccess,
                            accountStatus: data.accountStatus,
                            lastActive: data.lastActive,
                            hasApiKey: data.hasApiKey,
                            networks: data.networks,
                            tags: data.tags,*/
                        })
                        if(updatedOrgAdminList.length === appContext.orgList.length)
                            setOrgAdminList(updatedOrgAdminList);
                    })
                    .catch(error => {
                        return error;
                    });
            }, index * 200)
        }
    })
}

const MSPAdmins = (props) => {
    const [appContext] = useContext(AppContext);
    const [orgAdminList, setOrgAdminList] = useState([]);

    useEffect(function () {
        if(appContext.orgList.length > 0){
            getOrgwiseAdminList (
                appContext,
                orgAdminList,
                setOrgAdminList
            )
        }
    }, [appContext])


    return(
        <div>
            <Dialog
                open={props.open}
                onClose={() => props.setShowMSPAdmins(false)}
                fullScreen
                disableEscapeKeyDown
                disableBackdropClick
                style={{maxHeight: '80%', maxWidth: '90%', left: '5%', top: '10%'}}
                scroll='paper'>
                <DialogTitle>Administrators</DialogTitle>

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
                                                customBodyRender: (value) => (
                                                    value.admins && value.admins.forEach(admin => {
                                                        return (
                                                            <p>{admin.email}</p>
                                                        )
                                                    })
                                                )
                                            }
                                        },
                                        {
                                            name: "privileges",
                                            label: "Privileges",
                                            options: {
                                                filter: false,
                                                sort: true,
                                            }
                                        },
                                        {
                                            name: "accountStatus",
                                            label: "Account Status",
                                            options: {
                                                filter: false,
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
                                                filter: false,
                                                sort: true,
                                            }
                                        },
                                        {
                                            name: "tags",
                                            label: "Tags",
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

                                            }
                                        },
                                        {
                                            name: "userId",
                                            label: "User ID",
                                            options: {
                                                filter: false,
                                                sort: true,
                                            },
                                        },
                                    ]}
                                    data={orgAdminList.map(entry => {
                                        console.log(entry.admins);
                                        return (
                                            {
                                                orgName: entry.orgName,
                                                orgId: entry.orgId,
                                                userId: entry.userId,
                                                userName: entry.userName,
                                                privileges: entry.orgAccess,
                                                accountStatus: entry.accountStatus,
                                                lastActive: entry.lastActive,
                                                hasApiKey: entry.hasApiKey,
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
                        onClick={() => props.setShowMSPAdmins(false)}
                        style={{margin: 10}}
                        variant="contained"
                        color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default MSPAdmins;