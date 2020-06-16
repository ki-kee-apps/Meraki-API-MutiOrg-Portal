import React, {useContext, useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import BtClientSummary from "../../../components/NetworkHome/NetworkHeader/btClientsSummary";
import ClientSummary from "../../../components/NetworkHome/NetworkHeader/clientsSummary";
import ApplianceSummary from "../../../components/NetworkHome/NetworkHeader/Product/applianceSummary";
import SwitchSummary from "../../../components/NetworkHome/NetworkHeader/Product/switchSummary";
import WirelessSummary from "../../../components/NetworkHome/NetworkHeader/Product/wirelessSummary";
import SMSummary from "../../../components/NetworkHome/NetworkHeader/Product/smSummary";
import CameraSummary from "../../../components/NetworkHome/NetworkHeader/Product/cameraSummary";
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

const loadNetworkDeviceStatus = async (
    contextOrg,
    orgId,
    networkId,
    setNetworkDeviceStatus) =>
{
    const shard = await getOrgShard(contextOrg, orgId);
    if (shard !== '') {
        // Get Devices in the network
        let url = contextOrg.proxyURL + "https://" + shard +
            ".meraki.com/api/v0/organizations/" + orgId + "/deviceStatuses";
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
                    let consolidatedNetworkEnvironmentVariables = [];
                    data.forEach(entry => {
                        if(entry.networkId === networkId)
                            consolidatedNetworkEnvironmentVariables.push(entry);
                    })
                    return consolidatedNetworkEnvironmentVariables;
                })
                .then(data => {
                    setNetworkDeviceStatus(data);
                })
                .catch(error => {
                    return error;
                });
        }, 0);
    }
}

const loadNetworkDevices = async (
    contextOrg,
    orgId,
    networkId,
    setNetworkDevices) =>
{
    const shard = await getOrgShard(contextOrg, orgId);
    if (shard !== '') {
        // Get Devices in the network
        let url = contextOrg.proxyURL + "https://" + shard +
            ".meraki.com/api/v0/networks/" + networkId + "/devices";
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
                    let consolidatedNetworkEnvironmentVariables = [];
                    data.forEach(entry => {
                        if(entry.networkId === networkId)
                            consolidatedNetworkEnvironmentVariables.push(entry);
                    })
                    return consolidatedNetworkEnvironmentVariables;
                })
                .then(data => {
                    setNetworkDevices(data);
                })
                .catch(error => {
                    return error;
                });
        }, 0);
    }
}


const NetworkHomeHeader = (props) => {
    const [contextOrg] = useContext(AppContext);
    const [orgId, setOrgId] = useState();
    const [networkId, setNetworkId] = useState();
    const [networkDeviceStatus, setNetworkDeviceStatus] = useState([]);
    const [networkDevices, setNetworkDevices] = useState([]);

    const [productTypes, setProductTypes] = useState('');
    const [hasAppliancePayload, setHasAppliancePayload] = useState(false);
    const [hasSwitchPayload, setHasSwitchPayload] = useState(false);
    const [hasWirelessPayload, setHasWirelessPayload] = useState(false);
    const [hasSMPayload, setHasSMPayload] = useState(false);
    const [hasCameraPayload, setHasCameraPayload] = useState(false);

    useEffect(function () {
        if(contextOrg.orgList.length > 0) {
            setProductTypes(props.currentNwObject.productTypes);
            setOrgId(props.currentNwObject.organizationId);
            setNetworkId(props.currentNwObject.id);
        }
    }, [props.currentNwObject, contextOrg])

    useEffect(function () {
        if(props.currentNwObject) {
            loadNetworkDeviceStatus(
                contextOrg,
                orgId,
                networkId,
                setNetworkDeviceStatus);

            loadNetworkDevices(
                contextOrg,
                orgId,
                networkId,
                setNetworkDevices);

            if (Object.values(productTypes).includes('appliance')) {
                setHasAppliancePayload(true)
            }
            if (Object.values(productTypes).includes('switch')) {
                setHasSwitchPayload(true)
            }
            if (Object.values(productTypes).includes('camera')) {
                setHasCameraPayload(true)
            }
            if (Object.values(productTypes).includes('wireless')) {
                setHasWirelessPayload(true)
            }
            if (Object.values(productTypes).includes('systems manager')) {
                setHasSMPayload(true)
            }
        }
    }, [productTypes])

    return (
        <div>
            <Grid
                container
                spacing={3}
                direction="row"
                justify="center"
                alignItems="flex-start">
                {
                    hasWirelessPayload &&
                    <Grid className="orgHomeHeaderGridItem" item>
                        <BtClientSummary
                            orgId={orgId}
                            networkId={networkId}/>
                    </Grid>
                }

                {
                    (hasWirelessPayload || hasSwitchPayload || hasAppliancePayload) &&
                    <Grid className="orgHomeHeaderGridItem" item>
                        <ClientSummary
                            orgId={orgId}
                            networkId={networkId}/>
                    </Grid>
                }

                {
                    hasAppliancePayload &&
                    <Grid className="orgHomeHeaderGridItem" item>
                        <ApplianceSummary
                            orgId={orgId}
                            networkId={networkId}
                            status={networkDeviceStatus}
                            devices={networkDevices} />
                    </Grid>
                }
                {
                    hasSwitchPayload &&
                    <Grid className="orgHomeHeaderGridItem" item>
                        <SwitchSummary
                            orgId={orgId}
                            networkId={networkId}
                            status={networkDeviceStatus}
                            devices={networkDevices}/>
                    </Grid>
                }
                {
                    hasWirelessPayload &&
                    <Grid className="orgHomeHeaderGridItem" item>
                        <WirelessSummary orgId={orgId}
                                         networkId={networkId}
                                         status={networkDeviceStatus}
                                         devices={networkDevices}/>
                    </Grid>
                }
                {
                    hasSMPayload &&
                    <Grid className="orgHomeHeaderGridItem" item>
                        <SMSummary orgId={orgId} networkId={networkId} />
                    </Grid>
                }
                {
                    hasCameraPayload &&
                    <Grid className="orgHomeHeaderGridItem" item>
                        <CameraSummary orgId={orgId}
                                       networkId={networkId}
                                       status={networkDeviceStatus}
                                       devices={networkDevices}/>
                    </Grid>
                }
            </Grid>
        </div>
    )
}

export default NetworkHomeHeader;