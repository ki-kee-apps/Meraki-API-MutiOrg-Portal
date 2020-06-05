import React, {useState, useContext, useEffect} from 'react';
import {Route, Switch, useHistory} from "react-router-dom";

import './App.css';
import Login from '../../views/Login/login';
import Home from "../../views/Home/home";
import {AppContext} from "../Context/appContext";

const App = () => {
    const history = useHistory();
    const [contextApiKey, setApiKey] = useState('');
    const [loginSuccess, setLoginSuccess] = useState(-1);
    const [appState, setAppState] = useContext(AppContext);

    useEffect(() => {
        const getLocalApiKey = localStorage.getItem('meraki-api-key');
        if (getLocalApiKey) {
            login(getLocalApiKey);
        }
        else {
            setLoginSuccess(0);
        }
    }, [])

    useEffect(() => {
        if (loginSuccess === -1) {
            return;
        } else if (loginSuccess === 0) {
            history.push('/');
        } else if (loginSuccess) {
            localStorage.setItem('meraki-api-key', contextApiKey);
            if (window.location.pathname === '/') {
                history.push('/home/');
            }
        }

    }, [loginSuccess, appState]);

    const login = (apikey) => {
        setApiKey(apikey);
        /* Triggered to submit the API Key */
        if ((apikey.length) > 30 && (apikey.length) < 45) {
            const url = "https://n246.meraki.com/api/v0/organizations";
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Accept', 'application/json');
            headers.append('X-Cisco-Meraki-API-Key', apikey);

            const req = new Request(url, {
                method: 'GET',
                headers: headers,
                mode: 'cors',
            });

            fetch(req)
                .then(response => {
                    if (response.ok) {
                        localStorage.setItem('meraki-api-key', apikey);
                        return response.json();
                    } else {
                        throw Error(response.statusText);
                    }
                })
                .then(data => {
                    const orgs = [];
                    data.map(entry => {
                        return orgs.push(entry);
                    });
                    setAppState({contextApiKey: contextApiKey, orgList: orgs});
                    setLoginSuccess(1);
                })
                .catch(error => {
                    setLoginSuccess(0);
                    alert(error);
                });
        } else {
            alert('Invalid API Key!!');
        }
    }

    return (
        <div className="App">
            <Switch>
                <Route exact path="/">
                    <div className="App-body">
                        <Login login={login}/>
                    </div>
                </Route>
                <Route path="/home">
                    <Home/>
                </Route>
            </Switch>
        </div>
    );
}

export default App;
