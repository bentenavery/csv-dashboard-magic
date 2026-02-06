// Email automation for ChartFlow trial system
// This integrates with SendGrid - configure SENDGRID_API_KEY in environment

const sgMail = require('@sendgrid/mail');

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Allow': 'POST'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const requestBody = JSON.parse(event.body || '{}');
    const { 
      type, // 'welcome', 'trial_ending', 'payment_success', 'payment_failed'
      customerEmail,
      customerName,
      trialEndDate,
      subscriptionId,
      planName = 'Pro'
    } = requestBody;

    if (!type || !customerEmail) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Email type and customer email are required' 
        })
      };
    }

    let emailData;
    
    switch (type) {
      case 'welcome':
        emailData = generateWelcomeEmail(customerName, customerEmail, trialEndDate, planName);
        break;
      case 'trial_ending':
        emailData = generateTrialEndingEmail(customerName, customerEmail, trialEndDate, planName);
        break;
      case 'payment_success':
        emailData = generatePaymentSuccessEmail(customerName, customerEmail, planName);
        break;
      case 'payment_failed':
        emailData = generatePaymentFailedEmail(customerName, customerEmail, subscriptionId);
        break;
      default:
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ error: 'Invalid email type' })
        };
    }

    // Send email if SendGrid is configured
    if (process.env.SENDGRID_API_KEY) {
      await sgMail.send(emailData);
      console.log(`Email sent successfully: ${type} to ${customerEmail}`);
    } else {
      console.log('SendGrid not configured - email would be sent:', emailData);
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: true, 
        message: `${type} email sent to ${customerEmail}` 
      })
    };

  } catch (error) {
    console.error('Email sending failed:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: error.message,
        details: 'Failed to send email'
      })
    };
  }
}

function generateWelcomeEmail(name, email, trialEndDate, planName) {
  const trialEndFormatted = new Date(trialEndDate * 1000).toLocaleDateString();
  
  return {
    to: email,
    from: {
      email: process.env.FROM_EMAIL || 'hello@chartflow.com',
      name: 'ChartFlow Team'
    },
    subject: `🎉 Welcome to ChartFlow ${planName} - Your 14-Day Trial Starts Now!`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 20px; overflow: hidden;">
        
        <!-- Header -->
        <div style="padding: 40px 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">
            <span style="font-size: 32px;">📊</span> Welcome to ChartFlow!
          </h1>
          <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">
            Your ${planName} trial is now active
          </p>
        </div>
        
        <!-- Content -->
        <div style="background: rgba(255,255,255,0.1); padding: 30px; margin: 0 20px 20px 20px; border-radius: 15px;">
          <h2 style="margin: 0 0 20px 0; color: #fff;">Hi ${name || 'there'}! 👋</h2>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            🚀 <strong>Your 14-day free trial is now active!</strong> You have full access to all ${planName} features until <strong>${trialEndFormatted}</strong>.
          </p>
          
          <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #fff;">✨ What you can do right now:</h3>
            <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
              <li>Upload unlimited CSV files</li>
              <li>Create beautiful, interactive dashboards</li>
              <li>Share with password protection</li>
              <li>Download as PNG/PDF</li>
              <li>Custom branding options</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://chartflow.com'}" 
               style="background: #fff; color: #667eea; padding: 15px 30px; border-radius: 50px; text-decoration: none; font-weight: bold; display: inline-block; box-shadow: 0 5px 15px rgba(0,0,0,0.2);">
              🎯 Start Creating Dashboards
            </a>
          </div>
          
          <p style="font-size: 14px; opacity: 0.8; margin-top: 30px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 20px;">
            <strong>Need help?</strong> Reply to this email or visit our <a href="${process.env.NEXT_PUBLIC_APP_URL}/help" style="color: #fff; text-decoration: underline;">help center</a>.
          </p>
        </div>
        
        <!-- Footer -->
        <div style="padding: 20px; text-align: center; font-size: 14px; opacity: 0.7;">
          <p style="margin: 0;">
            ChartFlow - Turn CSV into beautiful dashboards<br>
            <a href="mailto:hello@chartflow.com" style="color: #fff;">hello@chartflow.com</a>
          </p>
        </div>
      </div>
    `
  };
}

function generateTrialEndingEmail(name, email, trialEndDate, planName) {
  const trialEndFormatted = new Date(trialEndDate * 1000).toLocaleDateString();
  
  return {
    to: email,
    from: {
      email: process.env.FROM_EMAIL || 'hello@chartflow.com',
      name: 'ChartFlow Team'
    },
    subject: `⏰ Your ChartFlow trial ends in 3 days - Continue your journey!`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border-radius: 20px; overflow: hidden;">
        
        <!-- Header -->
        <div style="padding: 40px 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">
            <span style="font-size: 32px;">⏰</span> Don't lose your dashboards!
          </h1>
          <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">
            Your trial ends ${trialEndFormatted}
          </p>
        </div>
        
        <!-- Content -->
        <div style="background: rgba(255,255,255,0.1); padding: 30px; margin: 0 20px 20px 20px; border-radius: 15px;">
          <h2 style="margin: 0 0 20px 0; color: #fff;">Hi ${name || 'there'}! 👋</h2>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Your 14-day ChartFlow ${planName} trial ends in just <strong>3 days</strong> (${trialEndFormatted}). 
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            🎯 <strong>Keep building amazing dashboards</strong> - your payment method will be charged automatically to continue your ${planName} plan.
          </p>
          
          <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #fff;">🚀 What happens next:</h3>
            <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
              <li><strong>No interruption:</strong> Your dashboards stay online</li>
              <li><strong>Same great features:</strong> Everything you've been using</li>
              <li><strong>Automatic billing:</strong> We'll charge your card on ${trialEndFormatted}</li>
              <li><strong>Cancel anytime:</strong> No commitment beyond the first month</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://chartflow.com'}/dashboard" 
               style="background: #fff; color: #f5576c; padding: 15px 30px; border-radius: 50px; text-decoration: none; font-weight: bold; display: inline-block; box-shadow: 0 5px 15px rgba(0,0,0,0.2); margin-right: 10px;">
              📊 View My Dashboards
            </a>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://chartflow.com'}/cancel" 
               style="background: transparent; color: #fff; padding: 15px 30px; border: 2px solid rgba(255,255,255,0.3); border-radius: 50px; text-decoration: none; display: inline-block;">
              Cancel if needed
            </a>
          </div>
          
          <p style="font-size: 14px; opacity: 0.8; margin-top: 30px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 20px;">
            Questions? Just reply to this email - we're here to help! 💬
          </p>
        </div>
        
        <!-- Footer -->
        <div style="padding: 20px; text-align: center; font-size: 14px; opacity: 0.7;">
          <p style="margin: 0;">
            ChartFlow - Turn CSV into beautiful dashboards<br>
            <a href="mailto:hello@chartflow.com" style="color: #fff;">hello@chartflow.com</a>
          </p>
        </div>
      </div>
    `
  };
}

