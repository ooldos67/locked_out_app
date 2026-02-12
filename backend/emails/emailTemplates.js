export function createWelcomeEmailTemplate(name, profileUrl) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to LockedOut</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(to right, #0077B5, #00A0DC); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
      <img src="https://img.freepik.com/premium-vector/linkedin-logo_578229-227.jpg" alt="LockedOut Logo" style="width: 150px; margin-bottom: 20px;border-radius: 10px;">
      <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to LockedOut!</h1>
    </div>
    <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
      <p style="font-size: 18px; color: #0077B5;"><strong>Hello ${name},</strong></p>
      <p>We’re thrilled to inform you that your application to underwhelm has been successfully received. Welcome to the world’s premier professional network for massive fails, awkward f-ups, general incompetence, and forgettable face-palm moments.</p>
      <div style="background-color: #f3f6f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="font-size: 16px; margin: 0;"><strong>Here's how to get started:</strong></p>
        <ul style="padding-left: 20px;">
          <li>Complete your profile</li>
          <li>Connect with colleagues and friends</li>
          <li>Share and celebrate your most recent embarrassment</li>
          <li>Update your Failure Journey</li>
        </ul>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${profileUrl}" style="background-color: #0077B5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; transition: background-color 0.3s;">Complete Your Profile</a>
      </div>
      <p>Remember: While others are busy posting about 5am cold plunges and “humbled to announce” promotions, you’re building something far more powerful — honesty.</p>
      <p>Welcome to the revolution,<br>The LockedOut Team</p>
    </div>
  </body>
  </html>
  `;
}

export const createConnectionAcceptedEmailTemplate = (
  senderName,
  recipientName,
  profileUrl
) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Connection Was Accepted</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <div style="background: linear-gradient(to right, #0077B5, #00A0DC); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <img src="https://img.freepik.com/premium-vector/linkedin-logo_578229-227.jpg" alt="LockedOut Logo" style="width: 150px; margin-bottom: 20px; border-radius: 10px;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Connection Accepted</h1>
  </div>

  <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">

    <p style="font-size: 18px; color: #0077B5;">
      <strong>Good news, ${senderName},</strong>
    </p>

    <p>
      <strong>${recipientName}</strong> has officially accepted your connection request.
    </p>

    <p>
      That’s right. Despite seeing your profile. Despite reading your bio. Despite your “Open to Disappointment” status.
    </p>

    <div style="background-color: #f3f6f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="font-size: 16px; margin: 0;">
        <strong>What this means:</strong>
      </p>
      <ul style="padding-left: 20px;">
        <li>You are now professionally associated.</li>
        <li>They can see your failures in real time.</li>
        <li>You can endorse each other for “Strategic Overthinking.”</li>
        <li>This will likely lead to nothing.</li>
      </ul>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${profileUrl}" style="background-color: #0077B5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; transition: background-color 0.3s;">View ${recipientName}'s Profile</a>
    </div>

    <p>
      Remember: Real networking isn’t about opportunity, it’s about mutually witnessing each other’s slow career drift.
    </p>

    <p>
      Stay mediocre,<br>
      The LockedOut Team
    </p>

  </div>

</body>
</html>`;

export const createCommentNotificationEmailTemplate = (
  recipientName,
  commenterName,
  postUrl,
  commentContent
) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You Got a Comment</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <div style="background: linear-gradient(to right, #0077B5, #00A0DC); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <img src="https://img.freepik.com/premium-vector/linkedin-logo_578229-227.jpg" alt="LockedOut Logo" style="width: 150px; margin-bottom: 20px; border-radius: 10px;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Someone Commented</h1>
  </div>

  <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">

    <p style="font-size: 18px; color: #0077B5;">
      <strong>Brace yourself, ${recipientName},</strong>
    </p>

    <p>
      <strong>${commenterName}</strong> has commented on your post.
    </p>

    <p>
      Yes. They read it. All of it. Even the part you considered deleting.
    </p>

    <div style="background-color: #f3f6f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="font-size: 16px; margin: 0;">
        <strong>The comment says:</strong>
      </p>
      <p style="margin-top: 10px; font-style: italic; color: #555;">
        "${commentContent}"
      </p>
    </div>

    <p>
      This could mean:
    </p>

    <ul style="padding-left: 20px;">
      <li>You’ve sparked meaningful discourse.</li>
      <li>You’ve triggered secondhand embarrassment.</li>
      <li>They feel bad for you.</li>
      <li>They misclicked.</li>
    </ul>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${postUrl}" style="background-color: #0077B5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px;">
        View Comment (Mentally Prepare First)
      </a>
    </div>

    <p>
      Remember: All publicity is good publicity. Right? 
    </p>

    <p>
      Unprofessionally yours,<br>
      The LockedOut Team
    </p>

  </div>

</body>
</html>`;
