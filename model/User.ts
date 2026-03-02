import mongoose , {Schema , Document} from "mongoose";


export interface Message extends Document{
    content : string;
    createdAt:Date
}

const MessageSchema: Schema<Message> = new Schema({
      content: {
        type: String,
        required:true
      },
      createdAt: {
        type: Date,
        required: true,
        default: Date.now
      }



})

export interface User extends Document{
    username : string;
    email: string,
    password: string,
    verifycode : string,
    verifycodeexpiry: Date,
    isverified : boolean, 
    isacceptingmessage: boolean,
    message: Message[]

}
const UserSchema: Schema<User> = new Schema({
      username: {
        type: String,
        required:[true , "username is required"],
        unique: true,
      },
      email: {
        type: String,
        required: [true , "email is required"],
        unique: true,
        match: [/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/ ,'please use a valid email address'],

        
      },
      password: {
        type: String,
        required: [true,"password is required"],
      },
      verifycode: {
        type: String,
        required: [true,"verification code is required"],
      },
      verifycodeexpiry: {
        type : Date,
        required: [true,"verify code expiry is required"],
      },
      isverified: {
        type:Boolean,
        default : false,

      },
      isacceptingmessage: {
        type:Boolean,
        default : true,

      },
      message:[MessageSchema]

})

const UserModel = (mongoose.models.User as mongoose.Model<User>)  || mongoose.model<User>("User",UserSchema)
export default UserModel;