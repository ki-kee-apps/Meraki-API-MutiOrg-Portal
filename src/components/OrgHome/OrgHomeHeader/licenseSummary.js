import React, {useContext, useEffect, useRef, useState} from "react";
import Paper from "@material-ui/core/Paper";
import {AppContext} from "../../Context/appContext";
import LicenseDetailed from "../../../views/OrgHome/OrgHomeHeader/licenseDetailed";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

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

const getLicenseStatus = async (
    contextOrg,
    orgId,
    setIsLicenseCompliant,
    setLicenseType,
    setLicenseExpiry,
    setLicensedDevices) =>
{
    const shard = await getOrgShard(contextOrg, orgId);
    if (shard !== '') {
        const url = "https://" + shard + ".meraki.com/api/v0/organizations/" + orgId + "/licenseState";
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
                    if (data.status === 'OK') {
                        setIsLicenseCompliant(true);
                    } else {
                        setIsLicenseCompliant(false);
                    }
                    const indexOfUInExpiry = data['expirationDate'].indexOf('U');
                    setLicenseExpiry(data['expirationDate'].substring(0, indexOfUInExpiry - 1));
                    setLicensedDevices(data['licensedDeviceCounts']);
                })
                .catch(error => {
                    return error;
                });
        }, 500)
    }
}

const LicenseSummary = (props) => {
    const [contextOrg] = useContext(AppContext);
    const [isLicenseCompliant, setIsLicenseCompliant] = useState(false);
    const [licenseType, setLicenseType] = useState('co-term');
    const [licenseExpiry, setLicenseExpiry] = useState('');
    const [licensedDevices, setLicensedDevices] = useState('');

    useEffect( function(){
        if(contextOrg.orgList !== '') {
            getLicenseStatus(
                contextOrg,
                props.orgId,
                setIsLicenseCompliant,
                setLicenseType,
                setLicenseExpiry,
                setLicensedDevices);
        }
    }, [contextOrg]);

    // Handle Open License Details Dialog
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
                style={
                    isLicenseCompliant ?
                        {backgroundColor: "limegreen", height: 200, width: 170} :
                        {backgroundColor: "red", height: 200, width: 160}}
                onClick={handleClickOpen('paper')}
                variant="outlined">
                <div style={{paddingLeft: 20, paddingRight: 20}}>
                    <h3 style={{fontSize: 30}}>License</h3>
                    <p style={{fontSize: 16}}>Type: {licenseType}</p>
                    <p style={{fontSize: 20,}}>{licenseExpiry}</p>
                </div>
            </Paper>

            <Dialog
                open={open}
                onClose={handleClose}
                style={{maxHeight: 750}}
                scroll={scroll}>
                <DialogTitle id="scroll-dialog-title">License Info</DialogTitle>

                <DialogContent dividers={scroll === 'paper'}>
                    <LicenseDetailed orgId={props.orgId} licensedDevices={licensedDevices} />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} color="primary">Done</Button>
                </DialogActions>
            </Dialog>
        </div>

    );
}

export default LicenseSummary;