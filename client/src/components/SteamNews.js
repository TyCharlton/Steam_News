import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import { useLocation } from 'react-router-dom';
import CommentForm from './CommentForm';
import CommentObject from './CommentObject';
import emailjs from 'emailjs-com';

function SteamNews() {
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState([]);
    const { currentUser, setUser } = useUser();
    const location = useLocation();
    const searchQuery = location.pathname.split('/').pop();

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

    function handleNewComment(newComment) {
        if (newComment && newComment.id) {
            setNews(prevNew => ({
                ...prevNew,
                comments: [...prevNew.comments, newComment]
            }));
        } else {
            console.error('Attempted to add an undefined or invalid Comment:', newComment);
        }
    };

    function sendEmail() {
        const templateParams = {
            to_email: currentUser.username,
            article_link: news.game_url
        };
    
        emailjs.send('gmail', 'template_0xsv31s', templateParams, 'JhZs0fRYqAurTV7O8')
            .then((response) => {
                console.log('Email sent:', response);
                alert('Email sent successfully!');
            })
            .catch((error) => {
                console.error('Email error:', error);
                alert('Failed to send email. Please try again later.');
            });
    }

    function renderImagesFromDesc(newsDesc) {
        const imageRegex = /{STEAM_CLAN_IMAGE}\/\d+\/[a-f0-9]+.png/g;
        const renderedDesc = newsDesc.replace(imageRegex, '');
        return { __html: renderedDesc };
    }
    
    

    return (
        <div>
            {loading && <p>Loading...</p>}
            {news && (
                <div className="steam-news">
                    <div className="news-container">
                        <h2 className="game-title">{news.game_title}</h2>
                        <h2 className="news-title">{news.news_title}</h2>
                        <div dangerouslySetInnerHTML={renderImagesFromDesc(news.news_desc)}></div>
                        <p className="news-author">Author: {news.news_author}</p>
                        <p className="news-date">Date: {new Date(news.news_date).toLocaleString()}</p>
                        <a href={news.game_url}>Read more</a>
                    </div>
                    <div className="comments-container">
                        <h3>Comments</h3>
                        <CommentObject news={news} comments={comments} setComments={setComments}/>
                        <CommentForm news={news} newComment={handleNewComment} comments={comments} setComments={setComments}/>
                    </div>
                    {currentUser && (
                        <button className="save-button" onClick={sendEmail}>Save for later</button>
                    )}
                </div>
            )}
        </div>
    );
}

export default SteamNews;
