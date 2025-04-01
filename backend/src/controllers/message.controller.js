import { protectRoute } from "../middleware/auth.middleware.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js"
export const getUsersForSidebar = async(requestAnimationFrame,res) => {
    try{
        const loggedInUserId = requestAnimationFrame.user_id;
        const filteredUsers = await User.find({_id:{$ne:loggedInUserId}}).select("-passwaord")

        res.status(200).json(filteredUsers)
    }catch(error){
        console.error("Error in getUsersForSidebar",error.message);
        res.status(500).json({error:"Internal server error"});
    }
};


export const getMessages = async(req,res) => {
    try{
        const {id:userToChatId}= req.params
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId:myId,userToChatId},
                {senderId:userToChatId,receiverId:myId}
            ]
        })
       
        res.status(200).json(messages)
    }catch(error){
       console.log("Error in getMessages controller:",error.message);
       res.ststus(500).json({error:"Internal server errort"});     
    }
};

export const sendMessage = async(req,res) => {
    try{
        const {text,image} = req.body;
        const {id:receiverId} = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(!image){
            //upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;

        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl,
        });

        await newMessage.save();

        //realtime function later using soket.io

        res.status(201).json(newMessage)
    }catch(error){
        console.log("Error in sendMessage controller:",error.message);
        res.status(500).json({error:"Internal server error"});   
    }
};