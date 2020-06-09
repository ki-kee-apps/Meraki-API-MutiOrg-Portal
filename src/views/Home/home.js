import React from "react";
import { Route, Switch } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Org from "../Orgs/Org/org"
import MspMenu from "../MSPMenu/MainMenu/mspmenu";
import OrgHome from "../OrgHome/OrgHome/orgHome";
import './home.css';
import NetworkHome from "../NetworkHome/NetworkHome/networkHome";


const Home = () => {
    return (
        <div className='home'>
            <Header/>
            <Switch>
                <Route exact path="/home">
                    <h3 style={{fontSize: 30, width: '100%', marginTop: -20}}>MERAKI MULTI-ORG PORTAL</h3>
                    <Grid
                        container
                        spacing={3}
                        direction="row"
                        justify="center"
                        alignItems="flex-start">
                        <Grid item>
                            <Paper id="mspPaper" variant="outlined">
                                <MspMenu />
                            </Paper>
                        </Grid>
                        <Grid item>
                            <Paper id="orgPaper" variant="outlined">
                                <Org/>
                            </Paper>
                        </Grid>
                    </Grid>
                </Route>
                <Route
                    exact path='/home/:orgId'
                    render={(props) => <OrgHome { ...props }/>}/>
                <Route
                    exact path='/home/:orgId/network/:NetworkId'
                    render={(props) => <NetworkHome { ...props }/>}/>
                </Switch>
            <Footer/>
        </div>
    );
}

export default Home;