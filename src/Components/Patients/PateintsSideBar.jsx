import lg from "../../assets/lg.png"
import "./PSideBar.css";
import {Link} from "react-router-dom";

export default function SideBar(){

    return(
        <>
        <div className="cntnt">
            <div className="sidebar">
                <div className="profile">
                    <div className="log">
                        <img src = {lg} alt="logo"></img>
                    </div>
                    <div className = "items">
                    <Link className="product" to ="/patientsProfile">
                        Basic Info
                    </Link>
                    <Link className="product" to = "/history">
                        Medical History
                    </Link>
                    <Link className="product" to ="/pappointments">
                       My Appointments
                    </Link>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
}