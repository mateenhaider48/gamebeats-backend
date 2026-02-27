import { isValidObjectId } from "mongoose";
import sendResponse from "../utils/send-response-util";
import subscriptionModel from "../models/subscription.model";
import { Request, Response } from "express";
import { log } from "console";
import userModel from "../models/user.model";
import { PlanRequest } from "../types";

export const buySubscriptionPlan = async (req: Request, res: Response) => {
  try {
    const { plan } = req.body as PlanRequest;
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Invalid user Id provided.",
      });
    }

    const isUser = await userModel.findById(id);
    if(!isUser){
      return sendResponse(res, {
        statusCode:404,
        success:false,
        message:"User not found."
      });
    }
    const user: any = await subscriptionModel
      .findOne({ user: id })
      .select("status");

    if (user && user.status === "active") {
      return sendResponse(res, {
        statusCode: 409,
        success: false,
        message: "You have already buy the subscription.",
      });
    }
    const createdAt = new Date();
    let expireAt;
    switch (plan) {
      case "daily":
        expireAt = new Date(createdAt.getTime() + 1 * 24 * 60 * 60 * 1000);
        break;
      case "weekly":
        expireAt = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case "monthly":
        expireAt = new Date(createdAt.setMonth(createdAt.getMonth() + 1));
        break;
    }

    const subscription = await subscriptionModel.create({
      user: id,
      plan: plan,
      status: "active",
      expiresAt: expireAt,
    });
    await subscription.save();

    await userModel.findByIdAndUpdate(
      { _id: id },
      {
        isSubscriber: true,
        subscriptionId: subscription._id,
      },
    );
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "you have subscribed this plan.",
    });
  } catch (error: any) {
    console.log("This is error while buying subscrioption:", error.message);

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

export const cancelSubcription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await userModel.findById({ _id: id });
    if (user && user.isSubscriber === true) {
      const isDeleteSubscription = await subscriptionModel.findOneAndDelete({
        user: id,
      });
      if (!isDeleteSubscription) {
        return sendResponse(res, {
          statusCode: 400,
          success: false,
          message: "You have not any subscription.",
        });
      }
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Deleted your subscription.",
      });
    }
  } catch (error: any) {
    console.log("This is error while deleting subscrioption:", error.message);

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
