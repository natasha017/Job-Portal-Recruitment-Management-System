import User from "../models/user.model.js"

const register = async (req, res, next) => {
    try {
        const { name, email, password, role, avatar } = req.body

        const userExists = await User.findOne({ email });
        
        if (userExists) {
            return res
                .status(400)
                .json({ message: "Email already exists" });
        }

        const userCreated = await User.create({
            name,
            email,
            password,
            role: role || "candidate",
            avatar: avatar || "",
        });

        const userResponse = userCreated.toObject()
        delete userResponse.password

        const token = userCreated.generateToken()

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            message: "Register Successfully",
            data: userResponse,
            token
        });

    } catch (error) {
        next(error);
    }
}

const login = async (req, res,next) => {
    try {
        const { email, password } = req.body
        const userExists = await User.findOne({ email });
       
        if (!userExists) {
            return res.status(404).json({
                message: "Invalid Credentails"
            });
        }

        const isPasswordValid = await userExists.comparePassword(password)

        if (!isPasswordValid) {
            return res.status(404).json({
                message: "Invalid Credentials"
            });
        }

        const userResponse = userExists.toObject()
        delete userResponse.password

        const token = await userExists.generateToken()
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Login Successfully",
            token,
            data: userResponse
        });
    } catch (error) {
        next(error);
    }
}

const user=async(req,res,next)=>{
    try {
    const user=req.user
    return res.status(200).json({user});
    } catch (error) {
        next(error)
    }
}

const authController = {
    register,
    login,
    user
}

export default authController