import hp from "../../assets/hsp.jpg"
import "./HomeStyles.css";

export default function Home(){

    
    return(
        <div className="home">
        <div class="rw">
        <div class="column1">
                <h3>
<p>Welcome to CareShare - Your Ultimate Decentralized Healthcare Solution! Seamlessly register, book appointments, and securely share your medical information anytime, anywhere,
     knowing that your data is completely stored on our decentralized platform. Experience the ease of collaborating with trusted doctors and healthcare providers, ensuring you
      receive the best care possible while maintaining full control and privacy over your health records.</p>
<br></br>

<p>With CareShare's cutting-edge technology, you can also enjoy the convenience of online consultations with your preferred healthcare professionals. Connect with doctors
     from the comfort of your home, making healthcare accessible and efficient like never before. Join us today and revolutionize your healthcare journey with CareShare!.</p>
     </h3>
        </div>
        <div class="column2">
            <img src={hp} alt="img" width="1000px"></img>
        </div>
        </div>
    </div>
    );
}