import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');

export async function sendOrderReceiptEmail(email: string, orderId: string, amount: number) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Nexus Shop <orders@saheragroup.com>', // This domain must be verified in Resend
      to: [email],
      subject: `Order Receipt: ${orderId.split('-')[0].toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #111827; margin-bottom: 24px;">Thank you for your order!</h1>
          <p style="color: #4b5563; font-size: 16px; line-height: 24px;">
            We've received your order and are getting it ready to ship. 
          </p>
          
          <div style="background-color: #f9fafb; padding: 24px; border-radius: 12px; margin-top: 32px; margin-bottom: 32px;">
            <p style="margin: 0; color: #6b7280; font-size: 14px; text-transform: uppercase; font-weight: bold;">Order Reference</p>
            <p style="margin: 8px 0 24px 0; font-family: monospace; font-size: 18px; color: #111827;">${orderId}</p>
            
            <div style="border-top: 1px solid #e5e7eb; padding-top: 24px; display: flex; justify-content: space-between;">
              <span style="color: #4b5563; font-size: 16px;">Total Paid</span>
              <span style="color: #111827; font-size: 24px; font-weight: bold;">$${amount.toFixed(2)}</span>
            </div>
          </div>
          
          <a href="https://besa-ecommerce.com/account/orders" style="display: inline-block; background-color: #f97316; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold;">Track Your Order</a>
        </div>
      `
    });

    if (error) {
      console.error("Resend Error:", error);
      return false;
    }
    
    console.log("Email receipt sent successfully!", data);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}
