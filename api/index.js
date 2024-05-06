
const express = require('express');
const cors=require('cors');
const mongoose = require('mongoose');
const User=require('./models/User');
const app=express();
const bcrypt=require("bcrypt");
const jwt =require("jsonwebtoken");
const cookieParser = require('cookie-parser')
const multer=require('multer');
const uploadMiddleware=multer({dest:'uploads/'});
const fs=require('fs');
const Postmodel = require('./models/Postmodel');

const secret ='kjndkijbicjhbjanskjansjan';
app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads',express.static(__dirname+'/uploads'))

mongoose.connect('mongodb+srv://vyshakhrajeevan:EtLwcaqCeu24YYew@cluster0.irvgfrw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(()=>{
    console.log('====================================');
    console.log("Listening");
    console.log('====================================');
       // app.listen(5000);
    })
    .catch((e)=>{
        console.log("error occured while connecting mongoose : "+e);
    })

/*_______________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________*/
app.post('/Register',async (req,res)=> {
    const {username,password} =req.body;
    dbuser = await User.findOne({username:username});
    let hashed_password;
    if(!dbuser){
        if(password.length>4){
            try{

                const salt=await bcrypt.genSalt();
                 hashed_password=await bcrypt.hash(password,salt);
            }
            catch(e){
                console.log("error occured while encrypting:"+e);
            }
    
            const userDoc= User.create({username,password:hashed_password}).then(()=>{
                
                
                res.json({success:true,message:"Registration Successful"});
            })
            .catch((e)=>{
                res.status(400).json(e);
                console.log("err occured while creating user : "+e);
            })

        }
        else{
            res.json({success:false,message:"Password is too short"});
        }
        
    }else{
        
        res.json({success:false,message:"Username already exists"});
        
    }

});

/*_______________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________*/


app.post('/Login',async (req,res)=>{
    const {username,password}=req.body;
    try{
    const userDoc=await User.findOne({username});

    if(!userDoc){
        return res.json({success:false,message:"User not found"})
    }

   
        const passOK=await bcrypt.compare(password,userDoc.password);
        if (passOK){
        
                jwt.sign({username,id:userDoc._id},secret,{},(err,token)=>{
                    if(err){
                        console.log("error occured while signing jwt",err);
                        return res.status(500).json({ error: 'Internal Server Error' });

                    }
                    res.cookie('token',token,{ httpOnly: true, secure: true }).json({id:userDoc._id,username,success:true,message:"Login Successful"});
                    
                }); 
            
                
           console.log("login success")

        }
        else{
            return res.status(401).json({success:false,message:"Incorrect Password"})
        }
    }
    catch(e){
        console.log("error comparing password ",e);
        return res.status(500).json({success:false,message:"Internal server error"})
    }
})

/*_______________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________*/

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) {
            console.log("error while verifying jwt", err);
            return res.status(401).json({ error: 'Unauthorized' });
        }
        res.json(info);
    });
});


/*_______________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________*/



app.post('/logout',(req,res)=>{
    res.cookie('token','').json('ok')
})


/*_______________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________*/

app.post('/createpost',uploadMiddleware.single('file'),async (req,res)=>{
   const {originalname,path} = req.file;
   const parts=originalname.split('.');
   const ext=parts[parts.length-1];
   const newPath=path+'.'+ext;
   fs.renameSync(path,path+'.'+ext);

   const { token } = req.cookies;
   jwt.verify(token, secret, {},async (err, info) => {
       if (err) {
           console.log("error while verifying jwt", err);
          // return res.status(401).json({ error: 'Unauthorized' });
       }
       const {title,summary,content}=req.body;
       const postDoc=await Postmodel.create({
         title,
         summary,
         content,
         cover:newPath,
         author:info.id
       }
     
        )
         res.json(postDoc);
   });


 
});


app.get('/createpost',async (req,res)=>{
    res.json(await Postmodel.find()
    .populate('author',['username'])
    .sort({createdAt:-1})
    .limit(10)
);
})

/*_______________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________*/

app.get('/SinglePost/:id',async (req,res)=>{
   const {id}= req.params;
   
   postDoc=await Postmodel.findById(id).populate('author',['username']);
   postDoc2=await Postmodel.findById(id).populate('author',['username']).populate("comments");
   
   // console.log(postDoc2.comments);
    
   
   res.json(postDoc);

})


/*_______________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________*/

app.put('/EditPost',uploadMiddleware.single('file'),async (req,res)=>{
   let newPath=null;
    if(req.file){
    const {originalname,path} = req.file;
   const parts=originalname.split('.');
   const ext=parts[parts.length-1];
    newPath=path+'.'+ext;
   fs.renameSync(path,path+'.'+ext);
   }

   const {token}=req.cookies;

   jwt.verify(token, secret, {},async (err, info) => {
    if (err) {
        console.log("error while verifying jwt", err);
       // return res.status(401).json({ error: 'Unauthorized' });
    }
    const {id,title,summary,content}=req.body;
    const postDoc=await Postmodel.findById(id);
   const isAuthor= JSON.stringify(postDoc.author)===JSON.stringify(info.id);
    if(!isAuthor){
        res.status(400).json('you are not the author')
    }
   try{
    await postDoc.updateOne({
        title,
        summary,
        content,
        cover :newPath? newPath:postDoc.cover,
        });
   } 
   catch(e){
    console.log("error happened"+e)
   }
   
    
      res.json(postDoc);
});

});

/*_______________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________*/

app.post('/Comment', async (req,res)=>{
  //  const {commentDoc}=req.body;
  
    const {postId,authorname,commentText}=req.body
    
    console.log(postId,authorname,commentText);
    const Commentpost=await Postmodel.findById(postId);
    console.log(Commentpost.title,Commentpost.comments);
    console.log("author:",authorname);
   newComment={
    author:authorname,
    comment:commentText,
   };
    Commentpost.comments.push(newComment);
    await Commentpost.save();
    //res.json(comment);
    console.log(Commentpost.comments);
    

})



app.listen(5000);