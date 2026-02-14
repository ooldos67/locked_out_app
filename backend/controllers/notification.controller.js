import Notification from "../models/notification.model.js";

export const getUserNotifications = async (req, res) => {
  try {
    // find all the notifications that belong to the user with req.user._id
    const notifications = await Notification.find({
      recipient: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate("relatedUser", "name username profilePicture")
      .populate("relatedPost", "content image");

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error in getUserNotification controller", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    // get the id of the notification
    const notificationId = req.params._id;
    // find the notification in the db by the id, and update 'read' to true
    const notification = await Notification.findByIdAndUpdate(
      {
        _id: notificationId,
        recipient: req.user._id,
      },
      { read: true },
      { new: true }
    );

    res.status(200).json(notification);
  } catch (error) {
    console.error("Error in markNotificationAsRead controller", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    // get id of the notification
    const notificationId = req.params._id;
    // find by id and delete from the db
    await Notification.findByIdAndDelete({
      _id: notificationId,
      recipient: req.user._id,
    });

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error in deleteNotification controller", error);
    res.status(500).json({ message: "Server error" });
  }
};
