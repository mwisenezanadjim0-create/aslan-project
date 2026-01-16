# Aslan Restaurant Management System

A complete restaurant management system with WhatsApp notifications, built with Node.js, Express, MongoDB, and Baileys WhatsApp API.

## Features

- 🔐 **Secure Authentication** - Email-based login with JWT tokens
- 📊 **Dashboard** - Manage stock, daily reports, marketing, and orders
- 📱 **WhatsApp Notifications** - Automatic notifications to boss for orders and reports
- 💾 **MongoDB Database** - Cloud-based data storage with MongoDB Atlas
- 🎨 **Modern UI** - Beautiful, responsive frontend design

## Tech Stack

**Backend:**
- Node.js & Express
- MongoDB with Mongoose
- JWT Authentication
- Baileys (WhatsApp Web API)
- bcryptjs for password hashing

**Frontend:**
- HTML5, CSS3, JavaScript
- Responsive design
- Toast notifications

## Getting Started

### Prerequisites

- Node.js 18 or higher
- MongoDB Atlas account
- WhatsApp account for notifications

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd aslan-project
   ```

2. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   JWT_SECRET=your_secure_jwt_secret
   BOSS_NUMBER=250XXXXXXXXX
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Scan WhatsApp QR Code**
   - Check the terminal for QR code
   - Scan with WhatsApp to authenticate
   - Session will be saved for future use

6. **Access the application**
   - Open browser: `http://localhost:5000`
   - Create account with allowed email
   - Login and start using the dashboard

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for:
- Render.com (Recommended)
- Railway.app
- Heroku

## Project Structure

```
aslan-project/
├── backend/
│   ├── config/          # Configuration files
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions (WhatsApp, Logger)
│   ├── baileys_auth_info/  # WhatsApp session data
│   ├── logs/            # Application logs
│   ├── server.js        # Main server file
│   └── package.json
├── frontend/
│   ├── css/             # Stylesheets
│   ├── js/              # JavaScript files
│   ├── images/          # Images and assets
│   ├── index.html       # Homepage
│   ├── login.html       # Login page
│   ├── signup.html      # Signup page
│   └── dashboard.html   # Dashboard
├── .gitignore
├── DEPLOYMENT.md
└── README.md
```

## Security Features

- ✅ Strong JWT secret
- ✅ Password hashing with bcrypt
- ✅ Email whitelist for authorized users
- ✅ CORS protection
- ✅ Environment-based configuration
- ✅ Secure session management

## Allowed Emails

Only these emails can create accounts:
- mwisenezanadjim0@gmail.com
- admin@aslan.com
- boss@aslan.com
- manager@aslan.com
- chef@aslan.com

## WhatsApp Integration

The system automatically sends WhatsApp messages to the boss number when:
- A new order is placed
- A daily progress report is submitted

Messages include:
- Customer details
- Order information
- Payment type
- Timestamps

## Monitoring & Logs

- Application logs are stored in `backend/logs/`
- Logs include timestamps, error details, and stack traces
- Check logs for debugging and monitoring

## Troubleshooting

### WhatsApp not connecting
- Delete `baileys_auth_info` folder
- Restart server and scan QR code again

### Database connection failed
- Verify MONGO_URI in .env
- Check MongoDB Atlas IP whitelist
- Ensure database user has correct permissions

### Login not working
- Clear browser localStorage
- Check if email is in allowed list
- Verify JWT_SECRET is set

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For issues or questions, contact: mwisenezanadjim0@gmail.com

---

**Built with ❤️ for Aslan Restaurant**
