import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ThirdwebProvider} from "@thirdweb-dev/react";
import 'bootstrap/dist/css/bootstrap.css';

import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <ThirdwebProvider 
  clientId="1dd340fb1746ae8918c5d7d9bb8fbc68"
  activeChain="mumbai">
    <App />
  </ThirdwebProvider>
  </React.StrictMode>,
)
