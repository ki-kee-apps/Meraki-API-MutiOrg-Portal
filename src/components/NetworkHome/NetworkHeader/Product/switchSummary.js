import React, {useContext, useEffect, useRef, useState} from "react";
import Paper from "@material-ui/core/Paper";
import {AppContext} from "../../../Context/appContext";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import SwitchDetailed from "../../../../views/NetworkHome/NetworkHeader/Product/switchDetailed";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

const SwitchSummary = (props) => {
    const [contextOrg] = useContext(AppContext);
    const [deviceList, setDeviceList] = useState([]);
    const [isNotLoaded, setIsNotLoaded] = useState(true);

    useEffect( function(){
        if(contextOrg.orgList.length > 0 && isNotLoaded) {
            setIsNotLoaded(false);
        }
    }, [contextOrg, isNotLoaded, props.orgId]);

    useEffect(function () {
        let devices = [];
       props.devices.forEach(deviceEntry => {
           props.status.forEach(statusEntry => {
                if(deviceEntry.model.substr(0, 2) === "MS" &&
                    statusEntry.serial === deviceEntry.serial){
                    deviceEntry['status'] = statusEntry.status;
                    devices.push(deviceEntry);
                }
                setDeviceList(devices);
           })
       })
    }, [props.devices, props.status])

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
                    <h3 style={{fontSize: 25, marginTop: 12}}>Switch</h3>
                    <p style={{fontSize: 25, fontWeight: "bold"}}>{deviceList.length}</p>
                    <FiberManualRecordIcon style={{color: 'red', paddingRight: 10}}/>{deviceList.filter(entry => entry.status==='offline').length}
                    <FiberManualRecordIcon style={{color: 'limegreen', paddingLeft: 10, paddingRight: 10}}/>{deviceList.filter(entry => entry.status==='online').length}
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
                <DialogTitle>Switches</DialogTitle>

                <DialogContent dividers={scroll === 'paper'}>
                    <SwitchDetailed orgId={props.orgId} deviceList={deviceList} />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">Done</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default SwitchSummary;