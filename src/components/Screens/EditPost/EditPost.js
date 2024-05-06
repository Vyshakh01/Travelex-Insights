
import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill';
import { Navigate, useParams } from 'react-router-dom';
import "react-quill/dist/quill.snow.css"; 
import './EditPost.css';
import { set } from 'mongoose';
const modules = {
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{size: []}],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, 
     {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image', 'video'],
    ['clean'],
  ]};
const formats=[
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video',
  'emoji', 'mention'
];


const EditPost = () => {
  const {id}=useParams();
  const [title,setTitle]=useState('');
    const [summary,setSummary]=useState('');
    const [content,setContent]=useState('');
    const [files,setFiles]=useState('');
    const [redirect,setRedirect]=useState(false);

    useEffect(()=>{
      fetch('http://localhost:5000/SinglePost/'+id)
        .then(response=>{
          response.json().then(postInfo =>{
            setTitle(postInfo.title);
            setContent(postInfo.content);
            setSummary(postInfo.summary);
          })
        })

    },[])

    

   async function updatePost(ev){
    ev.preventDefault();
    const data =new FormData();
    data.set('title',title);
    data.set('summary',summary);
    data.set('content',content);
    data.set('id',id);
    if (files?.[0]){
      data.set('file',files?.[0])
    }
   
  await fetch('http://localhost:5000/EditPost',{
    method:'PUT',
    body:data,
    credentials:'include',
    });
   
      setRedirect(true);
    
   

   }
  if(redirect){
    return <Navigate to={`/SinglePost/${id}`} />
  }
  
    return (
      
      <div className='createpost'>  
          <form onSubmit={updatePost}>
          <input type='title'
           placeholder={'Title'}
           value={title}
           onChange={e=>setTitle(e.target.value)}
           />
  
          <input type='summary'
           placeholder={'Summary'}
           value={summary}
           onChange={e=>setSummary(e.target.value)}/>
  
          <input type='file'
          
          onChange={ev=>setFiles(ev.target.files)}
          multiple={true}
          />
          <ReactQuill 
          value={content}
           onChange={newValue=>setContent(newValue)}
           modules={modules}
           formats={formats}/>
           <button className='createbutton' type='submit' style={{margin:'5px'}}>Update post</button>
      </form>
  
      </div>
      
    )
}

export default EditPost