import { Request, Response } from "express";
import sendResponse from "../utils/send-response-util";
import userModel from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, username, phoneNumber, password, countryName, fullName } =
      req.body;
    if (
      !email.trim() ||
      !username.trim() ||
      !phoneNumber.trim() ||
      !password.trim()
    ) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "All fileds are required.",
      });
    }

    const phoneRegex = /^[0-9]{6,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Invalid phone number",
      });
    }

    const isUserExists = await userModel.findOne({
      $or: [{ phoneNumber: phoneNumber }, { email: email }],
    });

    if (isUserExists) {
      return sendResponse(res, {
        statusCode: 409,
        success: false,
        message: "Phone number or Email already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const isRegistered = await userModel.create({
      email,
      username,
      phoneNumber,
      password: hashPassword,
      countryName,
      fullName,
    });

    await isRegistered.save();

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User registered successfully.",
    });
  } catch (error: any) {
    console.log("This is error while registering user:", error.message);

    if (error.message.includes("timeout")) {
      return sendResponse(res, {
        statusCode: 500,
        success: false,
        message: "It looks like your internet is slow, please try again.",
      });
    }
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Internal Server Error!",
    });
  }
};

export const checkUser = async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body;

    const checkNumber = await userModel.findOne({ phoneNumber });

    if (!checkNumber) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User not found",
      });
    }

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User found",
    });
  } catch (error: any) {
    console.log("This is error while checking user:", error.message);

    if (error.message.includes("timeout")) {
      return sendResponse(res, {
        statusCode: 500,
        success: false,
        message: "It looks like your internet is slow, please try again.",
      });
    }
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Internal Server Error!",
    });
  }
};
export const LoginUser = async (req: Request, res: Response) => {
  try {
    const { country, phoneNumber, password } = req.body;

    if (!country?.trim() || !phoneNumber?.trim()) {
      if(country === "FRANCE +33" && !password?.trim())
      {
        return sendResponse(res, {
          statusCode: 400,
          success: false,
          message: "All fields are required.",
        });
      }
      return sendResponse(res, {
          statusCode: 400,
          success: false,
          message: "All fields are required.",
        });
    }

    const user = await userModel.findOne({ phoneNumber });

    if (!user) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Invalid credentials",
      });
    }

    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" },
    );

    const refreshToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userData: any = user.toObject();
    delete userData.password;

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Login successful",
      data: { user: userData, accessToken },
    });
  } catch (error: any) {
    console.log("This is error while login user:", error.message);

    if (error.message.includes("timeout")) {
      return sendResponse(res, {
        statusCode: 500,
        success: false,
        message: "It looks like your internet is slow, please try again.",
      });
    }

    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Internal Server Error!",
    });
  }
};
