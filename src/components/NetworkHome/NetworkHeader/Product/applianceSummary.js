import React, {useContext, useEffect, useState} from "react";
import Paper from "@material-ui/core/Paper";
import {AppContext} from "../../../Context/appContext";

const ApplianceSummary = (props) => {
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
                if(deviceEntry.model.substr(0, 2) === "MX" &&
                    statusEntry.serial === deviceEntry.serial){
                    deviceEntry['status'] = statusEntry.status;
                    devices.push(deviceEntry);
                }
                setDeviceList(devices);
            })
        })
    }, [props.devices, props.status])


    return(
        <div hidden={deviceList.length>0 ? false : true}>
            <Paper
                style={{
                    height: 170,
                    width: 150,
                    backgroundColor:
                        deviceList.filter(entry => entry.status==='online').length>0 ?
                            'limegreen' :
                            'red'
                }}
                variant="outlined">
                <div style={{paddingLeft: 10, paddingRight: 10}}>
                    <h3 style={{fontSize: 25, marginTop: 12}}>MX</h3>
                    <p style={{fontSize: 25, fontWeight: "bold"}}>{deviceList.length}</p>
                </div>
            </Paper>

            {/*<Dialog
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
            </Dialog>*/}

        </div>
    )
}

export default ApplianceSummary;