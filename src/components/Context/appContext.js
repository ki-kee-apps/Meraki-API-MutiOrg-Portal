import React, {useState, createContext, useEffect} from 'react';

export const AppContext = createContext();

export const AppContextProvider = props => {

    const [appState, _setAppState] = useState({
        orgList: [],
        contextApiKey: '',
        proxyURL: 'https://young-inlet-06199.herokuapp.com/',
    });
    const setAppState = (update) => {
        let state = appState || {};
        state = Object.assign({}, state, update);
        _setAppState(state)
    }
    const [appctx, setAppCtx]= useState([appState, setAppState])

    useEffect(()=>{setAppCtx([appState,setAppState])},[appState]);

    return (
        <AppContext.Provider value={appctx}>
            {props.children}
        </AppContext.Provider>
    );
}