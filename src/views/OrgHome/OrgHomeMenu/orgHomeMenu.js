import React, {useState} from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import BulkReboot from "../../../components/OrgHome/OrgHomeMenu/bulkReboot";

const OrgHomeMenu = (props) => {
    const [showBulkReboot, setShowBulkReboot] = useState(false);

    return(
        <div>
            <h4>MENU</h4>
            <Grid
                container
                spacing={3}
                direction="column"
                justify="center"
                alignItems="flex-start">
                <Grid item>
                    <Button
                        onClick={() => setShowBulkReboot(true)}
                        variant="contained"
                        color="primary"
                        component="span">
                        Bulk Reboot Devices
                    </Button>
                </Grid>

                <Grid item>
                    <Button variant="contained" color="primary" component="span">
                        Button
                    </Button>
                </Grid>

                <Grid item>
                    <Button variant="contained" color="primary" component="span">
                        Button
                    </Button>
                </Grid>

                <Grid item>
                    <Button variant="contained" color="primary" component="span">
                        Button
                    </Button>
                </Grid>

                <Grid item>
                    <Button variant="contained" color="primary" component="span">
                        Button
                    </Button>
                </Grid>

            </Grid>

            {showBulkReboot && <BulkReboot
                                    open={showBulkReboot}
                                    orgId={props.orgId}
                                    orgDeviceList={props.orgDeviceList}
                                    setShowBulkReboot={setShowBulkReboot} />}

        </div>
    );
}

export default OrgHomeMenu;