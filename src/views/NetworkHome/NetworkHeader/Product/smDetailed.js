import React from "react";
import MUIDataTable from "mui-datatables";
import Paper from "@material-ui/core/Paper";

const SMDetailed = (props) => {
    return (
        <div>
            <Paper variant="outlined" >
                <MUIDataTable
                    title='Managed Device List'
                    columns={[
                        {
                            name: "name",
                            label: "Name",
                            options: {
                                filter: false,
                                sort: true,
                            }
                        },
                        {
                            name: "id",
                            label: "ID",
                            options: {
                                filter: false,
                                sort: true,
                            }
                        },
                        {
                            name: "systemModel",
                            label: "Model",
                            options: {
                                filter: true,
                                sort: true,
                            }
                        },
                        {
                            name: "osName",
                            label: "OS",
                            options: {
                                filter: true,
                                sort: true,
                            }
                        },
                        {
                            name: "serialNumber",
                            label: "Serial",
                            options: {
                                filter: false,
                                sort: true,
                            }
                        },
                        {
                            name: "ip",
                            label: "IP",
                            options: {
                                filter: false,
                                sort: true,
                            }
                        },
                        {
                            name: "wifiMac",
                            label: "WiFi MAC",
                            options: {
                                filter: false,
                                sort: true,
                            }
                        },
                        {
                            name: "ssid",
                            label: "SSID",
                            options: {
                                filter: true,
                                sort: true,
                            }
                        }
                    ]}
                    data={props.deviceList.map(entry => {
                        return (
                            {
                                name: entry.name,
                                id: entry.id,
                                systemModel: entry.systemModel,
                                osName:  entry.osName,
                                serialNumber:  entry.serialNumber,
                                ip: entry.ip,
                                wifiMac:  entry.wifiMac,
                                ssid:  entry.ssid,
                            })
                    })}
                    options = {[{
                        filterType: 'checkbox',
                    }]}
                />
            </Paper>
        </div>
    )
}

export default SMDetailed;