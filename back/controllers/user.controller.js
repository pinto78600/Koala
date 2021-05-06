const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
}

module.exports.userInfo = (req, res) => {
    if(!ObjectID.isValid(req.params.id)){
        return res.status(400).send(`Id unknow : ${req.params.id}`)
    }
    UserModel.findById(req.params.id, (err, docs) => {
        if(!err) res.send(docs);
        else console.log(`Id unkwonw: ${err}`);
    }).select('-password');
}

module.exports.updateUser = async (req, res) => {
    if(!ObjectID.isValid(req.params.id)){
        return res.status(400).send(`Id unknow : ${req.params.id}`)
    }
    try {
        await UserModel.findOneAndUpdate(
            {_id : req.params.id},
            {
                $set: {
                    bio: req.body.bio
                }
            },
            { new : true, upsert : true, setDefaultsOnInsert : true },
            (err, docs) => {
                if(!err) return res.send(docs);
                if(err) return res.status(500).send({ message : err});
            }
        ).select('-password')
    }catch(err){
        return res.status(500).json({ message: err });
    }
}

module.exports.deleteUser = async (req, res) => {
    if(!ObjectID.isValid(req.params.id)){
        return res.status(400).send(`Id unknow : ${req.params.id}`)
    }

    try{
        await UserModel.remove({ _id : req.params.id }).exec();
        res.status(200).json({ message : "Succesfully deleted"})
    }catch(err){
        return res.status(500).json({ message: err });
    }
}

module.exports.follow = async (req, res) => {
    if(!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow)){
        let message = [];
        if(!ObjectID.isValid(req.params.id)){
            message.push(`Id unknow : ${req.params.id}`);
        }
        if(!ObjectID.isValid(req.body.idToFollow)) {
            message.push(`Id unknow : ${req.body.idToFollow}`);

        }
        return res.status(400).send(message);
    }
    try{
        //add to the follower list
        await UserModel.findByIdAndUpdate(
            req.params.id,
            { $addToSet:  { following : req.body.idToFollow }},
            { new : true, upsert : true},
            (err, docs) => {
                if(!err) res.status(201).json(docs);
                else return res.status(400).json(err);
            }
        );
        // add to following list 
        await UserModel.findByIdAndUpdate(
            req.body.idToFollow,
            {$addToSet: {followers : req.params.id}},
            { new : true, upsert : true},
            (err, docs) => {
                if(!err) res.status(201).json(docs);
                if(err) return res.status(400).json(err);
            }
        )
    }catch(err){
        return res.status(500).json({ message: err });
    }
}

module.exports.unfollow = async (req, res) => {
    if(!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnfollow)){
        let message = [];
        if(!ObjectID.isValid(req.params.id)){
            message.push(`Id unknow : ${req.params.id}`);
        }
        if(!ObjectID.isValid(req.body.idToUnfollow)) {
            message.push(`Id unknow : ${req.body.idToUnfollow}`);

        }
        return res.status(400).send(message);
    }
    try{
        await UserModel.findByIdAndUpdate(
            req.params.id,
            { $pull:  { following : req.body.idToUnfollow }},
            { new : true, upsert : true},
            (err, docs) => {
                if(!err) res.status(201).json(docs);
                else return res.status(400).json(err);
            }
        );
        // add to following list 
        await UserModel.findByIdAndUpdate(
            req.body.idToUnfollow,
            {$pull: {followers : req.params.id}},
            { new : true, upsert : true},
            (err, docs) => {
                if(err) return res.status(400).json(err);
            }
        )
    }catch(err){
        return res.status(500).json({ message: err });
    }
}

module.exports.blockUser = async (req, res) => {
    if(!ObjectID.isValid(req.params.id)){
        return res.status(400).send(`Id unknow : ${req.params.id}`)
    }
    await UserModel.findByIdAndUpdate(
        req.params.id,
        {$addToSet: {blocked : req.body.idToBlock}},
        { new : true, upsert : true},
        (err, docs) => {
            if(!err) res.status(201).json(docs);
            if(err) return res.status(400).json(err);
        }
    )
}

module.exports.unblockUser = async (req, res) => {
    if(!ObjectID.isValid(req.params.id)){
        return res.status(400).send(`Id unknow : ${req.params.id}`)
    }
    await UserModel.findByIdAndUpdate(
        req.params.id,
        {$pull: {blocked : req.body.idToUnblock}},
        { new : true, upsert : true},
        (err, docs) => {
            if(err) return res.status(400).json(err);
        }
    )
}