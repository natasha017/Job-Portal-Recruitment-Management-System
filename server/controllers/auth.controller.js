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
        console.log(error)
    }
}

const login = async (req, res) => {
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
        console.log(error)
    }
}

const authController = {
    register,
    login
}

export default authController