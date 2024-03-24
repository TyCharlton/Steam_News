import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import CommentForm from './CommentForm';
import CommentObject from './CommentObject';

function SteamNews() {
    const [news, setNews] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState([]);
    const { currentUser, setUser } = useUser();

    useEffect(() => {
        async function fetchNews() {
            try {
                setLoading(true);
                const response = await fetch(`http://127.0.0.1:5555/news/${searchQuery}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch news');
                }
                const data = await response.json();
                setNews(data);
                console.log(data.comments);
                setComments(data.comments);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch news:', error);
                setLoading(false);
            }
        }

        if (searchQuery.trim()!== '') {
            fetchNews();
        }
    }, [searchQuery]);

    const handleSearch = async (values, { setSubmitting }) => {
        try {
            setSearchQuery(values.app_id);
        } finally {
            setSubmitting(false);
        }
    };

    function handleNewComment(newComment) {
        console.log(newComment); 
        if (newComment && newComment.id) {
            setNews(prevNew => ({
                ...prevNew,
                comments: [...prevNew.comments, newComment]
            }));
        } else {
            console.error('Attempted to add an undefined or invalid Comment:', newComment);
        }
    };

    

    

    return (
        <div>
            <h1>Search News by app_id</h1>
            <Formik
                initialValues={{ app_id: '' }}
                validationSchema={Yup.object({
                    app_id: Yup.string()
                       .required('Required')
                       .matches(/^\d+$/, 'Must be a number'),
                })}
                onSubmit={handleSearch}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <Field type="text" name="app_id" placeholder="Enter app_id" />
                        <ErrorMessage name="app_id" />
                        <button type="submit" disabled={isSubmitting}>Search</button>
                    </Form>
                )}
            </Formik>
            {loading && <p>Loading...</p>}
            {news && (
                <div>
                    <h2>{news.news_title}</h2>
                    <p>{news.news_desc}</p>
                    <p>Author: {news.news_author}</p>
                    <p>Date: {new Date(news.news_date).toLocaleString()}</p>
                    <a href={news.game_url}>Read more</a>
                    <h3>Comments</h3>
                    <CommentObject news={news} comments={comments} setComments={setComments}/>
                    <CommentForm news={news} newComment={handleNewComment}/>
                </div>
            )}

        </div>
    );
}

export default SteamNews;
