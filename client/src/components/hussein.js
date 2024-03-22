// const CommentTextInput = ({lable, ...props}) => {
        
//     const [field, meta] = useField(props)
//     return(
//         <div className='form-group'>
//             <lable htmlFor={props.id || props.name}>{lable}</lable>
//             <input className='text-input' {...field} {...props} />
//             {meta.touched && meta.error ? (
//                 <div className='error'>{meta.error}</div>
//             ) : null}
//         </div>
//     )
// }
// return (
// <div className='login-heading'>
//         <h1>Login</h1>
//         <div> 
//             <Formik
//                 initialValues={{
//                     user_id: currentUser?.id,
//                     comment_desc: '',
//                     game_id: news?.game_id
//                 }}
//                 validationSchema={Yup.object({
//                     username: Yup.string()
//                     .required('Username is required.'),
//                     password: Yup.string()
//                     .required('Password is required')
//                 })}
//                 onSubmit={(values, { setSubmitting, resetForm }) => {
                    
//                     fetch(`http://localhost:5555/comments`, {
//                         method: 'POST',
//                         headers: {
//                             'Content-Type': 'application/json'
//                         },
//                         body: JSON.stringify(values)    
//                     })
//                     .then(res => res.json())
//                     .then(values => {
//                         console.log(values)
                       
                        
//                         setComments([...comments, values]);
//                     })
//                     .then( setSubmitting(false), resetForm() );
//                 }}

//                 >
//                     <Form className='login-Form'>
//                         <CommentTextInput type="text" name="comment" lable="comment" />
//                         <button type="submit">comment</button>
//                     </Form>
//             </Formik>
//         </div>
//     </div>
// )

// }

// import React, { useState, useEffect } from 'react';
// import { useUser } from './UserContext';
// import { Formik, Form, Field } from 'formik';
// import * as Yup from 'yup';

// function SteamNews() {
//     const [news, setNews] = useState(null);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [comment, setComment] = useState('');
//     const [comments, setComments] = useState([]);
//     const [editingCommentId, setEditingCommentId] = useState(null);
//     const [editedComment, setEditedComment] = useState('');
//     const { currentUser, setCurrentUser } = useUser();

//     useEffect(() => {
//         async function fetchNews() {
//             try {
//                 setLoading(true);
//                 const response = await fetch(`http://127.0.0.1:5555/news/${searchQuery}`);
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch news');
//                 }
//                 const data = await response.json();
//                 setNews(data);
//                 setLoading(false);
//             } catch (error) {
//                 console.error('Failed to fetch news:', error);
//                 setLoading(false);
//             }
//         }

//         if (searchQuery.trim() !== '') {
//             fetchNews();
//         }
//     }, [searchQuery]);

//     useEffect(() => {
//         async function fetchComments() {
//             try {
//                 const response = await fetch('http://127.0.0.1:5555/comments');
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch comments');
//                 }
//                 const data = await response.json();
//                 setComments(data);
//             } catch (error) {
//                 console.error('Failed to fetch comments:', error);
//             }
//         }

//         fetchComments();
//     }, []);

//     const handleSearch = async (values) => {
//         setSearchQuery(values.searchQuery);
//     };

//     const handleAddComment = async (values) => {
//         try {
//             if (currentUser) {
//                 const commentResponse = await fetch('http://localhost:5555/comments', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify({
//                         game_id: news?.game_id,
//                         comment_desc: values.comment
//                     })
//                 });
//                 if (!commentResponse.ok) {
//                     throw new Error('Failed to add comment');
//                 }
//                 const data = await commentResponse.json();
//                 setComments([...comments, data]);
//                 setComment('');
//             } else {
//                 console.error('User is not logged in');
//             }
//         } catch (error) {
//             console.error('Failed to add comment:', error);
//         }
//     };

//     const handleDeleteComment = async (id) => {
//         try {
//             const response = await fetch(`http://127.0.0.1:5555/comments/${id}`, {
//                 method: 'DELETE'
//             });
//             if (!response.ok) {
//                 throw new Error('Failed to delete comment');
//             }
//             setComments(comments.filter(comment => comment.id !== id));
//         } catch (error) {
//             console.error('Failed to delete comment:', error);
//         }
//     };

