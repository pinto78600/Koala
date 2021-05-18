const PostModel = require('../models/post.model');
const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;
const { uploadErrors } = require("../utils/errors.utils");
const { cloudinary } = require('../config/cloudinary');


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
    const { posterId, message, video, dataPicture, link } = req.body;
    const picture = req.body.picture;
    
    if(dataPicture){
        try {
            if (
                dataPicture.format != "image/jpg" &&
                dataPicture.format != "image/png" &&
                dataPicture.format != "image/jpeg"
                ){
                    throw Error("invalid file");
                }
                
                if (dataPicture.size > 1500000) throw Error("max size");
                
                const uploadResponse = await cloudinary.uploader.upload(picture, {
                    upload_preset: 'posts-folder',
                })
                const newPost =  new PostModel({
                    posterId,
                    message,
                    picture: req.body.picture != null ? uploadResponse.secure_url : "",
                    video,
                    link,
                    likers: [],
                    comments: []
                })   
                const post = await newPost.save();
                return res.status(201).json(post);
       
            } catch (err) {
                const errors = uploadErrors(err);
                return res.status(201).json({ errors });
            }
    }
    try{
    
        const newPost = 
            req.body.sharedId ? ( 
                new PostModel({
                    posterId,
                    message,
                    likers: [],
                    comments: [],
                    share:{
                        sharedPicture: req.body.sharedPicture,
                        sharedId : req.body.sharedId,
                        sharedMessage : req.body.sharedMessage,
                        sharedVideo: req.body.sharedVideo,
                        sharedLink: req.body.sharedLink,
                        timestamp : req.body.date
                    }
                })
            )
            : 
            (
                new PostModel({
                    posterId,
                    message,
                    picture: "",
                    video,
                    link,
                    likers: [],
                    comments: []
                })    
            )
        const post = await newPost.save();
        return res.status(201).json(post);
            
    } catch (err) {
    res.status(500).send(err);
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
            if(!err) return res.send(docs);
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
            if(!err) return res.send(docs)
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