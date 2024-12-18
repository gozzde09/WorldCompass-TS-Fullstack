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
      const response = await axios.post("/api/users", values, {
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
      <h3 className='card-header my-2'>Register at World Compass</h3>
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
                as={Form.Control}
                isInvalid={touched.first_name && !!errors.first_name}
                name='first_name'
                placeholder='First Name'
                type='text'
              />
              <ErrorMessage
                className='invalid-feedback'
                component='div'
                name='first_name'
              />
            </Form.Group>
            <Form.Group controlId='registerLastName'>
              <Field
                as={Form.Control}
                isInvalid={touched.last_name && !!errors.last_name}
                name='last_name'
                placeholder='Last Name'
                type='text'
              />
              <ErrorMessage
                className='invalid-feedback'
                component='div'
                name='last_name'
              />
            </Form.Group>
            <Form.Group controlId='registerEmail'>
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
            <Form.Group controlId='registerPassword'>
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
            <Button className='submitButton mt-3' type='submit' id='register'>
              Register
            </Button>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
}
