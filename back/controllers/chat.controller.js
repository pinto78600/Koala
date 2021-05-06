const ChatModel = require('../models/chat.model');
const ObjectID = require('mongoose').Types.ObjectId;


module.exports.getNotifs = (req, res) => {
    ChatModel.find(
        { $or :[ { user  :  req.params.id },
            { userFriend : req.params.id }
        ]}, (err, docs) => {
        if(!err) res.send(docs);
        else console.log(`Id unkwonw: ${err}`);
    });
}

module.exports.createRoom = async (req, res) => {
    const { user , userFriend } = req.body;
    try{
        const chatUser= await ChatModel.create({user , userFriend });
        res.status(201).json(roomId = chatUser._id)
        
    }
    catch(err){
        res.status(200).send(err)
    }
}

module.exports.getRoom = async (req, res) => {
    try{
        await ChatModel.find(
            {
            $and: [
                { $or: [ { user: req.params.id }, { user : req.params.idfriend } ] },
                { $or: [ { userFriend: req.params.id }, { userFriend :  req.params.idfriend }  ] }
            ]}
            , (err, docs) => {
                if(!err){
                    return res.status(201).json(docs)

                }else res.status(400).json(err);
        })
    }
    catch(err){
        res.status(200).send(err)
    }
}

module.exports.postNotifs = async (req, res) => {
    try{
        await ChatModel.findByIdAndUpdate( req.params.roomid,  
            {
                $addToSet : { 
                    notifications : {
                        senderId: req.body.senderId,
                    }
                }
                
            }, { new : true, upsert : true},
            (err, docs) => {
                if(!err){
                    return res.status(201).json(docs)

                }else res.status(400).json(err);
            }
        
        )
    }catch(err){
        res.status(200).send(err)
    }
}

module.exports.deleteNotifs = (req, res) => {
    if(!ObjectID.isValid(req.params.id)){
        return res.status(400).send(`Id unknow : ${req.params.id}`)
    };

    try{
        return ChatModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull :{
                    notifications: {
                        senderId : req.body.senderId
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
