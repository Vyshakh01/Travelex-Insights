import React, { useEffect, useState,} from 'react'
import PostDemo from './PostDemo';
const IndexPage = () => {
  const [posts,setPosts]=useState([]);
   useEffect(()=>{
    fetch('http://localhost:5000/createpost').then(response=>{
      response.json().then(posts=>{
        setPosts(posts)
      })
    })
   },[])
  return (
    <>
      {posts.length>0 && posts.map(post=>(
        
        <PostDemo {...post} > </PostDemo>
      ))}
    </>
    
  )
}

export default IndexPage