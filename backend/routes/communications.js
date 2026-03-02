import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

// Configure email transporter (using Gmail as example)
// In production, use environment variables for credentials
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER || "your-email@gmail.com",
        pass: process.env.EMAIL_PASSWORD || "your-app-password"
    }
});

// POST /api/tpo/email/bulk - Send bulk emails to applicants
router.post("/tpo/email/bulk", async (req, res) => {
    try {
        const { recipients, subject, message } = req.body;

        if (!recipients || recipients.length === 0) {
            return res.status(400).json({ error: "No recipients provided" });
        }

        if (!subject || !message) {
            return res.status(400).json({ error: "Subject and message are required" });
        }

        // Send emails
        const emailPromises = recipients.map(email => {
            return transporter.sendMail({
                from: process.env.EMAIL_USER || "your-email@gmail.com",
                to: email,
                subject: subject,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
                            <h1 style="color: white; margin: 0;">InternVault</h1>
                        </div>
                        <div style="padding: 30px; background: #f9fafb;">
                            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                                ${message.replace(/\n/g, '<br>')}
                            </div>
                        </div>
                        <div style="background: #1f2937; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
                            <p>This is an automated message from InternVault TPO Portal</p>
                        </div>
                    </div>
                `
            });
        });

        await Promise.all(emailPromises);

        res.json({
            success: true,
            message: `Successfully sent emails to ${recipients.length} recipients`
        });

    } catch (error) {
        console.error("Bulk email error:", error);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/recruiter/email/bulk - Send bulk emails to applicants (Recruiter)
router.post("/recruiter/email/bulk", async (req, res) => {
    try {
        const { recipients, subject, message, companyName } = req.body;

        if (!recipients || recipients.length === 0) {
            return res.status(400).json({ error: "No recipients provided" });
        }

        if (!subject || !message) {
            return res.status(400).json({ error: "Subject and message are required" });
        }

        // Send emails
        const emailPromises = recipients.map(email => {
            return transporter.sendMail({
                from: process.env.EMAIL_USER || "your-email@gmail.com",
                to: email,
                subject: subject,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); padding: 20px; text-align: center;">
                            <h1 style="color: white; margin: 0;">${companyName || 'InternVault Recruiter'}</h1>
                        </div>
                        <div style="padding: 30px; background: #f9fafb;">
                            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                                ${message.replace(/\n/g, '<br>')}
                            </div>
                        </div>
                        <div style="background: #1f2937; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
                            <p>This is an automated message from ${companyName || 'the Recruitment Team'}</p>
                        </div>
                    </div>
                `
            });
        });

        await Promise.all(emailPromises);

        res.json({
            success: true,
            message: `Successfully sent emails to ${recipients.length} recipients`
        });

    } catch (error) {
        console.error("Recruiter Bulk email error:", error);
        res.status(500).json({ error: error.message });
    }
});

import Application from "../models/Application.js";

// POST /api/recruiter/schedule-interview
router.post("/recruiter/schedule-interview", async (req, res) => {
    try {
        const { applicationId, studentEmail, studentName, interviewType, meetingLink, date, message, type, link } = req.body;

        // Handle aliases from frontend
        const finalMeetingLink = meetingLink || link;
        const finalInterviewType = interviewType || type;

        if (!studentEmail || !finalMeetingLink) {
            return res.status(400).json({ error: "Student email and meeting link are required" });
        }

        const dateObj = new Date(date);
        const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

        // Update Application Record if applicationId is provided
        if (applicationId) {
            await Application.findByIdAndUpdate(applicationId, {
                interview: {
                    scheduled: true,
                    type: finalInterviewType,
                    date: dateObj,
                    link: finalMeetingLink,
                    message: message,
                    status: 'scheduled'
                }
            });
        } else {
            // Try to find application by email if no ID (fallback)
            // This is risky if user has multiple apps, but better than nothing for legacy calls
            await Application.findOneAndUpdate(
                { email: studentEmail, status: { $ne: 'rejected' } }, // Try to find an active application
                {
                    interview: {
                        scheduled: true,
                        type: finalInterviewType,
                        date: dateObj,
                        link: finalMeetingLink,
                        message: message,
                        status: 'scheduled'
                    }
                },
                { sort: { createdAt: -1 } } // Update most recent
            );
        }

        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <div style="background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">Interview Invitation</h1>
                </div>
                <div style="padding: 30px; background: #ffffff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                    <p style="font-size: 16px;">Dear <strong>${studentName}</strong>,</p>
                    <p style="font-size: 16px; color: #4b5563;">You have been invited for an interview based on your recent code submission.</p>
                    
                    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>📅 Date & Time:</strong> ${formattedDate}</p>
                        <p style="margin: 5px 0;"><strong>🎥 Platform:</strong> ${finalInterviewType || 'Video Call'}</p>
                        <div style="margin-top: 15px;">
                            <a href="${finalMeetingLink}" style="background-color: #7c3aed; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Join Interview</a>
                        </div>
                    </div>

                    ${message ? `<p style="font-size: 14px; color: #6b7280; font-style: italic;">Note from Recruiter: "${message}"</p>` : ''}
                    
                    <p style="margin-top: 30px; font-size: 14px; color: #9ca3af;">Good luck!<br>The Recruitment Team</p>
                </div>
            </div>
        `;

        // Check if email credentials are configured
        if (!process.env.EMAIL_USER || process.env.EMAIL_USER === "your-email@gmail.com") {
            console.warn("⚠️  Email Simulation: Credentials not set. Skipping email send.");
            console.log("To:", studentEmail);
            console.log("Subject:", `Interview Invitation: ${finalInterviewType || 'Technical Round'}`);
            // Return success to simulated email interaction
            return res.json({ success: true, message: "Interview invitation sent (Simulated)" });
        }

        await transporter.sendMail({
            from: process.env.EMAIL_USER || "noreply@internvault.com",
            to: studentEmail,
            subject: `Interview Invitation: ${finalInterviewType || 'Technical Round'}`,
            html: emailHtml
        });

        res.json({ success: true, message: "Interview invitation sent successfully" });

    } catch (error) {
        console.error("Interview schedule error:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
