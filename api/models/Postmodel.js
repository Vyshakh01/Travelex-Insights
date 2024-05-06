const mongoose=require('mongoose');
const {Schema,model} =mongoose;

const CommentSchema=new Schema({
    comment:String,
    author:String,


})

const PostSchema = new Schema({
    title:String,
    summary:String,
    content:String,
    cover:String,
   author:{type:Schema.Types.ObjectId,ref:'User'},
   comments: [CommentSchema],

},{
    timestamps:true,

});

const PostModel=model('Postmodel',PostSchema);
module.exports=PostModel;