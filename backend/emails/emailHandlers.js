import { mailtrapClient, sender } from "../lib/mailtrap.js";
import {
  createCommentNotificationEmailTemplate,
  createConnectionAcceptedEmailTemplate,
  createWelcomeEmailTemplate,
} from "./emailTemplates.js";

export const sendWelcomeEmail = async (email, name, profileUrl) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Welcome to LockedOut",
      html: createWelcomeEmailTemplate(name, profileUrl),
      category: "welcome",
    });

    console.log("Welcoem Email sent successfully", response);
  } catch (error) {
    throw error;
  }
};

export const sendCommentNotifcationEmail = async (
  recipientEmail,
  recipientName,
  commenterName,
  postUrl,
  commentContent
) => {
  const recipient = [{ email: recipientEmail }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "New comment on your post",
      html: createCommentNotificationEmailTemplate(
        recipientName,
        commenterName,
        postUrl,
        commentContent
      ),
      category: "comment_notification",
    });
    console.log("Notification email sent successfully");
  } catch (error) {
    throw error;
  }
};

export const sendConnectionAcceptedEmail = async (
  senderEmail,
  senderName,
  recipientName,
  profileUrl
) => {
  try {
    const recipient = [{ email: senderEmail }];
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: `${recipientName} accepted you're connection request`,
      html: createConnectionAcceptedEmailTemplate(
        senderName,
        recipientName,
        profileUrl
      ),
      category: "connection_accepted",
    });
  } catch (error) {
    throw error;
  }
};
