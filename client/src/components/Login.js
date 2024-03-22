import React from 'react';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';

function UserLogin() {

    const {currentUser, setCurrentUser} = useUser()
    const navigate = useNavigate()

     const LoginTextInput = ({lable, ...props}) => {
        
        const [field, meta] = useField(props)
        return(
            <div className='form-group'>
                <lable htmlFor={props.id || props.name}>{lable}</lable>
                <input className='text-input' {...field} {...props} />
                {meta.touched && meta.error ? (
                    <div className='error'>{meta.error}</div>
                ) : null}
            </div>
        )
    }

    return(
        <div className='login-heading'>
            <h1>Login</h1>
            <div> 
                <Formik
                    initialValues={{
                        username: "",
                        password: ""
                    }}
                    validationSchema={Yup.object({
                        username: Yup.string()
                        .required('Username is required.'),
                        password: Yup.string()
                        .required('Password is required')
                    })}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        
                        fetch(`http://localhost:5555/login`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(values)    
                        })
                        .then(res => res.json())
                        .then(values => {
                            console.log(values)
                            setCurrentUser(values)
                            sessionStorage.setItem('currentUser', JSON.stringify(values))
                            navigate('/')
                        })
                        .then( setSubmitting(false), resetForm() );
                    }}

                    >
                        <Form className='login-Form'>
                            <LoginTextInput type="text" name="username" lable="Username" />
                            <LoginTextInput type="password" name="password" lable="Password" />
                            <button type="submit">Login</button>
                        </Form>
                </Formik>
            </div>
        </div>
    )


}

export default UserLogin;