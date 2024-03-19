import React, { useState, useEffect } from 'react';

function SteamNews() {
    const [news, setNews] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

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

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim() || isNaN(searchQuery)) {
            console.error('Invalid search query:', searchQuery);
            // Display an error message or handle the invalid search query
        } else {
            setSearchQuery(searchQuery);
        }
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
                </div>
            )}
        </div>
    );
}

export default SteamNews;
