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
                    title='ORG LIST'
                    columns={[
                        {
                            name: "name",
                            label: "Name",
                            options: {
                                filter: false,
                                sort: true,
                                customBodyRender: entry =>
                                    <div style={{cursor: 'pointer'}}
                                         onClick={() => history.push(`${entry.id}/`)} >
                                        {entry.name}
                                    </div>
                            }
                        },
                        {
                            name: "id",
                            label: "Org ID",
                            options: {
                                filter: false,
                                sort: true,
                                customBodyRender: id =>
                                    <div style={{cursor: 'pointer'}}
                                         onClick={() => history.push(`${id}/`)} >
                                        {id}
                                    </div>
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
                                name: entry,
                                id: entry.id,
                                url:  entry.url,
                            })
                    })}
                    options = {[{
                        filter: false,
                    }]}
                />
            </Paper>
        </div>
    );
}

export default Org;