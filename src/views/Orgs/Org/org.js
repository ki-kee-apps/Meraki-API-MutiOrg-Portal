import React, {useContext, useEffect, useState} from "react";
import {useHistory} from 'react-router';
import './org.css'
import {AppContext} from "../../../components/Context/appContext";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import MUIDataTable from "mui-datatables";

const Org = () => {
    const history = useHistory();
    const [contextValue] = useContext(AppContext);
    const [orgList, setOrgList] = useState([]);
    const [isNotLoaded, setIsNotLoaded] = useState(true);

    // Initialization
    useEffect(() => {
        if (contextValue.orgList.length > 0 && isNotLoaded) {
            setIsNotLoaded(false);
            let orgs = []
            contextValue.orgList.forEach(entry => {
                orgs.push({
                    id: entry.id,
                    name: entry.name,
                    url: entry.url
                })
            });
            setOrgList([...orgs]);
        }
    }, [contextValue, isNotLoaded]);

    return (
        <div className="orgListSection">
            <h3>LIST OF ORGS</h3>

            <Paper variant="outlined">
                <MUIDataTable
                    columns={[
                        {
                            name: "name",
                            label: "Name",
                            options: {
                                filter: false,
                                value: entry => entry.name,
                                sort: true,
                                customBodyRender: name => <div style={{cursor: 'pointer'}}>{name}</div>,
                            }
                        },
                        {
                            name: "id",
                            label: "Org ID",
                            options: {
                                filter: false,
                                sort: true,
                                customBodyRender: id => <div style={{cursor: 'pointer'}}>{id}</div>,
                            }
                        },
                        {
                            name: "url",
                            label: "Dashboard",
                            options: {
                                filter: false,
                                sort: true,
                                customBodyRender: value => {
                                    return <Button
                                        color='primary'
                                        style={{backgroundColor: "white", padding: 0}}
                                        onClick={() => {
                                            window.open(value, '_blank').focus();
                                        }}>
                                        Dashboard
                                    </Button>
                                }
                            },
                        },
                    ]}
                    data={orgList.map(entry => {
                        return (
                            {
                                id: entry.id,
                                name: entry.name,
                                url: entry.url,
                            })
                    })}
                    options={{
                        rowsPerPage: 5,
                        filter: false,
                        rowsPerPageOptions: [5, 10, 25, 50, 100],
                        selectableRowsHideCheckboxes: true,
                        selectableRowsHeader: false,
                        index: 'id',
                        onRowClick: (rowData) => history.push(`${rowData[1].props.children}/`),
                    }}
                />
            </Paper>
        </div>
    );
}

export default Org;