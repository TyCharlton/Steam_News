import React, { useState, useEffect } from'react';
import { Formik, useField, Form } from 'formik';
import * as Yup from 'yup';
import { useUser } from './UserContext';

function CommentForm({ news }) {

    const {currentUser, setCurrentUser} = useUser()

    
    const CommentTextInput = ({ label, ...props }) => {
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
    
    
    <Formik 
        initialValues={{
            user_id: currentUser.id,
            news_id: news.id,
            comment_desc: ''
        }}
        validationSchema={Yup.object({
            comment_desc: Yup.string().required('Comment is required')
        })}
        onSubmit={(values, { setSubmitting, resetForm }) => {
            fetch('http://127.0.0.1:5555/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values)
        })
        
        .then(response => response.json())
        .then (values => {
        console.log(values);
        })
        .then (setSubmitting(false), resetForm())
        }}
        >
        <Form className = "SubmitForm" > 
            <CommentTextInput type="text" name="comment_desc" placeholder="Comment" />
            <button type="submit" >Submit</button>
        </Form>
    </Formik>


}

export default CommentForm;
