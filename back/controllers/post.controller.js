const PostModel = require('../models/post.model');
const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const { uploadErrors } = require("../utils/errors.utils");

module.exports.readPost = (req, res) => {
    PostModel.find((err, docs) => {
        if(!err) res.send(docs);
        else console.log('Error to get data : ' + err);
    }).sort({ createdAt : -1 });
};

module.exports.getPost = (req, res) => {
    if(!ObjectID.isValid(req.params.id)){
        return res.status(400).send(`Id unknow : ${req.params.id}`)
    };
    PostModel.findById(req.params.id, 
        (err, docs) => {
            if(!err) res.send(docs);
            else console.log(`Id unkwonw: ${err}`);
    })
}

module.exports.getPostUser = (req, res) => {
    PostModel.find({
        posterId : req.params.id
    },(err, docs) => {
        if(!err) res.send(docs);
        else console.log('Error to get data : ' + err);
    }).sort({ createdAt : -1 })
}

module.exports.createPost = async (req, res) => {
    let fileName;
            
    if(req.file !== null){
        try {
            if (
                req.file.detectedMimeType != "image/jpg" &&
                req.file.detectedMimeType != "image/png" &&
                req.file.detectedMimeType != "image/jpeg"
                )
                throw Error("invalid file");
                
                if (req.file.size > 500000) throw Error("max size");
            } catch (err) {
                const errors = uploadErrors(err);
                return res.status(201).json({ errors });
            }
            fileName = req.body.posterId + Date.now() + '.jpg';
        
        await pipeline(
            req.file.stream,
            fs.createWriteStream(
                `${__dirname}/../../front/public/uploads/posts/${fileName}`
            )
        );
    }
    const body = req.body;

    const newPost = 
        body.sharedId ? ( 
            new PostModel({
                posterId : body.posterId,
                message: body.message,
                picture: req.file != null ? "./uploads/posts/"+fileName : "",
                video: body.video,
                likers: [],
                comments: [],
                share:{
                    sharedPicture: body.sharedPicture,
                    sharedId : body.sharedId,
                    sharedMessage : body.sharedMessage,
                    sharedVideo: body.sharedVideo,
                    timestamp : body.date
                }
            })
        )
        :
        (
            new PostModel({
                posterId : body.posterId,
                message: body.message,
                picture: req.file != null ? "./uploads/posts/"+fileName : "",
                video: body.video,
                likers: [],
                comments: []
            })   
        )
        

    try{
        const post = await newPost.save();
        return res.status(201).json(post);
    }catch(err){
        return res.status(400).send(err);
    }
};

module.exports.updatePost = (req, res) => {
    if(!ObjectID.isValid(req.params.id)){
        return res.status(400).send(`Id unknow : ${req.params.id}`)
    };
    const udpateRecord = { 
        message : req.body.message
    }
    PostModel.findByIdAndUpdate(
        req.params.id,
        {$set : udpateRecord},
        {new : true},
        (err, docs) => {
            if(!err) res.send(docs);
            else console.log('Update error : ' + err);
        }
    )

};

module.exports.deletePost = (req, res) => {
    if(!ObjectID.isValid(req.params.id)){
        return res.status(400).send(`Id unknow : ${req.params.id}`)
    };
    PostModel.findByIdAndRemove(
        req.params.id,
        (err, docs) => {
            if(!err) res.send(docs)
            else console.log('Delete error : ' + err);
        }
    )
};

module.exports.likePost = async (req, res) => {
    if(!ObjectID.isValid(req.params.id)){
        return res.status(400).send(`Id unknow : ${req.params.id}`)
    };
    try{
        await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $addToSet: { likers : req.body.id }
            },
            { new : true},
            (err, docs) => {
                if(err) return res.status(400).send(err)
            }
        );
        await UserModel.findByIdAndUpdate(
            req.body.id,
            {
                $addToSet : { likes : req.params.id}
            },
            { new : true },
            (err, docs) => {
                if(!err) res.send(docs);
                else return res.status(400).send(err)
            }
    
        );
    }catch (err){
        return res.status(400).send(err);
    }
}

module.exports.unlikePost = async (req, res) => {
    if(!ObjectID.isValid(req.params.id)){
        return res.status(400).send(`Id unknow : ${req.params.id}`)
    };
    try{
        await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: { likers : req.body.id }
            },
            { new : true},
            (err, docs) => {
                if(err) res.status(400).send(err)
            }
        );
        await UserModel.findByIdAndUpdate(
            req.body.id,
            {
                $pull : { likes : req.params.id}
            },
            { new : true },
            (err, docs) => {
                if(!err) res.send(docs);
                else return res.status(400).send(err)
            }
    
        );
    }catch (err){
        return res.status(400).send(err);
    }
  
}


module.exports.commentPost = (req, res) => {
    if(!ObjectID.isValid(req.params.id)){
        return res.status(400).send(`Id unknow : ${req.params.id}`)
    };

    try{
        return PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $push : { 
                    comments : {
                        commenterId : req.body.commenterId,
                        commenterPseudo : req.body.commenterPseudo,
                        text : req.body.text,
                        timestamp: new Date().getTime()
                    }
                }
            },
            { new : true},
            (err, docs) => {
                if(!err) return res.send(docs);
                else return res.status(400).send(err)
            }
        )
    }catch(err){
        return res.status(400).send(err);
    }
};

module.exports.editCommentPost = (req, res) => {
    if(!ObjectID.isValid(req.params.id)){
        return res.status(400).send(`Id unknow : ${req.params.id}`)
    };

    try{
        return PostModel.findById(
            req.params.id,
            (err, docs) => {
                const theComment = docs.comments.find(comment => 
                    comment._id.equals(req.body.commentId)
                )
                if(!theComment) return res.status(400).send('Comment not found')
                theComment.text = req.body.text;

                return docs.save( err => {
                    if(!err) return res.status(200).send(docs);
                    return res.status(500).send(err);
                })
            }
            
        )
    }catch(err){
        return res.status(400).send(err);
    }

}

module.exports.deleteCommentPost = (req, res) => {
    if(!ObjectID.isValid(req.params.id)){
        return res.status(400).send(`Id unknow : ${req.params.id}`)
    };

    try{
        return PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull :{
                    comments: {
                        _id : req.body.commentId
                    }
                }
            },
            {new : true},
            (err, docs) => {
                if(!err) return res.send(docs);
                else return res.status(400).send(err)
            }
        )
    }catch(err){
        return res.status(400).send(err);
    }
}