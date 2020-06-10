import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import BtClientSummary from "../../../components/NetworkHome/NetworkHeader/btClientsSummary";
import ClientSummary from "../../../components/NetworkHome/NetworkHeader/clientsSummary";
import ApplianceSummary from "../../../components/NetworkHome/NetworkHeader/Product/applianceSummary";
import SwitchSummary from "../../../components/NetworkHome/NetworkHeader/Product/switchSummary";
import WirelessSummary from "../../../components/NetworkHome/NetworkHeader/Product/wirelessSummary";
import SMSummary from "../../../components/NetworkHome/NetworkHeader/Product/smSummary";
import CameraSummary from "../../../components/NetworkHome/NetworkHeader/Product/cameraSummary";

const NetworkHomeHeader = (props) => {
    const [productTypes, setProductTypes] = useState('');
    const [orgId, setOrgId] = useState();
    const [networkId, setNetworkId] = useState();

    const [hasAppliancePayload, setHasAppliancePayload] = useState(false);
    const [hasSwitchPayload, setHasSwitchPayload] = useState(false);
    const [hasWirelessPayload, setHasWirelessPayload] = useState(false);
    const [hasSMPayload, setHasSMPayload] = useState(false);
    const [hasCameraPayload, setHasCameraPayload] = useState(false);

    useEffect(function () {
        setProductTypes(props.currentNwObject.productTypes);
        setOrgId(props.currentNwObject.organizationId);
        setNetworkId(props.currentNwObject.id);
    }, [props.currentNwObject])

    useEffect(function () {
        if(props.currentNwObject) {
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
                        <BtClientSummary orgId={orgId} networkId={networkId} />
                    </Grid>
                }

                {
                    (hasWirelessPayload || hasSwitchPayload || hasAppliancePayload) &&
                    <Grid className="orgHomeHeaderGridItem" item>
                        <ClientSummary orgId={orgId} networkId={networkId}/>
                    </Grid>
                }

                {
                    hasAppliancePayload &&
                    <Grid className="orgHomeHeaderGridItem" item>
                        <ApplianceSummary orgId={orgId} networkId={networkId} />
                    </Grid>
                }
                {
                    hasSwitchPayload &&
                    <Grid className="orgHomeHeaderGridItem" item>
                        <SwitchSummary orgId={orgId} networkId={networkId} />
                    </Grid>
                }
                {
                    hasWirelessPayload &&
                    <Grid className="orgHomeHeaderGridItem" item>
                        <WirelessSummary orgId={orgId} networkId={networkId} />
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
                        <CameraSummary orgId={orgId} networkId={networkId} />
                    </Grid>
                }
            </Grid>
        </div>
    )
}

export default NetworkHomeHeader;