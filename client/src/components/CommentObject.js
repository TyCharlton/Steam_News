import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';



function CommentObject({ news, comments, setComments }) {

    const { currentUser, setUser } = useUser();
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedComment, setEditedComment] = useState('');

    console.log(comments);
    console.log(editingCommentId);
    console.log(editedComment);
    console.log(currentUser);
    console.log(news);

    let id = comments.map(comment => comment.id);
    console.log(id);

    const handleDeleteComment = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:5555/comments/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Failed to delete comment');
            }
            setComments(comments.filter(comment => comment.id!== id));
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };



    const handleUpdateComment = async (id, editedComment) => {
        try {
            const response = await fetch(`http://127.0.0.1:5555/comments/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': document.cookie
                },
                body: JSON.stringify({
                    comment_desc: editedComment,
                    user_id: currentUser.id,
                    news_id: news.id
                }),
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Failed to update comment');
            }
            setComments(comments.map(comment => {
                if (comment.id === id) {
                    return { ...comment, comment_desc: editedComment };
                }
                return comment;
            }));
        } catch (error) {
            console.error('Failed to update comment:', error);
        } finally {
            setEditingCommentId(null);
            setEditedComment('');
        }
    };
    

    
    // console.log(comments.user.name);

    const handleEditingCommentId = (id, initialComment) => {
        setEditingCommentId(id);
        setEditedComment(initialComment);
    };

    return (
        <div>
            <ul>
                {comments.map(comment => (
                    <li key={comment.id}>
                        {editingCommentId === comment.id ? (
                            <Formik
                                initialValues={{ editedComment: comment.comment_desc }}
                                onSubmit={(values) => {
                                    handleUpdateComment(comment.id, values.editedComment);
                                }}
                            >
                                <Form>
                                    <Field as="textarea" name="editedComment" />
                                    <button type="submit">Update</button>
                                    <button onClick={() => setEditingCommentId(null)}>Cancel</button>
                                </Form>
                            </Formik>
                        ) : (
                            <div>
                                <p>{comment.comment_desc}</p>
                                <p>Posted by: {comment.user.name}</p>
                                 {/* Check if user is logged in, then conditionally display edit and delete button */}
                                 {currentUser.id === comment.user_id ? (
                                     <div>
                                         <button onClick={() => handleEditingCommentId(comment.id, comment.comment_desc)}>Edit</button>
                                         <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                                     </div>
                                 ) : (
                                     <div>
                                         <p></p>
                                     </div>
                                 )}
         
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
    





}

export default CommentObject;