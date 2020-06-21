import React, {useState} from "react";
import Button from '@material-ui/core/Button';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import MSPLicenseStatus from "../../../components/Home/MSPMenu/mspLicenseStatus";
import MSPAdmins from "../../../components/Home/MSPMenu/mspUpdateAdmins";

const MspMenu = (props) => {
    const [showMSPLicenseStatus, setShowMSPLicenseStatus] = useState(false);
    const [showMSPAdmins, setShowMSPAdmins] = useState(false);

    return(
        <div id="mspMenuSection">
            <h3 style={{fontSize: 30, marginTop: -10, marginBottom: 15}}>Menu</h3>
            <List>
                <ListItem>
                    <Button
                        onClick={() => setShowMSPAdmins(true)}
                        variant="contained"
                        color={"primary"}>
                        Update Administrators
                    </Button>
                </ListItem>

                <ListItem>
                    <Button
                        onClick={() => setShowMSPLicenseStatus(true)}
                        variant="contained"
                        color={"primary"}>
                        License Expiration
                    </Button>
                </ListItem>

                <ListItem>
                    <Button variant="contained" color={"primary"}>
                        Create Org
                    </Button>
                </ListItem>

                <ListItem>
                    <Button variant="contained" color={"primary"}>
                        Clone Org
                    </Button>
                </ListItem>
            </List>

            {showMSPLicenseStatus && <MSPLicenseStatus
                open={showMSPLicenseStatus}
                setShowMSPLicenseStatus={setShowMSPLicenseStatus} />}

            {showMSPAdmins && <MSPAdmins
                open={showMSPAdmins}
                setShowMSPAdmins={setShowMSPAdmins} />}
        </div>
    );
}

export default MspMenu;