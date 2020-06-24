import React, {useContext, useEffect, useState} from "react";
import { useParams } from 'react-router-dom';
import OrgHomeHeader from "../OrgHomeHeader/orgHomeHeader";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import OrgHomeMenu from "../OrgHomeMenu/orgHomeMenu";
import OrgHomeBody from "../../../components/OrgHome/OrgHomeBody/orgHomeBody";
import {AppContext} from "../../../components/Context/appContext";

const httpReq = (url) => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('X-Cisco-Meraki-API-Key', localStorage.getItem('meraki-api-key'));

    const req = new Request(url, {
        method: 'GET',
        headers: headers,
        mode: 'cors',
    });
    return req;
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

const setNetworksContext = async (
    contextOrg,
    orgId,
    setContextOrg) =>
{
    const shard = await getOrgShard(contextOrg, orgId);
    if (shard !== '') {
        const url = contextOrg.proxyURL + "https://" + shard + ".meraki.com/api/v0/organizations/" + orgId + "/networks";
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
                    setContextOrg({networkIdToNameMap:
                        data.map(entry => {
                            return {orgId: orgId, id: entry.id, name: entry.name}
                        })
                    })
                })
                .catch(error => {
                    return error;
                });
        }, 750);
    }
}


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
    const [isNotLoaded, setIsNotLoaded] = useState(true);

    // For Child Component Operations
    const [orgDeviceList, setOrgDeviceList] = useState([]);

    useEffect( function(){
        if(contextOrg.orgList.length > 0 && isNotLoaded) {
            setIsNotLoaded(false);
            setNetworksContext(
                contextOrg,
                orgId,
                setContextOrg
            );
        }
    }, [contextOrg]);

    return(
        <div style={{width: '100%', paddingBottom: 50}}>
            <h3 style={{fontSize: 30, marginTop: -30, marginBottom: 15}}>{getOrgName(contextOrg, orgId).toUpperCase()}</h3>
            <div>
                <OrgHomeHeader
                    setOrgDeviceList={setOrgDeviceList}
                    orgId={ orgId } />
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
                        <OrgHomeMenu
                            orgDeviceList={orgDeviceList}
                            orgId={ orgId }  />
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