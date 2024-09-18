import React, { useEffect, useState } from 'react';
import PostDemo from './PostDemo';

const IndexPage = () => {
    const [posts, setPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Fetch the posts from the API
        fetch('http://localhost:5000/createpost')
            .then(response => response.json())
            .then(posts => {
                setPosts(posts);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
            });
    }, []);

    // Filter the posts based on the search query
    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
 
    return (
        <>
            {/* Search bar at the top */}
            <input
                type="text"
                className='searchbar'
                placeholder="Search posts..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ marginBottom: '10px', padding: '5px' }}
            />

            {/* Render the filtered posts */}
            {filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
                    <PostDemo key={post.id} {...post} />
                ))
            ) : (
                <p>No posts found</p>
            )}
        </>
    );
};

export default IndexPage;
