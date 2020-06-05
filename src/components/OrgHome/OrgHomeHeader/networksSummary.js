import React, {useContext, useEffect, useState} from "react";
import Paper from "@material-ui/core/Paper";
import {AppContext} from "../../Context/appContext";

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

const getNumberOfNetworks = async (
    contextOrg,
    orgId,
    setNumberOfNetworks) =>
{
    const shard = await getOrgShard(contextOrg, orgId);
    if (shard !== '') {
        const url = "https://" + shard + ".meraki.com/api/v0/organizations/" + orgId + "/networks";
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
                    setNumberOfNetworks(Object.keys(data).length);
                })
                .catch(error => {
                    return error;
                });
        }, 750);
    }
}

const NetworksSummary = (props) => {
    const [contextOrg] = useContext(AppContext);
    const [numberOfNetworks, setNumberOfNetworks] = useState();

    useEffect(function(){
        if(contextOrg.orgList !== '') {
            getNumberOfNetworks(
                contextOrg,
                props.orgId,
                setNumberOfNetworks);
        }
    }, [contextOrg]);

    return(
        <Paper
            style={{height: 200, width: 170}}
            variant="outlined">
            <h3 style={{paddingLeft: 20, paddingRight: 20, fontSize: 30}}>Networks</h3>

            <h1 style={{fontSize: 50}}>{numberOfNetworks}</h1>
        </Paper>
    );
}

export default NetworksSummary;