import React, { useState } from "react";

import './login.css';
import '../../assets/styles/global.css';

const Login = (props) => {
    const {login} = props;
    const [apikey, setApiKey] = useState('');

    const login_reset = () => {
        /* Resets the cache and API Key currently being used */
        localStorage.clear();
        setApiKey( '');
    }

    const login_submit = () => {
        login(apikey);
    }

    const input_api_changed = (event) => {
        /* Triggered if API Key field is edited */
        setApiKey( event.target.value);
    }

    const input_enter = (event) => {
        /* Triggered when Return key is pressed in API Key field */
        if (event.key === 'Enter') {
            login_submit();
        }
    }

    return(
        <div>
            <h2>CISCO MERAKI API AUTOMATION</h2>
            <input
                className='input_api_key'
                placeholder='API Key'
                maxLength='100'
                value={apikey}
                onChange={input_api_changed}
                onKeyDown={input_enter}
            />
            <div>
                <button
                    id='btn_login_reset'
                    className='button_reset'
                    onClick={login_reset}
                >Reset</button>
                <button
                    id='btn_login_submit'
                    className='button_submit'
                    onClick={() => {
                        login_submit();
                    }}
                >Submit</button>
            </div>
        </div>
    )
};

export default Login;