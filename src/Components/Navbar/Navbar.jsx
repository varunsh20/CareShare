import "./NavbarStyles.css";
import { ConnectWallet, ChainId,useNetworkMismatch,useNetwork,useAddress} from "@thirdweb-dev/react";
import { useState,useEffect} from "react";
import {Link} from "react-router-dom";
import { ethers } from "ethers";
import {TailSpin} from 'react-loader-spinner';
import Patients from '../../../contracts/artifacts/contracts/Patients.sol/Patients.json';
import Doctors from '../../../contracts/artifacts/contracts/Doctors.sol/Doctors.json';

export default function Navbar(){

    const [account,setAccount] = useState("");
    const [isConnected,setConnected] = useState(false);
    const [patientExists,setPExists] = useState(false);
    const [doctorExists,setDExists] = useState(false);
    const [loading,setLoading] = useState(true);

    const Patient_Address = import.meta.env.VITE_P_ADDRESS;
    const Doctor_Address = import.meta.env.VITE_D_ADDRESS
    const RPC_URL =  import.meta.env.VITE_RPC_URL;

    //This allows users to connect to their metamask wallet in case the page is refreshed.
    useEffect(()=>{
        connectHandler();
    },[window.ethereum])
    

    //Function for connecting metamask wallet.
    const connectHandler = async () => {
        if(window.ethereum){
        await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x13882' }], // chainId must be in hexadecimal numbers
              });
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'});
        const c_account = ethers.utils.getAddress(accounts[0])
        setAccount(c_account);
        setConnected(true);
        }
        else{
            toast.warn("Please install MetaMask.")
        }
    }

    function reloadPage() {
        window.location.reload(true);
      }
      // Checks for account changes
      
      if (window.ethereum) {
        window.ethereum.on('accountsChanged', reloadPage);
      }

    useEffect(()=>{
        async function checkProfile(){
                const accounts = await ethereum.request({method:'eth_accounts'});
                if(accounts.length!=0){
                    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
                    const pContract = new ethers.Contract(Patient_Address,Patients.abi,provider);
                    const dContract = new ethers.Contract(Doctor_Address,Doctors.abi,provider);

                    const pExists = await pContract.checkPatientExists(accounts[0]);
                    const dExists = await dContract.checkDoctorExists(accounts[0]);
                    setPExists(pExists);
                    setDExists(dExists);
                }
                setLoading(false);
            }
        checkProfile();
    },[])

    return(
        <div className="nav-bar">
            <div className="logo">
                <h2>CareShare</h2>
            </div>

            <div className="menu-icons">
            <Link to="/">Home</Link>
            <Link to="/viewDoctors">View Doctors</Link>
            {loading ? (
                <div className="spinner">
                <TailSpin height={150} />
                </div>
            ) : (
            <div>
            {account == "" || (!patientExists && !doctorExists) ? (
            <>
            <Link to="/patientRegister">Patient</Link>
            <Link to="/doctorRegister">Doctor</Link>
            </>
            ) : (
            <>
            {patientExists && <Link to="/patientsProfile">My Profile</Link>}
            {doctorExists && <Link to="/doctorsProfile">My Profile</Link>}
            </>
            )}
            </div>
            )}
            </div>
            <div className="sbtn">
                <ConnectWallet className="wbtn"/>
            </div>
        </div>
    )
}
