import React, {useContext, useEffect, useRef, useState} from "react";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import HistoryIcon from "@material-ui/icons/History";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import {AppContext} from "../../Context/appContext";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import ClientsDetailed from "../../../views/NetworkHome/NetworkHeader/clientsDetailed";
import DialogActions from "@material-ui/core/DialogActions";


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

const getClientList = async (
    contextOrg,
    orgId,
    networkId,
    timeframe,
    startingAfterId,
    clientList,
    setClientList) =>
{
    const shard = await getOrgShard(contextOrg, orgId);
    if (shard !== '') {
        let url = contextOrg.proxyURL + "https://" + shard + ".meraki.com/api/v0/networks/"
            + networkId + "/clients?includeConnectivityHistory=true&perPage=1000" +
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
                    const consolidatedBtClientList = [...clientList, ...data];
                    setClientList(consolidatedBtClientList);
                    if(data.length === 1000) {
                        getClientList(
                            contextOrg,
                            orgId,
                            networkId,
                            timeframe,
                            data.pop().id,
                            consolidatedBtClientList,
                            setClientList
                        );
                    }
                })
                .catch(error => {
                    return error;
                });
        }, 500);
    }
}

const ClientSummary = (props) => {
    const [contextOrg] = useContext(AppContext);
    const [clientList, setClientList] = useState([]);

    // Timeframe Change Handling
    const [anchorEl, setAnchorEl] = useState(null);
    const [timeFrame, setTimeFrame] = useState(86400);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleTimeFrameClose = () => {
        setAnchorEl(null);
    };
    const handleTimeframeChange = (event) => {
        if(event.target.value > 1)
            setTimeFrame(event.target.value);
        setAnchorEl(null);
    }

    // Initialize
    useEffect(function () {
        if(contextOrg.orgList.length > 0) {
            getClientList(
                contextOrg,
                props.orgId,
                props.networkId,
                timeFrame,
                '',
                [],
                setClientList
            );
        }
    }, [contextOrg, timeFrame]);

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
                    <h3 style={{fontSize: 25, marginTop: 12}}>Clients</h3>
                    <p style={{fontSize: 25, fontWeight: "bold"}}>{clientList.length}</p>
                </div>

                <div style={{ bottom: 0, left: -5}}>
                    <Tooltip id={anchorEl} title={timeFrame} interactive>
                        <HistoryIcon onClick={handleClick}/>
                    </Tooltip>

                    <Menu
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClick={handleTimeframeChange}
                        onClose={handleTimeFrameClose}>
                        <MenuItem value={3600}>Last 1 Hour</MenuItem>
                        <MenuItem value={7200}>Last 2 Hours</MenuItem>
                        <MenuItem value={86400}>Last Day</MenuItem>
                        <MenuItem value={604800}>Last Week</MenuItem>
                        <MenuItem value={2678400}>Last Month</MenuItem>
                    </Menu>
                </div>
            </Paper>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                style={{maxHeight: 750}}
                fullWidth={true}
                maxWidth = {'md'}
                scroll={scroll}>
                <DialogTitle id="scroll-dialog-title">Network Clients</DialogTitle>

                <DialogContent dividers={scroll === 'paper'}>
                    <ClientsDetailed
                        orgId={props.orgId}
                        timeframe={timeFrame}
                        networkId={props.networkId}
                        clientList={clientList} />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">Done</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default ClientSummary;