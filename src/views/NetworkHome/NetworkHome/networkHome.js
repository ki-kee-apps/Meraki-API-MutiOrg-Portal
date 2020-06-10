import React, {useContext, useEffect, useState} from "react";
import { useHistory } from 'react-router';
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {AppContext} from "../../../components/Context/appContext";
import {useParams} from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import NetworkHomeMenu from "../NetworkMenu/networkHomeMenu";
import NetworkHomeHeader from "../NetworkHeader/networkHomeHeader";
import NetworkHomeBody from "../../../components/NetworkHome/NetworkBody/networkBody";


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

const setNetworkObject = async (
    contextOrg,
    orgId,
    networkId,
    setCurrentNetworkObj) =>
{
    const shard = await getOrgShard(contextOrg, orgId);
    if (shard !== '') {
        const url = contextOrg.proxyURL + "https://" + shard +
            ".meraki.com/api/v0/organizations/" + orgId + "/networks/" + networkId;
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
                    setCurrentNetworkObj(data);
                })
                .catch(error => {
                    return error;
                });
        }, 0);
    }
}


const NetworkHome = (props) => {
    const history = useHistory();
    const [contextOrg] = useContext(AppContext);
    const { orgId, networkId } = useParams();
    const [isNotLoaded, setIsNotLoaded] = useState(true);
    const [currentNetworkObj, setCurrentNetworkObj] = useState('');

    useEffect(function() {
        if(contextOrg.orgList.length > 0 && isNotLoaded) {
            setIsNotLoaded(false);
            setNetworkObject(
                contextOrg,
                orgId,
                networkId,
                setCurrentNetworkObj)
        }
    }, [contextOrg]);

    return(
        <div style={{width: "100%", paddingBottom: 50}}>
            <Grid
                container
                direction='row'
                justify="center"
                alignItems="flex-start">

                <Grid item xs={2} style={{padding: 0,marginTop: -30, marginBottom: 15, position: 'fixed', left: 10}}>
                    <Button
                        variant="contained" color="secondary"
                        onClick={() => {history.push('../../');}}>
                        Org Home
                    </Button>
                </Grid>
                <Grid item>
                    <h3 style={{fontSize: 30, marginTop: -30, marginBottom: 15}}>
                        {currentNetworkObj.name}
                    </h3>
                </Grid>

            </Grid>

            <div>
                <NetworkHomeHeader currentNwObject={currentNetworkObj} />
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
                        <NetworkHomeMenu currentNwObject={currentNetworkObj} />
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
                        <NetworkHomeBody currentNwObject={currentNetworkObj}/>
                    </Paper>
                </Grid>

            </Grid>

        </div>
    );
}

export default NetworkHome;