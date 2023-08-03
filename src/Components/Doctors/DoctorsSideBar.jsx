import lg from "../../assets/lg.png"
import "./DSideBar.css";
import {Link} from "react-router-dom";

export default function DoctorsSideBar(){

    return(
        <>
        <div className="cntnt">
            <div className="sidebar">
                <div className="profile">
                    <div className="log">
                        <img src = {lg} alt="logo"></img>
                    </div>
                    <div className = "items">
                    <Link className="product" to ="/doctorsProfile">
                        Basic Info
                    </Link>
                    <Link className="product" to = "/pconsultations">
                        My Consultations
                    </Link>
                    <Link className="product" to ="/appointments">
                       My Appointments
                    </Link>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
}