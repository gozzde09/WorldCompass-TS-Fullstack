import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import { Button, Form } from "react-bootstrap";
import { User } from "../types/interfaces";

// Validation schema using Yup
const validationSchema = Yup.object({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required"),
});

export default function RegisterForm() {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "danger" | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (values: User) => {
    try {
      await axios.post<User>("/api/users", values, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setAlertMessage(
        "You successfully registered! Redirecting to the homepage..."
      );
      setAlertType("success");
      setTimeout(() => {
        navigate("/home");
      }, 3000);
    } catch (error) {
      console.error("Error adding user:", error);
      setAlertMessage("Error with registration. Please try again!");
      setAlertType("danger");
    }
  };

  return (
    <div>
      <h3 className='card-header'>Register at World Compass</h3>
      {/* Conditionally render alert */}
      {alertMessage && (
        <div className={`alert alert-${alertType}`} role='alert'>
          {alertMessage}
        </div>
      )}
      <Formik
        initialValues={{
          first_name: "",
          last_name: "",
          email: "",
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({ errors, touched }) => (
          <FormikForm id='registerForm'>
            <Form.Group controlId='registerFirstName'>
              <Field
                name='first_name'
                placeholder='First Name'
                type='text'
                as={Form.Control}
                isInvalid={touched.first_name && !!errors.first_name}
              />
              <ErrorMessage
                name='first_name'
                component='div'
                className='invalid-feedback'
              />
            </Form.Group>
            <Form.Group controlId='registerLastName'>
              <Field
                name='last_name'
                placeholder='Last Name'
                type='text'
                as={Form.Control}
                isInvalid={touched.last_name && !!errors.last_name}
              />
              <ErrorMessage
                name='last_name'
                component='div'
                className='invalid-feedback'
              />
            </Form.Group>
            <Form.Group controlId='registerEmail'>
              <Field
                name='email'
                placeholder='Email'
                type='email'
                as={Form.Control}
                isInvalid={touched.email && !!errors.email}
              />
              <ErrorMessage
                name='email'
                component='div'
                className='invalid-feedback'
              />
            </Form.Group>
            <Form.Group controlId='registerPassword'>
              <Field
                name='password'
                placeholder='Password'
                type='password'
                as={Form.Control}
                isInvalid={touched.password && !!errors.password}
              />
              <ErrorMessage
                name='password'
                component='div'
                className='invalid-feedback'
              />
            </Form.Group>
            <Button className='submit' type='submit' id='register'>
              Register
            </Button>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
}
