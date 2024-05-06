import React from 'react';
import {format} from 'date-fns';
import { Link } from 'react-router-dom';
export default function  PostDemo({_id,title,summary,cover,content,createdAt,author}){
    return (
        <div className="post">
            <div className="image">
            <Link to={`/SinglePost/${_id}`}>
            <img src={'http://localhost:5000/'+cover} alt=""/>
            </Link>

              
              </div>
            <div className='text'>
            <Link to={`/SinglePost/${_id}`}>
            <h2>{title}</h2>
            </Link>
            <p className='info'>
             <a className='author'>{author.username}</a> 
            
              
              <time>{format(new Date(createdAt),'MMM d , yyy hh:mm')}</time>
            </p>
            <p className='summary'>{summary}</p>
            </div>
          </div>
      )
} 