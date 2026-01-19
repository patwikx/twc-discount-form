
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_123_456");

export async function sendApprovalRequest(
  to: string,
  applicantName: string,
  applicationId: string,
  applicationDetails?: {
    company?: string;
    department?: string;
    position?: string;
    hotel?: string;
    discountType?: string;
    availmentDate?: string;
  }
) {
  const sender = process.env.EMAIL_FROM || "no-reply@doloreshotels.com";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const approvalLink = `${baseUrl}/admin/approve/${applicationId}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Courier New', monospace;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 3px solid #000000;">
              
              <!-- Header -->
              <tr>
                <td style="background-color: #000000; color: #ffffff; padding: 20px; text-align: center;">
                  <img src="${baseUrl}/twc-logo.png" alt="TWC Logo" width="60" height="60" style="display: block; margin: 0 auto 10px auto;">
                  <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px;">DOLORES HOTELS & RESORTS</h1>
                  <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">EMPLOYEE DISCOUNT APPLICATION</p>
                </td>
              </tr>

              <!-- Alert -->
              <tr>
                <td style="background-color: #ffd700; padding: 15px; text-align: center; border-bottom: 3px solid #000;">
                  <strong style="font-size: 14px;">⚠️ ACTION REQUIRED: APPROVAL NEEDED</strong>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 30px;">
                  <p style="margin: 0 0 20px 0; font-size: 16px;">
                    <strong>${applicantName}</strong> has submitted a discount application that requires your approval.
                  </p>

                  ${applicationDetails ? `
                  <!-- Application Details -->
                  <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f9f9f9; border: 2px solid #000; margin-bottom: 25px;">
                    <tr style="border-bottom: 1px solid #ddd;">
                      <td style="font-size: 12px; color: #666; width: 40%;">COMPANY</td>
                      <td style="font-weight: bold;">${applicationDetails.company || 'N/A'}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #ddd;">
                      <td style="font-size: 12px; color: #666;">DEPARTMENT</td>
                      <td style="font-weight: bold;">${applicationDetails.department || 'N/A'}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #ddd;">
                      <td style="font-size: 12px; color: #666;">POSITION</td>
                      <td style="font-weight: bold;">${applicationDetails.position || 'N/A'}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #ddd;">
                      <td style="font-size: 12px; color: #666;">HOTEL/RESORT</td>
                      <td style="font-weight: bold;">${applicationDetails.hotel || 'N/A'}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #ddd;">
                      <td style="font-size: 12px; color: #666;">DISCOUNT TYPE</td>
                      <td style="font-weight: bold;">${applicationDetails.discountType || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 12px; color: #666;">AVAILMENT DATE</td>
                      <td style="font-weight: bold;">${applicationDetails.availmentDate || 'N/A'}</td>
                    </tr>
                  </table>
                  ` : ''}

                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <a href="${approvalLink}" 
                           style="display: inline-block; padding: 15px 40px; background-color: #000; color: #fff; text-decoration: none; font-weight: bold; font-size: 14px; border: 3px solid #000; letter-spacing: 1px;">
                          REVIEW & APPROVE
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 25px 0 0 0; font-size: 12px; color: #666; text-align: center;">
                    Or copy this link: <br>
                    <a href="${approvalLink}" style="color: #000; word-break: break-all;">${approvalLink}</a>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f0f0f0; padding: 15px; text-align: center; border-top: 2px solid #000;">
                  <p style="margin: 0; font-size: 11px; color: #666;">
                    This is an automated message from the Employee Discount System.<br>
                    Please do not reply to this email.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  console.log(`📧 Sending approval email to: ${to}`);
  console.log(`📧 From: ${sender}`);
  console.log(`📧 Approval link: ${approvalLink}`);

  try {
    const result = await resend.emails.send({
      from: sender,
      to,
      subject: `[ACTION REQUIRED] Discount Application: ${applicantName}`,
      html,
    });
    console.log("✅ Email sent successfully:", result);
    return { success: true };
  } catch (error: any) {
    console.error("❌ Failed to send approval email:", error);
    console.error("❌ Error details:", error.message || error);
    return { success: false, error };
  }
}

export async function sendApplicationStatus(
  to: string,
  applicantName: string,
  applicationId: string,
  status: "APPROVED" | "REJECTED",
  applicationDetails?: {
    company?: string;
    hotel?: string;
    discountType?: string;
    availmentDate?: string;
    qrToken?: string; // QR token for generating QR code image
  }
) {
  const sender = process.env.EMAIL_FROM || "onboarding@resend.dev";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const statusLink = `${baseUrl}/status/${applicationId}`;

  const isApproved = status === "APPROVED";
  const statusColor = isApproved ? "#22c55e" : "#ef4444";
  const statusText = isApproved ? "APPROVED ✓" : "REJECTED ✗";
  const statusMessage = isApproved
    ? "Good news! Your employee discount application has been approved."
    : "We regret to inform you that your discount application has been rejected.";

  // Generate QR code URL using free API
  const qrCodeUrl = applicationDetails?.qrToken
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(applicationDetails.qrToken)}`
    : null;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Courier New', monospace;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 3px solid #000000;">
              
              <!-- Header -->
              <tr>
                <td style="background-color: #000000; color: #ffffff; padding: 20px; text-align: center;">
                  <img src="${baseUrl}/twc-logo.png" alt="TWC Logo" width="60" height="60" style="display: block; margin: 0 auto 10px auto;">
                  <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px;">DOLORES HOTELS & RESORTS</h1>
                  <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">EMPLOYEE DISCOUNT APPLICATION</p>
                </td>
              </tr>

              <!-- Status Banner -->
              <tr>
                <td style="background-color: ${statusColor}; padding: 20px; text-align: center; border-bottom: 3px solid #000;">
                  <strong style="font-size: 18px; color: #fff;">${statusText}</strong>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 30px;">
                  <p style="margin: 0 0 20px 0; font-size: 16px;">
                    Dear <strong>${applicantName}</strong>,
                  </p>
                  <p style="margin: 0 0 20px 0; font-size: 14px;">
                    ${statusMessage}
                  </p>

                  ${isApproved && applicationDetails ? `
                  <!-- Application Details -->
                  <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f9f9f9; border: 2px solid #000; margin-bottom: 25px;">
                    <tr style="border-bottom: 1px solid #ddd;">
                      <td style="font-size: 12px; color: #666; width: 40%;">COMPANY</td>
                      <td style="font-weight: bold;">${applicationDetails.company || 'N/A'}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #ddd;">
                      <td style="font-size: 12px; color: #666;">HOTEL/RESORT</td>
                      <td style="font-weight: bold;">${applicationDetails.hotel || 'N/A'}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #ddd;">
                      <td style="font-size: 12px; color: #666;">DISCOUNT TYPE</td>
                      <td style="font-weight: bold;">${applicationDetails.discountType || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style="font-size: 12px; color: #666;">AVAILMENT DATE</td>
                      <td style="font-weight: bold;">${applicationDetails.availmentDate || 'N/A'}</td>
                    </tr>
                  </table>

                  ${qrCodeUrl ? `
                  <!-- QR Code -->
                  <div style="text-align: center; margin-bottom: 25px;">
                    <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold;">📱 YOUR DISCOUNT QR CODE</p>
                    <div style="display: inline-block; padding: 15px; border: 3px solid #000; background-color: #fff;">
                      <img src="${qrCodeUrl}" alt="Discount QR Code" width="200" height="200" style="display: block;">
                    </div>
                    <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">Present this QR code at the resort/hotel to avail your discount.</p>
                  </div>
                  ` : ''}
                  ` : ''}

                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <a href="${statusLink}" 
                           style="display: inline-block; padding: 15px 40px; background-color: #000; color: #fff; text-decoration: none; font-weight: bold; font-size: 14px; border: 3px solid #000; letter-spacing: 1px;">
                          VIEW STATUS
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 25px 0 0 0; font-size: 12px; color: #666; text-align: center;">
                    Or copy this link: <br>
                    <a href="${statusLink}" style="color: #000; word-break: break-all;">${statusLink}</a>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f0f0f0; padding: 15px; text-align: center; border-top: 2px solid #000;">
                  <p style="margin: 0; font-size: 11px; color: #666;">
                    This is an automated message from the Employee Discount System.<br>
                    Please do not reply to this email.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: sender,
      to,
      subject: `Discount Application ${status}: ${applicantName}`,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send status email:", error);
    return { success: false, error };
  }
}
