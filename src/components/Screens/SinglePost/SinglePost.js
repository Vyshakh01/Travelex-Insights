import React, { useContext, useEffect, useState } from 'react'
import './SinglePost.css'
import Header from '../Mainscreen/Header'
import { Link, useParams } from 'react-router-dom'
import { formatISO9075 } from 'date-fns'
import { UserContext } from '../../usercontext/userContext'


const SinglePost = () => {
    const {id}=useParams();
    const {userInfo}=useContext(UserContext);
    const [comment,setComment]=useState('');
   
    const [postInfo,setPostInfo]=useState(null);
    useEffect(()=>{
      
        fetch(`http://localhost:5000/SinglePost/${id}`).then(response=>{
      response.json().then(postInfo=>{
       setPostInfo(postInfo);
     //  console.log(postInfo.comments);
      })


     })
    },[])

   async function submitComment(e){
    
   
    const response=await fetch('http://localhost:5000/Comment',{
      method:'POST',
      headers:{"Content-Type":"application/json"},
       body:JSON.stringify({"postId":postInfo._id,"authorname":userInfo.username,"commentText":comment},  
      )
     });
      

    }


    if (!postInfo) return ' ';


  return (
    <div className='main'>
      <div className='SinglePost'>
        <Header></Header>
        <h1>{postInfo.title}</h1>
       
        
        <time>{formatISO9075(new Date((postInfo.createdAt)))}</time>
        <div className='author'>{postInfo.author.username}</div>
        {userInfo.id===postInfo.author._id && (
           <div className='Edit-row'>
           
           <Link className='Edit-btn' to={`/Edit/${postInfo._id}`}>
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
            Edit this post</Link>
          
         </div>
          
        )}
        <div className='image'>
          <img src={`http://localhost:5000/${postInfo.cover}`}></img>
        </div>
        
        <div className="content" dangerouslySetInnerHTML={{__html:postInfo.content}}/>

        
        {userInfo.id&& (
           
          <div>
             <form className='form' onSubmit={submitComment}>
           <input className='input'
           value={comment}
           type='text'
           placeholder={'Add a comment'}
           
            onChange={(e)=>{setComment(e.target.value)}}
         />
         
           </form>
          
          </div>          
        )}

      
      
        
        <div className='comments'>
          <h6>Comments..</h6>
    {postInfo.comments.map((cmnt) => (
        <div key={cmnt._id} className='comment'>
          <p className='commenter'>{cmnt.author}</p>
            <p className='text'>{cmnt.comment}</p>
            {/* Optional: Add a reply input box */}
            {userInfo.id === postInfo.author._id && (
                <input type='text' placeholder='Reply' className='reply-input' />
            )}
        </div>
    ))}
</div>

        
        </div>

    </div>

    
  )
}

export default SinglePost