function generatePaymentSuccessEmail(name, email, planName) {
  return {
    to: email,
    from: {
      email: process.env.FROM_EMAIL || 'hello@chartflow.com',
      name: 'ChartFlow Team'
    },
    subject: `✅ Payment confirmed - Welcome to ChartFlow ${planName}!`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 20px; overflow: hidden;">
        
        <!-- Header -->
        <div style="padding: 40px 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">
            <span style="font-size: 32px;">✅</span> Payment Confirmed!
          </h1>
          <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">
            Welcome to ChartFlow ${planName}
          </p>
        </div>
        
        <!-- Content -->
        <div style="background: rgba(255,255,255,0.1); padding: 30px; margin: 0 20px 20px 20px; border-radius: 15px;">
          <h2 style="margin: 0 0 20px 0; color: #fff;">Thank you ${name || 'there'}! 🎉</h2>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Your payment was processed successfully and your ChartFlow ${planName} subscription is now active!
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://chartflow.com'}/dashboard" 
               style="background: #fff; color: #667eea; padding: 15px 30px; border-radius: 50px; text-decoration: none; font-weight: bold; display: inline-block; box-shadow: 0 5px 15px rgba(0,0,0,0.2);">
              🚀 Access My Dashboard
            </a>
          </div>
          
          <p style="font-size: 14px; opacity: 0.8; margin-top: 30px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 20px;">
            Your receipt will be sent separately. Manage your subscription anytime in your <a href="${process.env.NEXT_PUBLIC_APP_URL}/account" style="color: #fff; text-decoration: underline;">account settings</a>.
          </p>
        </div>
        
        <!-- Footer -->
        <div style="padding: 20px; text-align: center; font-size: 14px; opacity: 0.7;">
          <p style="margin: 0;">
            ChartFlow - Turn CSV into beautiful dashboards<br>
            <a href="mailto:hello@chartflow.com" style="color: #fff;">hello@chartflow.com</a>
          </p>
        </div>
      </div>
    `
  };
}

function generatePaymentFailedEmail(name, email, subscriptionId) {
  return {
    to: email,
    from: {
      email: process.env.FROM_EMAIL || 'hello@chartflow.com',
      name: 'ChartFlow Team'
    },
    subject: `⚠️ Payment issue with your ChartFlow subscription`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border-radius: 20px; overflow: hidden;">
        
        <!-- Header -->
        <div style="padding: 40px 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">
            <span style="font-size: 32px;">⚠️</span> Payment Update Needed
          </h1>
        </div>
        
        <!-- Content -->
        <div style="background: rgba(255,255,255,0.1); padding: 30px; margin: 0 20px 20px 20px; border-radius: 15px;">
          <h2 style="margin: 0 0 20px 0; color: #fff;">Hi ${name || 'there'}! 👋</h2>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            We couldn't process your payment for ChartFlow. This can happen if your card expired or if your bank declined the transaction.
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            <strong>Don't worry!</strong> Your account is still active for the next few days while we retry the payment.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://chartflow.com'}/account/billing" 
               style="background: #fff; color: #f5576c; padding: 15px 30px; border-radius: 50px; text-decoration: none; font-weight: bold; display: inline-block; box-shadow: 0 5px 15px rgba(0,0,0,0.2);">
              💳 Update Payment Method
            </a>
          </div>
          
          <p style="font-size: 14px; opacity: 0.8; margin-top: 30px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 20px;">
            Need help? Just reply to this email and we'll sort it out together! 💬
          </p>
        </div>
        
        <!-- Footer -->
        <div style="padding: 20px; text-align: center; font-size: 14px; opacity: 0.7;">
          <p style="margin: 0;">
            ChartFlow - Turn CSV into beautiful dashboards<br>
            <a href="mailto:hello@chartflow.com" style="color: #fff;">hello@chartflow.com</a>
          </p>
        </div>
      </div>
    `
  };
}