//     const handleUpdateComment = async (id, values) => {
//         try {
//             const response = await fetch(`http://127.0.0.1:5555/comments/${id}`, {
//                 method: 'PATCH',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     comment: values.editedComment
//                 })
//             });
//             if (!response.ok) {
//                 throw new Error('Failed to update comment');
//             }
//             setComments(comments.map(comment => {
//                 if (comment.id === id) {
//                     return { ...comment, comment_desc: values.editedComment };
//                 }
//                 return comment;
//             }));
//         } catch (error) {
//             console.error('Failed to update comment:', error);
//         } finally {
//             setEditingCommentId(null);
//             setEditedComment('');
//         }
//     };

//     const handleEditingCommentId = (id, initialComment) => {
//         setEditingCommentId(id);
//         setEditedComment(initialComment);
//     };

//     return (
//         <div>
//             <h1>Search News by app_id</h1>
//             <Formik
//                 initialValues={{
//                     searchQuery: ''
//                 }}
//                 validationSchema={Yup.object({
//                     searchQuery: Yup.string().required('Search query is required')
//                 })}
//                 onSubmit={(values, { setSubmitting }) => {
//                     handleSearch(values);
//                     setSubmitting(false);
//                 }}
//             >
//                 {formik => (
//                     <form onSubmit={formik.handleSubmit}>
//                         <Field
//                             type="text"
//                             name="searchQuery"
//                             placeholder="Enter app_id"
//                         />
//                         <button type="submit">Search</button>
//                     </form>
//                 )}
//             </Formik>

//             {loading && <p>Loading...</p>}
//             {news && (
//                 <div>
//                     <h2>{news.news_title}</h2>
//                     <p>{news.news_desc}</p>
//                     <p>Author: {news.news_author}</p>
//                     <p>Date: {news.news_date}</p>
//                     <a href={news.game_url}>Read more</a>
//                     <h3>Comments</h3>
//                     <ul>
//                         {comments.map(comment => (
//                             <li key={comment.id}>
//                                 {editingCommentId === comment.id ? (
//                                     <div>
//                                         <Field
//                                             as="textarea"
//                                             name="editedComment"
//                                             value={editedComment}
//                                             onChange={(e) => setEditedComment(e.target.value)}
//                                         />
//                                         <button onClick={() => setEditingCommentId(null)}>Cancel</button>
//                                         <button onClick={() => handleUpdateComment(comment.id, formik.values)}>Update</button>
//                                     </div>
//                                 ) : (
//                                     <div>
//                                         <p>{comment.comment_desc}</p>
//                                         <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
//                                         <button onClick={() => handleEditingCommentId(comment.id, comment.comment_desc)}>Edit</button>
//                                     </div>
//                                 )}
//                             </li>
//                         ))}
//                     </ul>
//                     <Formik
//                         initialValues={{
//                             comment: ''
//                         }}
//                         validationSchema={Yup.object({
//                             comment: Yup.string().required('Comment is required')
//                         })}
//                         onSubmit={(values) => {
//                             handleAddComment(values);
//                         }}
//                     >
//                         {formik => (
//                             <form onSubmit={formik.handleSubmit}>
//                                 <Field
//                                     as="textarea"
//                                     name="comment"
//                                     placeholder="Enter your comment"
//                                 />
//                                 <button type="submit">Add Comment</button>
//                             </form>
//                         )}
//                     </Formik>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default SteamNews;

// allowed_endpoints = ['create_account', 'login', 'logout', 'check_session', 'get_games', 'get_game', 'comments', 'news', 'steamnews', 'games', 'get_comments', 'get_news', 'get_steamnews', 'get_news_for_app', 'get_update_or_delete_user']
// @app.before_request
// def check_if_logged_in():
//     if not session.get('user_id') and request.endpoint not in allowed_endpoints:
//         return {'error': 'Unauthorized'}, 401
//     if request.method == 'OPTIONS':
//         return None