import React, { useState, useEffect } from 'react';

function SteamNews() {
    const [news, setNews] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedComment, setEditedComment] = useState('');

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
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch news:', error);
                setLoading(false);
            }
        }

        if (searchQuery.trim() !== '') {
            fetchNews();
        }
    }, [searchQuery]);

    useEffect(() => {
        async function fetchComments() {
            try {
                const response = await fetch('http://127.0.0.1:5555/comments');
                if (!response.ok) {
                    throw new Error('Failed to fetch comments');
                }
                const data = await response.json();
                setComments(data);
            } catch (error) {
                console.error('Failed to fetch comments:', error);
            }
        }

        fetchComments();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim() || isNaN(searchQuery)) {
            console.error('Invalid search query:', searchQuery);
        } else {
            setSearchQuery(searchQuery);
        }
    };

    const handleAddComment = async () => {
        try {
            const response = await fetch('http://localhost:5555/check_session');
            if (response.ok) {
                const commentResponse = await fetch('http://localhost:5555/comments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        game_id: news?.game_id,
                        comment: comment
                    })
                });
                if (!commentResponse.ok) {
                    throw new Error('Failed to add comment');
                }
                const data = await commentResponse.json();
                setComments([...comments, data]);
                setComment('');
            } else if (response.status === 401) {
                console.error('User is not logged in');
                // Handle unauthorized user (e.g., redirect to login page)
            } else {
                throw new Error('Failed to check session');
            }
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };
    
    
    
    

    const handleDeleteComment = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:5555/comments/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Failed to delete comment');
            }
            setComments(comments.filter(comment => comment.id !== id));
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    const handleUpdateComment = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:5555/comments/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    comment: editedComment
                })
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

    const handleEditingCommentId = (id, initialComment) => {
        setEditingCommentId(id);
        setEditedComment(initialComment);
    };

    return (
        <div>
            <h1>Search News by app_id</h1>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter app_id"
                />
                <button type="submit">Search</button>
            </form>
            {loading && <p>Loading...</p>}
            {news && (
                <div>
                    <h2>{news.news_title}</h2>
                    <p>{news.news_desc}</p>
                    <p>Author: {news.news_author}</p>
                    <p>Date: {news.news_date}</p>
                    <a href={news.game_url}>Read more</a>
                    <h3>Comments</h3>
                    <ul>
                        {comments.map(comment => (
                            <li key={comment.id}>
                                {editingCommentId === comment.id ? (
                                    <div>
                                        <textarea value={editedComment} onChange={(e) => setEditedComment(e.target.value)} />
                                        <button onClick={() => setEditingCommentId(null)}>Cancel</button>
                                        <button onClick={() => handleUpdateComment(comment.id)}>Update</button>
                                    </div>
                                ) : (
                                    <div>
                                        <p>{comment.comment_desc}</p>
                                        <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                                        <button onClick={() => handleEditingCommentId(comment.id, comment.comment_desc)}>Edit</button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                    <div>
                        <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
                        <button onClick={handleAddComment}>Add Comment</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SteamNews;
