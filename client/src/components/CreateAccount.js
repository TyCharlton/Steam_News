import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, useField, Form } from 'formik';
import * as Yup from 'yup';

function CreateAccount() {
  const navigate = useNavigate();
  const TextInput = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
      <div>
        <label htmlFor={props.id || props.name}>{label}</label>
        <input className="text-input" {...field} {...props} />
        {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>        
        ): null}
      </div>
    );
  };

 
  return (
    <div >
      <Formik 
      initialValues={{
        name: '',
        username: '',
        password: '',
        prof_image_url: ''
      }}
      validationSchema={Yup.object({
        name: Yup.string().required('Name is required'),
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('<PASSWORD>')
      })}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        fetch('http://localhost:5555/createaccount', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values)
      })
    
    .then(response => response.json())
    .then (values => {
       console.log(values);
       navigate('/login');
    })
    .then (setSubmitting(false), resetForm())
      }}
      >
        <Form className = "SubmitForm" > 
        <TextInput type="text" name="name" placeholder="Name" />
        <TextInput type="text" name="username" placeholder="Username" />
        <TextInput type="password" name="password" placeholder="Password" />
        {/* <CreateAccountImage type="image" name="prof_image_url" placeholder="Profile Image URL" /> */}
        <button type="submit">Submit</button>
        </Form>
      </Formik>
    </div> );
}

export default CreateAccount;


