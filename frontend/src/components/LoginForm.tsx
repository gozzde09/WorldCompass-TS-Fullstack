import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import { Button, Form } from "react-bootstrap";
import { User } from "../types/interfaces";

// Validation schema for login
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required"),
});

export default function LoginForm() {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "danger" | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (values: User) => {
    try {
      const response = await axios.post("/api/login", values, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setAlertMessage("Login successful! Redirecting to the homepage...");
      setAlertType("success");

      //Local Storage
      const user = {
        userId: response.data.user.user_id,
        userName: response.data.user.first_name,
      };
      localStorage.setItem("user", JSON.stringify(user));

      setTimeout(() => {
        navigate("/home");
      }, 2000);
    } catch (error) {
      console.error("Error with login:", error);
      setAlertMessage("Invalid email or password.Please try again!");
      setAlertType("danger");
    }
  };

  return (
    <div>
      <h3 className='card-header mb-4 mt-2'>Login to World Compass</h3>
      {/* Conditionally render alert */}
      {alertMessage && (
        <div className={`alert alert-${alertType}`} role='alert'>
          {alertMessage}
        </div>
      )}
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({ errors, touched }) => (
          <FormikForm id='loginForm'>
            <Form.Group controlId='loginEmail'>
              <Field
                as={Form.Control}
                isInvalid={touched.email && !!errors.email}
                name='email'
                placeholder='Email'
                type='email'
              />
              <ErrorMessage
                className='invalid-feedback'
                component='div'
                name='email'
              />
            </Form.Group>
            <Form.Group controlId='loginPassword'>
              <Field
                as={Form.Control}
                isInvalid={touched.password && !!errors.password}
                name='password'
                placeholder='Password'
                type='password'
              />
              <ErrorMessage
                className='invalid-feedback'
                component='div'
                name='password'
              />
            </Form.Group>
            <Button className='submitButton mt-4' type='submit' id='login'>
              Login
            </Button>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
}
