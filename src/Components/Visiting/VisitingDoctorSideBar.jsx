import lg from "../../assets/lg.png"
import "./visitingpatient.css";
import {Link} from "react-router-dom";


export default function VisitingDoctorSideBar(props){
    const addr = props.data
    return(
         <>
        <div className="cntnt">
            <div className="sidebar">
                <div className="profile">
                    <div className="log">
                        <img src = {lg} alt="logo"></img>
                    </div>
                    <div className = "items">
                    <Link className="product" to = {`/patient/${addr}`}>
                        Basic Info
                    </Link>
                    <Link className="product" to =  {`/history/${addr}`}>
                        Medical History
                    </Link>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
}