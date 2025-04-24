// controllers/feedbackController.js
const Feedback = require("../modal/getInModal");
const nodemailer = require("nodemailer");

// Create feedback for seller
exports.getInCreate = async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res
      .status(201)
      .json({ message: "Get in touch saved successfully", feedback });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all feedback
exports.getInAll = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.replyToMessage = async (req, res) => {
  const { email, replyText } = req.body;

  if (!email || !replyText) {
    return res.status(400).json({ error: "Email and replyText are required." });
  }

  console.log(email);
  console.log(replyText);
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // Using Gmail service for sending emails
      host: "smtp.gmail.com", // SMTP server for Gmail
      port: 465, // Secure port for Gmail
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const messageBody = `
Hello,

Thank you for reaching out to us via the contact form. We truly appreciate your message.

${replyText}

We would love to connect with you further to discuss this in more detail. Please let us know a suitable time for a brief meeting or call.

Looking forward to your response!

Best regards,  
SuperAdmin Support Team
`;

    await transporter.sendMail({
      from: `"SuperAdmin Support" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Thank you for reaching out — Let's Connect!",
      text: messageBody,
    });

    res.status(200).json({ message: "Email sent!" });
  } catch (error) {
    console.error("Failed to send email:", error);
    res
      .status(500)
      .json({ error: "Failed to send email. Please try again later." });
  }
};
