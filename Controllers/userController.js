const asyncWrapper = require('../Middleware/async');
const userModel= require('../Models/user');
const otpModel = require('../Models/otpModel'); 
const jwt = require('jsonwebtoken');
const Badrequest=require('../Error/BadRequest');
const cloudinary =require('cloudinary');
const Notfound=require('../Error/NotFound');
const bcrypt = require('bcryptjs');
const UnauthorizedError =require('../Error/Unauthorised');
const sendEmail = require('../Middleware/sendMail');
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });

const userController ={
    
    getAllUsers: asyncWrapper(async (req, res,next) => {
        const users = await userModel.find({})
        res.status(200).json({ users })
      }),
  getAllClients: asyncWrapper(async (req, res, next) => {
  const clients = await userModel.find({ role: 'client' });

  if (!clients || clients.length === 0) {
    return next(new Notfound('No clients found'));
  }

  res.status(200).json({ clients });
}),

   createUser: asyncWrapper(async (req, res, next) => {
  const {
    email,
    username,
    firstName,
    lastName,
    names,
    profile,
    address,
    phoneNumber,
    dateOfBirth,
    password,
    gender
  } = req.body;

  const emaill = email.toLowerCase();
  const foundUser = await userModel.findOne({ email: emaill });
  if (foundUser) {
    return next(new Badrequest("Email already in use"));
  }

  const otp = Math.floor(Math.random() * 8000000);
  const otpExpirationDate = new Date(Date.now() + 5 * 60 * 1000);

  let imageUrl = ""; // Default to empty string or a default image URL
  if (req.file) {
    try {
      const images = `IMAGE_${Date.now()}`;
      const ImageCloudinary = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'Bistrou-Pulse',
        public_id: images
      });
      imageUrl = ImageCloudinary.secure_url;
    } catch (err) {
      console.error('Error uploading image to Cloudinary:', err);
      return next(new Badrequest('Error uploading image to Cloudinary.'));
    }
  }

  const newUser = new userModel({
    username,
    firstName,
    lastName,
    names,
    image: imageUrl, // Assign image (either uploaded or default)
    profile,
    address,
    phoneNumber,
    dateOfBirth,
    email: emaill,
    password,
    gender,
    otp: otp,
    otpExpires: otpExpirationDate,
  });

  const savedUser = await newUser.save();
 
  // Prepare email body
  const emailBody = `
    Welcome to Bistrou-Pulse!

    Your One Time Password (OTP) for account verification is: ${otp}

    This OTP is valid for 5 minutes.

    If you did not request this, please ignore this email.

    Best regards,
    Bistrou-Pulse Team
  `;

  try {
    // Send OTP email
    await sendEmail(emaill, 'Bistrou-Pulse System: Verify your account', emailBody);
    console.log('Verification email sent successfully');
  } catch (emailError) {
    console.error('Failed to send verification email:', emailError.message);
    // You might want to continue or fail here based on your app needs
    // For example, you can return an error or just log it
  }

  res.status(201).json({ user: savedUser, message: 'User created successfully, OTP sent to email' });

}),

      getUserById: asyncWrapper(async (req, res, next) => {
        const { id } = req.params;
        const user = await userModel.findById(id);
    
      
    
        res.status(200).json({ user });
      }),
    
    
    
    OTP: asyncWrapper(async(req,res,next) =>{
    
      const foundUser = await userModel.findOne({ otp: req.body.otp });
      if (!foundUser) {
          next(new UnauthorizedError('Authorization denied'));
      };
  
      // Checking if the otp is expired or not.
      console.log('otpExpires:', new Date(foundUser.otpExpires));
      console.log('Current time:', new Date());
      if (foundUser.otpExpires < new Date().getTime()) {
          next(new UnauthorizedError('OTP expired'));
      }
  
      // Updating the user to verified
      foundUser.verified = true;
      const savedUser = await foundUser.save();
  
      if (savedUser) {
          return res.status(201).json({
              message: "User account verified!",
              user: savedUser
          });
      
      }}),

    deleteUser: asyncWrapper(async (req, res, next) => {
      const { id: userID } = req.params;
      const user = await userModel.findOneAndDelete({ _id: userID })
     
      res.status(200).json({ user })
    }),

    UpdatePassword :asyncWrapper(async (req, res,next) => {
      const { currentPassword, newPassword,confirm } = req.body;
      const userId = req.userId; // Assuming the user ID is retrieved from the authenticated user
  
      
          // Find the user by ID
          const user = await userModel.findById(userId);
          if (!user) {
            return next(new Notfound(`User not found`));
          }
  
          // Check if the current password matches the password stored in the database
          const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
          if (!isPasswordValid) {
              console.log('Incorrect current password provided');
              return res.status(400).json({ error: 'Incorrect current password' });
          }
    // Check if newPassword and confirm are equal
    if (newPassword !== confirm) {
      return res.status(400).json({ error: 'New password and confirm password do not match' });
  }
          user.password=newPassword;
  
          // Save the updated user object to the database
          await user.save();
  
          console.log('Password updated successfully');
          return res.json({ success: true, message: 'Password updated successfully' });
      
  }),
    
  updateUser: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;

    // 1. Start with the text fields from the request body.
    const updateData = { ...req.body };

    // 2. Check if Multer has processed a file upload.
    //    If req.file exists, a new image was uploaded.
    if (req.file) {
      // Add the path of the newly uploaded file to our update data.
      // The field name 'image' must match your userModel schema.
      updateData.image = req.file.path;
    }

    // 3. Find the user by ID and update them with the combined data.
    const updatedUser = await userModel.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true // Ensure the update follows your schema rules
    });

    if (!updatedUser) {
      return next(new Notfound(`User not found`));
    }

    // 4. Send the completely updated user object back as the response.
    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
}),

 ForgotPassword : asyncWrapper(async (req, res, next) => {
      const foundUser = await userModel.findOne({ email: req.body.email });
      if (!foundUser) {
        return next(new Notfound(`Your email is not registered`));
      }
      // Generate token
      const token = jwt.sign({ id: foundUser.id }, process.env.SECRET_KEY, { expiresIn: "15m" });
  
      // Recording the token to the database
      await otpModel.create({
          token: token,
          user: foundUser._id,
          expirationDate: new Date(Date.now() + 5 * 60 * 1000),
      });
  
      const link = `https://careconnect-frontend-33ni.onrender.com/auth/reset/${token}/${foundUser.id}`;
      const emailBody = `Click on the link bellow to reset your password\n\n${link}`;
  
      await sendEmail(req.body.email, "Reset your password", emailBody);
      
  
      res.status(200).json({
          message: "We sent you a reset password link on your email!",
          link:link
         
      });
     
  }),
 
ResetPassword: asyncWrapper(async (req, res, next) => {
    const { newPassword, confirm } = req.body;
  const { token } = req.params;

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.SECRET_KEY);
  } catch (err) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const user = await userModel.findById(decoded.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (newPassword !== confirm) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  user.password = newPassword;
  await user.save();

  return res.status(200).json({ message: "Password reset successfully" });
})
}
module.exports = userController