import React, {useContext, useEffect, useRef, useState} from "react";
import Paper from "@material-ui/core/Paper";
import {AppContext} from "../../Context/appContext";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DeviceDetailed from "../../../views/OrgHome/OrgHomeHeader/deviceInventoryDetailed";

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

const getNumberOfDevices = async (
    contextOrg,
    orgId,
    setNumberOfDevices,
    setOrgInventory) =>
{
    const shard = await getOrgShard(contextOrg, orgId);
    if (shard !== '') {
        const url = "https://" + shard + ".meraki.com/api/v0/organizations/" + orgId + "/devices";
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
                    setOrgInventory(data);
                    setNumberOfDevices(Object.keys(data).length);
                })
                .catch(error => {
                    return error;
                });
        }, 1000);
    }
}

const DevicesSummary = (props) => {
    const [contextOrg] = useContext(AppContext);
    const [numberOfDevices, setNumberOfDevices] = useState();
    const [orgInventory, setOrgInventory] = useState();

    useEffect(function() {
        if(contextOrg.orgList !== '') {
            getNumberOfDevices(
            contextOrg,
            props.orgId,
            setNumberOfDevices,
            setOrgInventory);
        }
    },[contextOrg]);

    // Handle Open Device Details Dialog
    const [open, setOpen] = useState(false);
    const [scroll, setScroll] = useState('paper');
    const handleClickOpen = (scrollType) => () => {
        setOpen(true);
        setScroll(scrollType);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const descriptionElementRef = useRef(null);
    useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    return(
        <div style={{ cursor: 'pointer' }}>
            <Paper
                style={{height: 200, width: 170}}
                onClick={handleClickOpen('paper')}
                variant="outlined">
                <h3 style={{paddingLeft: 20, paddingRight: 20, fontSize: 30}}>Devices</h3>

                <h1 style={{fontSize: 50}}>{numberOfDevices}</h1>
            </Paper>

            <Dialog
                open={open}
                onClose={handleClose}
                style={{maxHeight: 750}}
                scroll={scroll}>
                <DialogTitle id="scroll-dialog-title">License Info</DialogTitle>

                <DialogContent dividers={scroll === 'paper'}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}>

                        <DeviceDetailed orgId={props.orgId} deviceDetailed={orgInventory} />
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} color="primary">Done</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default DevicesSummary;