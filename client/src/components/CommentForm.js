import React, { useState, useEffect } from'react';
import { Formik, useField, Form } from 'formik';
import * as Yup from 'yup';
import { useUser } from './UserContext';

function CommentForm({ news, newComment, comments, setComments }) {

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
    
    return(
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
                fetch('http://localhost:5555/comments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: currentUser.id,
                        news_id: news.id,
                        comment_desc: values.comment_desc
                    }),
                    credentials: 'include'
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to submit comment');
                    }
                    return response.json();
                })
                .then(data => {
                    newComment(data);
                    setComments([...comments, data]);
                    setSubmitting(false);
                    resetForm();
                    console.log(data);
                })
                .catch(error => {
                    console.error('Error submitting comment:', error);
                    setSubmitting(false);
                });
            }}
            
            
            >
            <Form className = "SubmitForm" > 
                <CommentTextInput type="text" name="comment_desc" placeholder="Comment" />
                <button type="submit" >Submit</button>
            </Form>
        </Formik>
    )



}

export default CommentForm;
