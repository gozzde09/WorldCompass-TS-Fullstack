import { useState } from "react";
import { Container } from "react-bootstrap";

import backgroundImage from "/bg.avif";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import "../styles/FlipCard.css";

export default function FlipCard() {
  const [isFlipped, setIsFlipped] = useState(false);

  const toggleCard = (e: React.MouseEvent) => {
    if (
      e.target instanceof HTMLButtonElement ||
      e.target instanceof HTMLInputElement
    ) {
      return;
    }
    setIsFlipped(!isFlipped);
  };

  return (
    <main
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
      }}>
      <Container className='d-flex justify-content-center'>
        <div
          className={`flip-card ${isFlipped ? "flipped" : ""}`}
          onClick={toggleCard}>
          <div className='flip-card-inner'>
            {/* Login Form */}
            <div className='flip-card-front'>
              <LoginForm />
              <p
                className='text-center text-warning d-block mt-4 flip-button'
                onClick={() => setIsFlipped(true)}>
                No account? Click to register
              </p>
            </div>

            {/* Register Form */}
            <div className='flip-card-back'>
              <RegisterForm />
              <p
                className='text-center text-warning d-block mt-3 flip-button'
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
