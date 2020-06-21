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

const MSPClone = (props) => {
    const [appContext] = useContext(AppContext);
    const [orgLicensesList, setOrgLicensesList] = useState([]);

    useEffect(function () {
        if(appContext.orgList.length > 0){
            
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

export default MSPClone;