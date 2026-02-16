import ConnectionRequest from "../models/connectionRequest.model.js";
import Notification from "../models/notification.model.js";
import sendConnectionAcceptedEmail from "../emails/emailHandlers.js";
import connectionRequest from "../models/connectionRequest.model.js";
import User from "../models/user.model.js";

export const sendConnectionRequest = async (req, res) => {
  try {
    // get the userId from the params
    const { userId } = req.params;
    // get the id (object) of the logged in user
    const senderId = req.user._id;

    // check if logged in user is not requesting to connect with themselves
    if (senderId.toString() === userId) {
      return res
        .status(400)
        .json({ message: "You can't send requests to yourself!" });
    }

    // check if logged in user already has the requested account as a connection
    if (req.user.connections.includes(userId)) {
      return res.status(400).json({ message: "You are already connected!" });
    }

    // check if there is the same existing request already ("pending")
    const existingRequest = await ConnectionRequest.findOne({
      sender: senderId,
      recipient: userId,
      status: "pending",
    });
    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "You have already made this connection request" });
    }

    // create a new ConnectionRequest object (defaults to "pending")
    const newRequest = new ConnectionRequest({
      sender: senderId,
      recipient: userId,
    });

    // Save to the DB
    await newRequest.save();

    res.status(201).json({ message: "Connection request sent successfully" });
  } catch (error) {
    console.error("Error in sendConnectionRequest controller", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const acceptConnectionRequest = async (req, res) => {
  try {
    // get the requestId from the params
    const { requestId } = req.params;
    // get the id (object) of the logged in user
    const userId = req.user._id;

    // find the connection request by id and populate the sender and recipient fields
    const request = await ConnectionRequest.findById(requestId)
      .populate("sender", "name email username")
      .populate("recipient", "name username");

    if (!request) {
      return res.status(404).json({ message: "This request doesn't exist" });
    }

    // check if the request is for the current user
    if (request.recipient._id.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorised to accept this request" });
    }

    // make sure the status of the request is pending
    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: "The request has already been processed" });
    }

    // change status of the request to accepted in DB
    request.status = "accepted";
    await request.save();

    // update the connections field in for the Users invloved
    // first, update the connections of the sender
    await User.findByIdAndUpdate(request.sender._id, {
      $addToSet: { connections: userId },
    });
    // second, update the connections of the logged in user
    await User.findByIdAndUpdate(userId, {
      $addToSet: { connections: request.sender._id },
    });

    // create notification for the sender
    const notification = new Notification({
      recipient: request.sender._id,
      type: "connectionAccepted",
      relatedUser: userId,
    });

    await notification.save();
    res.status(201).json({ message: "Connection accepted successfully" });

    // Send email
    const senderEmail = request.sender.senderEmail;
    const senderName = request.sender.senderName;
    const recipientName = request.recipient.name;
    const profileUrl =
      process.env.CLIENT_URL + "/profile/" + request.recipient.username;

    try {
      await sendConnectionAcceptedEmail(
        senderEmail,
        senderName,
        recipientName,
        profileUrl
      );
    } catch (error) {
      console.error("Error in sending connection confirmation email", error);
    }
  } catch (error) {
    console.error("Error in acceptConnectionRequest controller", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const rejectConnectionRequest = async (req, res) => {
  try {
    // get request id we'd like to reject and the current user id
    const { requestId } = req.params;
    const userId = req.user._id;

    // find the request in the db
    const request = await connectionRequest.findById(requestId);

    // check the request is for the logged in user
    if (request.recipient.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorised to reject this request" });
    }

    // check the request is still active
    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Thie request has already been processed" });
    }

    // change status of the resuest to rejected and save to DB
    request.status = "rejected";
    await request.save();

    res.json({ message: "Connection request rejected" });
  } catch (error) {
    console.error("Error in rejectConnectionRequest controller", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getConnectionRequests = async (req, res) => {
  try {
    // find is of current user
    const userId = req.user._id;

    // find all connection request where the recipient is the logged in user (userId)
    // and the status is "pending"
    // then populate the sender field with data
    const requests = await ConnectionRequest.find({
      recipient: userId,
      status: "pending",
    }).populate("sender", "name username profilePicture headline connections");

    res.json(requests);
  } catch (error) {
    console.error("Error in getConnectionRequest controller", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserConnections = async (req, res) => {
  try {
    // get logged in user id
    const userId = req.user._id;

    // find user in the DB and populate all the connections field of that user with data
    const user = await User.findById(userId).populate(
      "connections",
      "name username profilePicture headline connections"
    );

    res.json(user.connections);
  } catch (error) {
    console.error("Error in getUserConnections controller", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeConnection = async (req, res) => {
  try {
    // get logged in users id
    const myId = req.user._id;

    // get id of connection you want to remove
    const { userId } = req.params;

    // update both users in the DB (remove each other from connections)
    await User.findByIdAndUpdate(myId, { $pull: { connections: userId } });
    await User.findByIdAndUpdate(userId, { $pull: { connections: myId } });

    res.json({ message: "Connection removed successfully" });
  } catch (error) {
    console.error("Error in removeConnection controller", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getConnectionStatus = async (req, res) => {
  try {
    // get the id the user connection status we want to check
    const targetUserId = req.params.userId;
    // get id of logged in user
    const currentuserId = req.user._id;

    // get the current logged in user
    const currentUser = req.user;

    // check if the two users are already connected
    if (currentUser.connections.includes(targetUserId)) {
      return res.json({ status: "connected" });
    }

    // check if there is a request pending from either user
    const pendingRequest = await ConnectionRequest.findOne({
      $or: [
        { sender: currentuserId, recipient: targetUserId },
        { sender: targetUserId, recipient: currentuserId },
      ],
      status: "pending",
    });

    // if there is a pending request determine if it is from or to the logged in user
    if (pendingRequest) {
      if (pendingRequest.sender.toString() === currentuserId) {
        return res.json({ status: "pending" });
      } else {
        return res.json({ status: "received", requestId: pendingRequest._id });
      }
    }

    // if no connection or pending request are found, then there is no connection
    res.json({ status: "not_connected" });
  } catch (error) {
    console.error("Error in getConnectionStatus controller", error);
    res.status(500).json({ message: "Server error" });
  }
};
