import React from "react";
import MUIDataTable from "mui-datatables";
import Paper from "@material-ui/core/Paper";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

const CameraDetailed = (props) => {
    return (
        <div>
            <Paper variant="outlined" >
                <MUIDataTable
                    title='Managed Device List'
                    columns={[
                        {
                            name: "status",
                            label: "Status",
                            options: {
                                filter: true,
                                sort: true,
                                customBodyRender: value => {
                                    return value === 'online' ?
                                        <FiberManualRecordIcon style={{color: 'limegreen'}}/> :
                                        <FiberManualRecordIcon style={{color: 'red'}}/>
                                }
                            },
                        },
                        {
                            name: "name",
                            label: "Name",
                            options: {
                                filter: false,
                                sort: true,
                            }
                        },
                        {
                            name: "serial",
                            label: "Serial",
                            options: {
                                filter: false,
                                sort: true,
                            }
                        },
                        {
                            name: "mac",
                            label: "MAC",
                            options: {
                                filter: true,
                                sort: true,
                            }
                        },
                        {
                            name: "model",
                            label: "Model",
                            options: {
                                filter: true,
                                sort: true,
                            }
                        },
                        {
                            name: "firmware",
                            label: "Firmware",
                            options: {
                                filter: true,
                                sort: true,
                            }
                        },
                        {
                            name: "lanIp",
                            label: "IP",
                            options: {
                                filter: false,
                                sort: true,
                            }
                        },
                        {
                            name: "tags",
                            label: "Tags",
                            options: {
                                filter: true,
                                sort: true,
                            },
                        },
                    ]}
                    data={props.deviceList.map(entry => {
                        return (
                            {
                                name: entry.name,
                                model: entry.model,
                                status:  entry.status,
                                firmware:  entry.firmware,
                                serial:  entry.serial,
                                lanIp: entry.lanIp,
                                mac:  entry.mac,
                                tags:  entry.tags,
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

export default CameraDetailed;