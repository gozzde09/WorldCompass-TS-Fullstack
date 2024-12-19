import { useState } from "react";
import { Container } from "react-bootstrap";

import RegisterForm from "../components/RegisterForm";
import LoginForm from "../components/LoginForm";
import backgroundImage from "/bg.avif";
import "../styles/FlipCard.css";

export default function FlipCard() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <main
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
      }}>
      <Container className='d-flex justify-content-center align-items-center'>
        <div className={`flip-card mx-auto mt-5 ${isFlipped ? "flipped" : ""}`}>
          <div className='flip-card-inner'>
            {/* Login Form */}
            <div className='flip-card-front'>
              <LoginForm />
              <p
                className='h5 text-center d-block mt-4 text-decoration-underline flip-button'
                onClick={() => setIsFlipped(true)}>
                No account? Click to register
              </p>
            </div>

            {/* Register Form */}
            <div className='flip-card-back'>
              <RegisterForm />
              <p
                className='h5 text-center  d-block mt-3 text-decoration-underline flip-button'
                onClick={() => setIsFlipped(false)}>
                Have an account? Click to login
              </p>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
