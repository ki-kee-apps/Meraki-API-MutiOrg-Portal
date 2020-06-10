import React from "react";
import Paper from "@material-ui/core/Paper";

const SwitchSummary = (props) => {
    return(
        <div>
            <Paper
                style={{ height: 170, width: 150 }}
                variant="outlined">
                <div style={{paddingLeft: 10, paddingRight: 10}}>
                    <h3 style={{fontSize: 25, marginTop: 12}}>Switch</h3>
                    <p style={{fontSize: 25, fontWeight: "bold"}}>No</p>
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

export default SwitchSummary;