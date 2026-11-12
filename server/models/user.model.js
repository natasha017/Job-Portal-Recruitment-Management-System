import { Schema, model } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const userSchema = new Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["admin", "recruiter", "candidate"],
        default: "candidate"
    },

    avatar: {
        type: String,
        default: ""
    },

    isBlocked: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

//hashPassword
userSchema.pre("save", async function(){
   const user=this

   if(!user.isModified("password")){
    return
   }
   
   try {
    const saltRound=await bcrypt.genSalt(10);
    const hashPassword=await bcrypt.hash(user.password,saltRound);
    user.password=hashPassword;
   } catch (error) {
    throw error
   }
});
//token
userSchema.methods.generateToken=function(){
    try {
    return jwt.sign({
        userId:this._id.toString(),
        userEmail:this.email,
        userRole:this.role
    },process.env.JWT_SECRET_KEY,
    {expiresIn:"30d"}
)
} catch (error) {
        console.error(error)
    }
}
//comparePassword
userSchema.methods.comparePassword= async function(password){
    try {
        return  await bcrypt.compare(password,this.password);
    } catch (error) {
        console.log(error)
    }
}


const User = model("User", userSchema);

export default User;
