const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema(
    {
        user:{
            type:String,
            required:true
        },
        userFriend: {
            type:String,
            required:true
        },
        messages: {
            type: [
                {
                    body : String,
                    senderId: String,
                    timestamp: Number
                },
            ]
        },
        notifications :{
            type: [
                {
                    senderId: String,
                },
            ]
        }

    }
       
);

const ChatModel = mongoose.model('chat', ChatSchema);
module.exports = ChatModel;