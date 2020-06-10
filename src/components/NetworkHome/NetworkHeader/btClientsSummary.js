import React, {useContext, useEffect, useRef, useState} from "react";
import Paper from "@material-ui/core/Paper";
import HistoryIcon from '@material-ui/icons/History';
import Tooltip from "@material-ui/core/Tooltip";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from "@material-ui/core/IconButton";
import {AppContext} from "../../Context/appContext";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import BtClientsDetailed from "../../../views/NetworkHome/NetworkHeader/btClientsDetailed";


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

const getBtClientList = async (
    contextOrg,
    orgId,
    networkId,
    timeframe,
    startingAfterId,
    btClientList,
    setBtClientList) =>
{
    const shard = await getOrgShard(contextOrg, orgId);
    if (shard !== '') {
        let url = contextOrg.proxyURL + "https://" + shard + ".meraki.com/api/v0/networks/"
            + networkId + "/bluetoothClients?includeConnectivityHistory=true&perPage=1000" +
            "&timespan=" + timeframe.toString() +
            "&startingAfter=" + startingAfterId.toString();

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
                    const consolidatedBtClientList = [...btClientList, ...data];
                    setBtClientList(consolidatedBtClientList);
                    if(data.length === 1000) {
                        getBtClientList(
                            contextOrg,
                            orgId,
                            networkId,
                            timeframe,
                            data.pop().id,
                            consolidatedBtClientList,
                            setBtClientList
                        );
                    }
                })
                .catch(error => {
                    return error;
                });
        }, 0);
    }
}


const BtClientSummary = (props) => {
    const [contextOrg] = useContext(AppContext);
    const [btClientList, setBtClientList] = useState([]);

    // Timeframe Change Handling
    const [timeframe, setTimeframe] = useState(3600);
    const [openTimeframeSelect, setOpenTimeFrameSelect] = useState(false);
    const handleChange = (event) => {
        setBtClientList([]);
        setTimeframe(event.target.value);
        setOpenTimeFrameSelect(false);
    };
    const handleOpenTimeframeSelect = () => {
        setOpenTimeFrameSelect(true);
    };
    const handleCloseTimeframeSelect = () => {
        setOpenTimeFrameSelect(false);
    };

    // Initialize
    useEffect(function () {
        if(contextOrg.orgList.length > 0) {
            getBtClientList(
                contextOrg,
                props.orgId,
                props.networkId,
                timeframe,
                '',
                btClientList,
                setBtClientList
            );
        }
    }, [contextOrg, timeframe]);

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
                variant="outlined">
                <div
                    onClick={handleClickOpenDialog('paper')}
                    style={{paddingLeft: 10, paddingRight: 10}}>
                    <h3 style={{fontSize: 25, marginTop: 12}}>BT Clients</h3>
                    <p style={{fontSize: 25, fontWeight: "bold"}}>{btClientList.length}</p>
                </div>

                <div style={{ bottom: 0, left: -5}}>
                    <Tooltip disableFocusListener interactive title={timeframe}>
                        <HistoryIcon />
                    </Tooltip>

                    <Select
                        style={{width: 0}}
                        open={openTimeframeSelect}
                        onClose={handleCloseTimeframeSelect}
                        onOpen={handleOpenTimeframeSelect}
                        onChange={handleChange}
                        value={timeframe}>
                        <MenuItem value={3600}>1 Hour</MenuItem>
                        <MenuItem value={7200}>2 Hours</MenuItem>
                        <MenuItem value={86400}>1 Day</MenuItem>
                        <MenuItem value={604800}>7 days</MenuItem>
                    </Select>
                    <IconButton size="small"
                                onClick={handleOpenTimeframeSelect} >
                        <ExpandMoreIcon fontSize="inherit">

                        </ExpandMoreIcon>
                    </IconButton>
                </div>
            </Paper>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                style={{maxHeight: 750}}
                fullWidth={true}
                maxWidth = {'md'}
                scroll={scroll}>
                <DialogTitle id="scroll-dialog-title">Bluetooth Clients</DialogTitle>

                <DialogContent dividers={scroll === 'paper'}>
                    <BtClientsDetailed
                        orgId={props.orgId}
                        networkId={props.networkId}
                        btClientList={btClientList} />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">Done</Button>
                </DialogActions>
            </Dialog>

        </div>
    )
}

export default BtClientSummary;