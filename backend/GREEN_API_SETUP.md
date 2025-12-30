# Green API Setup Guide for WhatsApp Notifications

This guide will help you set up Green API to enable WhatsApp notifications for InternVault.

## Step 1: Create Green API Account

1. Visit [https://green-api.com](https://green-api.com)
2. Click **"Sign Up"** or **"Get Started"**
3. Fill in your details and create an account
4. Verify your email address

## Step 2: Create an Instance

1. After logging in, go to your **Dashboard**
2. Click **"Create Instance"**
3. You'll see a QR code on the screen

## Step 3: Connect Your WhatsApp

1. Open **WhatsApp** on your mobile device
2. Go to **Settings** → **Linked Devices**
3. Tap **"Link a Device"**
4. Scan the QR code shown in Green API dashboard
5. Wait for the connection to be established
6. Status should change to **"authorized"** (green indicator)

## Step 4: Get Your API Credentials

Once connected, you'll see your instance details:

- **idInstance**: A unique identifier for your instance (looks like: `7103123456`)
- **apiTokenInstance**: Your API token (long alphanumeric string)

Copy both of these values.

## Step 5: Configure Backend

1. Open your backend `.env` file:
   ```
   C:\Users\kdm09\Downloads\Internvault\backend\.env
   ```

2. Add these lines with your actual credentials:
   ```env
   GREEN_API_INSTANCE_ID=your_instance_id_here
   GREEN_API_TOKEN=your_api_token_here
   ```

3. Save the file

**Example:**
```env
GREEN_API_INSTANCE_ID=7103123456
GREEN_API_TOKEN=abc123def456ghi789jkl012mno345pqr678stu901vwx234
```

## Step 6: Verify Setup

1. Start your backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Test the WhatsApp notification using this command in a new terminal:
   ```bash
   curl -X POST http://localhost:5000/api/notifications/test ^
   -H "Content-Type: application/json" ^
   -d "{\"phone\":\"your_phone_number_here\",\"message\":\"Test from InternVault!\"}"
   ```
   
   **Replace** `your_phone_number_here` with your actual phone number in format: `919876543210` (country code + number, no + or spaces)

3. You should receive a WhatsApp message within a few seconds! ✅

## Important Notes

### Phone Number Format
- ✅ **Correct**: `919876543210` (country code + number)
- ❌ **Wrong**: `+91 98765 43210` (has + and spaces)
- ❌ **Wrong**: `9876543210` (missing country code)

### Free Tier Limits
- 100 messages per month (free)
- Perfect for testing and small user groups
- Monitor usage in Green API dashboard

### Keeping Instance Active
- Keep your WhatsApp connected to the instance
- Don't log out from Green API dashboard
- Instance stays active as long as WhatsApp is linked

## Troubleshooting

### "Instance not authorized" error
- Re-scan QR code in Green API dashboard
- Make sure WhatsApp is open and connected to internet

### Messages not sending
1. Check if instance status is "authorized" (green)
2. Verify phone numbers are in correct format
3. Check your Green API message quota (100/month free)
4. Review backend console logs for errors

### Invalid credentials error
- Double-check `GREEN_API_INSTANCE_ID` and `GREEN_API_TOKEN` in `.env`
- Make sure there are no extra spaces or quotes
- Restart backend server after updating `.env`

## API Endpoints

Once configured, you have these endpoints:

### Test Notification
```bash
POST http://localhost:5000/api/notifications/test
Body: {
  "phone": "919876543210",
  "message": "Optional custom message"
}
```

### Get User Preferences
```bash
GET http://localhost:5000/api/notifications/preferences/:userId
```

### Update User Preferences
```bash
PATCH http://localhost:5000/api/notifications/preferences/:userId
Body: {
  "whatsappNotifications": true
}
```

## How It Works

1. **User Signs Up**: Users provide phone number during registration
2. **Opt-In**: Users can choose to receive WhatsApp notifications (default: enabled)
3. **New Internship Posted**: When a student hosts an internship
4. **Auto-Notification**: All opted-in users receive WhatsApp message with:
   - Company name
   - Expiry time (24 hours)
   - Direct application link

## Next Steps

✅ Set up Green API account  
✅ Configure `.env` file  
✅ Test with your phone number  
✅ Register users with phone numbers  
✅ Post test internship ad  
✅ Verify notifications are sent!

---

Need help? Check:
- [Green API Documentation](https://green-api.com/docs/)
- [API Methods](https://green-api.com/docs/api/)
