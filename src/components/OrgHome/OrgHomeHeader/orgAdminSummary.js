import React, {useContext, useEffect, useRef, useState} from "react";
import Paper from "@material-ui/core/Paper";
import {AppContext} from "../../Context/appContext";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DeviceDetailed from "../../../views/OrgHome/OrgHomeHeader/deviceInventoryDetailed";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";

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

const getNumberOfAdmins = async (
    contextOrg,
    orgId,
    setNumberOfAdmins,
    setOrgAdmins) =>
{
    const shard = await getOrgShard(contextOrg, orgId);
    if (shard !== '') {
        const url = "https://" + shard + ".meraki.com/api/v0/organizations/" + orgId + "/admins";
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
                    setOrgAdmins(data);
                    setNumberOfAdmins(Object.keys(data).length);
                })
                .catch(error => {
                    return error;
                });
        }, 1250);
    }
}

const OrgAdminSummary = (props) => {
    const [contextOrg] = useContext(AppContext);
    const [numberOfAdmins, setNumberOfAdmins] = useState();
    const [orgAdmins, setOrgAdmins] = useState();

    useEffect(function() {
        if(contextOrg.orgList !== '') {
            getNumberOfAdmins(
                contextOrg,
                props.orgId,
                setNumberOfAdmins,
                setOrgAdmins);
        }
    },[contextOrg]);

    // Handle Open Admin Details Dialog
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
                variant="outlined">
                <h3 style={{paddingLeft: 20, paddingRight: 20, fontSize: 30}}> Admins</h3>
                <h1 style={{fontSize: 50}}>{numberOfAdmins}</h1>
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

{/*
                        <DeviceDetailed orgId={props.orgId} deviceDetailed={orgAdmins} />
*/}
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} color="primary">Done</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default OrgAdminSummary;