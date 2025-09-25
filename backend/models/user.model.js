import mongoose from 'mongoose'
import bcrypt from 'bcrypt';
import  jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: [6, 'Email must be at least 6 characters long'],
        maxLength: [50, 'Email must be at least 50 characters long']
    },
    password: {
       type: String,
    },
    refreshToken: {
        type: String
    },
},
 {
    timestamps: true
  })
 
userSchema.statics.hashPassword  = async function(password){
    return await bcrypt.hash(password,10);
}

userSchema.methods.isValidPassword = async function(password){
  return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessandRefreshToken = function(){
    const accessToken = jwt.sign({email: this.email},process.env.JWT_SECRET,{expiresIn: '15m'});
    const refreshToken = jwt.sign({email: this.email},process.env.JWT_SECRET,{expiresIn: '24h'});
    return {accessToken, refreshToken}
}


const User = mongoose.model('user',userSchema);

export default User;