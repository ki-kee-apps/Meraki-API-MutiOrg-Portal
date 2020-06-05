import React, {useContext} from "react";
import { useParams } from 'react-router-dom';
import OrgHomeHeader from "../OrgHomeHeader/orgHomeHeader";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import OrgHomeMenu from "../OrgHomeMenu/orgHomeMenu";
import OrgHomeBody from "../../../components/OrgHome/OrgHomeBody/orgHomeBody";
import {AppContext} from "../../../components/Context/appContext";

const getOrgName = (contextOrg, orgId) => {
    /* Return shard number of the current Org */
    let name = '';
    // eslint-disable-next-line array-callback-return
    contextOrg.orgList.map(entry => {
        if (entry.id === orgId) {
            name = entry.name;
            return entry;
        }
    });
    return name;
}

const OrgHome = (props) => {
    const [contextOrg, setContextOrg] = useContext(AppContext);
    const { orgId } = useParams();

    return(
        <div style={{width: '100%', paddingBottom: 50}}>
            <h3 style={{fontSize: 30, marginTop: -20}}>{getOrgName(contextOrg, orgId).toUpperCase()}</h3>
            <div>
                <OrgHomeHeader orgId={ orgId } />
            </div>

            <Grid
                container
                spacing={3}
                direction="row"
                justify="center"
                alignItems="flex-start">

                <Grid item>
                    <Paper
                        style={{
                            height: 'inherit',
                            minWidth: 200,
                            minHeight: 300,
                            backgroundColor: '#0a8c92',
                            paddingRight: 20,
                            paddingLeft: 20}}
                        variant="outlined">
                        <OrgHomeMenu orgId={ orgId } />
                    </Paper>
                </Grid>

                <Grid item>
                    <Paper
                        style={{
                            height: 'inherit',
                            minWidth: 600,
                            minHeight: 300,
                            backgroundColor: '#ffffff',
                            paddingRight: 20,
                            paddingLeft: 20}}
                        variant="outlined">
                        <OrgHomeBody orgId={ orgId } />
                    </Paper>
                </Grid>

            </Grid>

        </div>
    );
}

export default OrgHome;