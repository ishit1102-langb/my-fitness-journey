import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderNotificationRequest {
  email: string;
  orderId: string;
  status: "processing" | "shipped" | "delivered";
  items: { name: string; quantity: number; price: number }[];
  total: number;
  estimatedDelivery?: string;
}

const getStatusMessage = (status: string) => {
  switch (status) {
    case "processing":
      return {
        subject: "Order Confirmed - We're preparing your order!",
        heading: "Thank you for your order!",
        message: "Your order has been received and is being processed. We'll notify you when it ships.",
        color: "#f59e0b",
      };
    case "shipped":
      return {
        subject: "Your order is on its way!",
        heading: "Great news! Your order has shipped!",
        message: "Your package is on its way to you. Track your delivery for the latest updates.",
        color: "#22c55e",
      };
    case "delivered":
      return {
        subject: "Your order has been delivered!",
        heading: "Your order has arrived!",
        message: "We hope you love your new gear! Don't forget to leave a review.",
        color: "#3b82f6",
      };
    default:
      return {
        subject: "Order Update",
        heading: "Order Status Update",
        message: "There's an update on your order.",
        color: "#6b7280",
      };
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, orderId, status, items, total, estimatedDelivery }: OrderNotificationRequest = await req.json();

    console.log(`Sending ${status} notification for order ${orderId} to ${email}`);

    const statusInfo = getStatusMessage(status);

    const itemsHtml = items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `
      )
      .join("");

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #22c55e; margin: 0;">FitTrack</h1>
            <p style="color: #666; margin: 5px 0;">Sports & Fitness Equipment</p>
          </div>
          
          <div style="background: ${statusInfo.color}; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
            <h2 style="margin: 0 0 10px 0;">${statusInfo.heading}</h2>
            <p style="margin: 0; opacity: 0.9;">${statusInfo.message}</p>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <p style="margin: 0 0 10px 0;"><strong>Order ID:</strong> ${orderId}</p>
            <p style="margin: 0 0 10px 0;"><strong>Status:</strong> ${status.charAt(0).toUpperCase() + status.slice(1)}</p>
            ${estimatedDelivery ? `<p style="margin: 0;"><strong>Estimated Delivery:</strong> ${new Date(estimatedDelivery).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>` : ""}
          </div>
          
          <h3 style="margin-bottom: 15px;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Item</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Qty</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 12px; text-align: right; font-weight: bold;">Total:</td>
                <td style="padding: 12px; text-align: right; font-weight: bold; color: #22c55e;">$${total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #666; font-size: 14px;">
              Thank you for shopping with FitTrack!<br>
              Questions? Reply to this email or contact our support team.
            </p>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "FitTrack <onboarding@resend.dev>",
      to: [email],
      subject: `${statusInfo.subject} - Order #${orderId}`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending order notification:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
