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
    url: {
        type: String,
        default: ""
    },
    public_id: {
        type: String,
        default: ""
    }
},

    isBlocked: {
        type: Boolean,
        default: false
    },
    resetPasswordToken:{
        type:String,
        default:null
    },
    resetPasswordExpires:{
        type:Date,
        default:null
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
// Generate JWT Token
userSchema.methods.generateToken = function () {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY is missing");
  }

  return jwt.sign({
    userId: this._id.toString(),
    userEmail: this.email,
    userRole: this.role
  }, process.env.JWT_SECRET_KEY, {
    expiresIn: "30d"
  });
};
// Compare Password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};


const User = model("User", userSchema);

export default User;
