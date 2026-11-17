import User from "../models/user.model.js"
import crypto from "crypto"
import transporter from "../config/nodemailer.js"
import cloudinary from "../config/cloudinary.js"

const register = async (req, res, next) => {
  let uploadedPublicId = null;

  try {
    const { name, email, password, role } = req.body;

    // Only candidate and recruiter can register publicly
    if (!["candidate", "recruiter"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Only candidate and recruiter can register."
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(409).json({
        success: false,
        message: "Email already exists"
      });
    }

    let avatar = {
      url: "",
      public_id: ""
    };

    // Upload avatar to Cloudinary
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "job-portal/avatars",
              resource_type: "image"
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(req.file.buffer);
      });

      avatar = {
        url: result.secure_url,
        public_id: result.public_id
      };

      uploadedPublicId = result.public_id;
    }

    let userCreated;

    try {
      userCreated = await User.create({
        name,
        email,
        password,
        role,
        avatar
      });
    } catch (error) {
      // Delete uploaded avatar if user creation fails
      if (uploadedPublicId) {
        try {
          await cloudinary.uploader.destroy(uploadedPublicId);
        } catch (cleanupError) {
          console.error("Cloudinary cleanup failed:", cleanupError);
        }
      }

      throw error;
    }

    // Remove sensitive fields from response
    const userResponse = userCreated.toObject();

    delete userResponse.password;
    delete userResponse.resetPasswordToken;
    delete userResponse.resetPasswordExpires;

    const token = userCreated.generateToken();

    // Set secure HTTP-only cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000
    };

    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: userResponse
    });

  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (!userExists) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials"
      });
    }

    if (userExists.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked"
      });
    }

    const isPasswordValid = await userExists.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials"
      });
    }

    // Remove sensitive fields
    const userResponse = userExists.toObject();

    delete userResponse.password;
    delete userResponse.resetPasswordToken;
    delete userResponse.resetPasswordExpires;

    const token = userExists.generateToken();

    // Cookie options (same as register)
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000
    };

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: userResponse
    });

  } catch (error) {
    next(error);
  }
};

const logout = async(req,res,next)=>{
    try {
        res.clearCookie("token")
        res.status(200).json({
            message:"Logout successfully"
        });
    } catch (error) {
        next(error)
    }
};

const forgotPassword = async (req, res, next) => {
    let userExist;

    try {
        const { email } = req.body;

        userExist = await User.findOne({ email });

        if (!userExist) {
            return res.status(200).json({
                message: "If an account exists with this email, a reset link has been sent."
            });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        const hashToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        userExist.resetPasswordToken = hashToken;
        userExist.resetPasswordExpires =new Date(Date.now() + 15 * 60 * 1000);

        await userExist.save();

        const resetUrl =
            `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: userExist.email,
                subject: "Job Portal - Password Reset",
                html: `
                    <div>
                        <h2>Password Reset Request</h2>
                        <p>You requested to reset your password.</p>
                        <p>This link will expire in 15 minutes.</p>
                        <a href="${resetUrl}">Reset Password</a>
                    </div>
                `
            });
        } catch (emailError) {
            userExist.resetPasswordToken = null;
            userExist.resetPasswordExpires = null;

            await userExist.save();

            throw emailError;
        }

        return res.status(200).json({
            message: "If an account exists with this email, a reset link has been sent."
        });

    } catch (error) {
        next(error);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        
        const { token } = req.params;
        
        const { password, confirmPassword } = req.body;
        
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }
        
        const hashToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");
            
            const userExist = await User.findOne({
            resetPasswordToken: hashToken,
            resetPasswordExpires: {
                $gt: new Date()
            }
        });

        if (!userExist) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token"
            });
        }

        userExist.password = password;
        
        userExist.resetPasswordToken = null;
        userExist.resetPasswordExpires = null;
        
        await userExist.save();
        
        return res.status(200).json({
            success: true,
            message: "Password reset successfully. Please login."
        });

    } catch (error) {
        next(error);
    }
};

const user=async(req,res,next)=>{
    try {
    const user=req.user
    return res.status(200).json({user});
    } catch (error) {
        next(error)
    }
};

const authController = {
    register,
    login,
    forgotPassword,
    resetPassword,
    logout,
    user
};

export default authController