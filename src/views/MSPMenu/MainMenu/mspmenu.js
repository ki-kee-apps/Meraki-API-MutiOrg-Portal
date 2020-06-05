import React from "react";
import Button from '@material-ui/core/Button';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

const MspMenu = (props) => {
    return(
        <div id="mspMenuSection">
            <h3>Options</h3>
            <List>
                <ListItem>
                    <Button variant="contained" color={"primary"}>
                        Update Administrators
                    </Button>
                </ListItem>

                <ListItem>
                    <Button variant="contained" color={"primary"}>
                        License Expiration
                    </Button>
                </ListItem>

                <ListItem>
                    <Button variant="contained" color={"primary"}>
                        Create Org
                    </Button>
                </ListItem>

                <ListItem>
                    <Button variant="contained" color={"primary"}>
                        Clone Org
                    </Button>
                </ListItem>
            </List>
        </div>
    );
}

export default MspMenu;