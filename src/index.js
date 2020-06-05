import React  from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";

import './index.css';
import App from './components/App/App';
import * as serviceWorker from './serviceWorker';
import {AppContextProvider} from "./components/Context/appContext";

const routing = (
    <BrowserRouter>
        <div>
            <App />
        </div>
    </BrowserRouter>
);

ReactDOM.render(
  <React.StrictMode>
      <AppContextProvider>
          { routing }
      </AppContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
