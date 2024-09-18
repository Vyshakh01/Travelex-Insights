import React, { useState } from 'react'
import ReactQuill from 'react-quill';
import { Navigate } from 'react-router-dom';
import "react-quill/dist/quill.snow.css"; 
import './CreatePost.css'
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

const CreatePost = () => {
    const [title,setTitle]=useState('');
    const [summary,setSummary]=useState('');
    const [content,setContent]=useState('');
    const [files,setFiles]=useState('');
    const [redirect,setRedirect]=useState(false)




 async function createNewPost(ev){
    const data =new FormData();
    data.set('title',title);
    data.set('summary',summary);
    data.set('content',content);
    data.set('file',files[0])
    ev.preventDefault();
    console.log(files)
   const response=await fetch('http://localhost:5000/createpost',{
     method:'POST',
      body:data,  
      credentials:'include',

    });
    if(response.ok){
      setRedirect(true)
    }
   
  }
if(redirect){
  return <Navigate to={'/MainScreen'} />
}

  return (
    <div className='createpost'>

<form 
      onSubmit={createNewPost}
      className='formcreate'>
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
         <button className='createbutton' type='submit' style={{margin:'5px'}}>Create post</button>
    </form>

    </div>
    
  )
}

export default CreatePost