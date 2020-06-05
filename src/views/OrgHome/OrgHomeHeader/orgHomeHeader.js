import React from "react";
import Grid from "@material-ui/core/Grid";
import LicenseSummary from "../../../components/OrgHome/OrgHomeHeader/licenseSummary";
import NetworksSummary from "../../../components/OrgHome/OrgHomeHeader/networksSummary";
import DevicesSummary from "../../../components/OrgHome/OrgHomeHeader/deviceSummary";
import OrgAdminSummary from "../../../components/OrgHome/OrgHomeHeader/orgAdminSummary";

const OrgHomeHeader = (props) => {

    return(
        <div>
            <Grid
                container
                spacing={3}
                direction="row"
                justify="center"
                alignItems="flex-start">
                <Grid item>
                    <LicenseSummary orgId={props.orgId} />
                </Grid>

                <Grid item>
                    <NetworksSummary orgId={props.orgId} />
                </Grid>

                <Grid item>
                    <DevicesSummary orgId={props.orgId} />
                </Grid>

                <Grid item>
                    <OrgAdminSummary orgId={props.orgId} />
                </Grid>

            </Grid>

        </div>
    );
}

export default OrgHomeHeader;