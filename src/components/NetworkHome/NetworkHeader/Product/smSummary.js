import React, {useContext, useEffect, useRef, useState} from "react";
import Paper from "@material-ui/core/Paper";
import {AppContext} from "../../../Context/appContext";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import SMDetailed from "../../../../views/NetworkHome/NetworkHeader/Product/smDetailed";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";

const httpReq = (url) => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('X-Cisco-Meraki-API-Key', localStorage.getItem('meraki-api-key'));

    return new Request(url, {
        method: 'GET',
        headers: headers,
        mode: 'cors',
    });
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

const getSMDeviceList = async (
    contextOrg,
    orgId,
    networkId,
    batchToken,
    deviceList,
    setDeviceList) =>
{
    const shard = await getOrgShard(contextOrg, orgId);
    if (shard !== '') {
        let url = contextOrg.proxyURL + "https://" + shard + ".meraki.com/api/v0/networks/"
            + networkId + "/sm/devices?batchSize=1000";

        // Update URL if More than 1000
        if(batchToken.length > 1)
            url = url + "&batchToken=" + batchToken.toString()

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
                    const consolidatedDeviceList = [...deviceList, ...data.devices];
                    setDeviceList(consolidatedDeviceList);
                    if(data.batchToken.length > 1) {
                        getSMDeviceList(
                            contextOrg,
                            orgId,
                            networkId,
                            data.batchToken,
                            consolidatedDeviceList,
                            setDeviceList
                        );
                    }
                })
                .catch(error => {
                    return error;
                });
        }, 500);
    }
}


const SMSummary = (props) => {
    const [contextOrg] = useContext(AppContext);
    const [deviceList, setDeviceList] = useState([]);
    const [isNotLoaded, setIsNotLoaded] = useState(true);

    useEffect( function(){
        if(contextOrg.orgList.length > 0 && isNotLoaded) {
            setIsNotLoaded(false);
            getSMDeviceList(
                contextOrg,
                props.orgId,
                props.networkId,
                '',
                deviceList,
                setDeviceList);
        }
    }, [contextOrg, isNotLoaded, props.orgId]);

    // Handle Open Device Details Dialog
    const [openDialog, setOpenDialog] = useState(false);
    const [scroll, setScroll] = useState('paper');
    const handleClickOpenDialog = (scrollType) => () => {
        setOpenDialog(true);
        setScroll(scrollType);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    const descriptionElementRef = useRef(null);
    useEffect(() => {
        if (openDialog) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [openDialog]);


    return(
        <div>
            <Paper
                style={{ height: 170, width: 150 }}
                onClick={handleClickOpenDialog('paper')}
                variant="outlined">
                <div style={{paddingLeft: 10, paddingRight: 10}}>
                    <h3 style={{fontSize: 25, marginTop: 12}}>SM</h3>
                    <p style={{fontSize: 25, fontWeight: "bold"}}>{deviceList.length}</p>
                </div>
            </Paper>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                fullScreen
                disableEscapeKeyDown
                disableBackdropClick
                style={{maxHeight: '80%', maxWidth: '90%', left: '5%', top: '10%'}}
                scroll={scroll}>
                <DialogTitle id="scroll-dialog-title">Systems Manager</DialogTitle>

                <DialogContent dividers={scroll === 'paper'}>
                    <SMDetailed orgId={props.orgId} deviceList={deviceList} />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">Done</Button>
                </DialogActions>
            </Dialog>

        </div>
    )
}

export default SMSummary;