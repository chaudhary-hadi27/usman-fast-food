# Usman Fast Food - Full Stack Website

A professional full-stack fast food ordering website built with Next.js, MongoDB, and Tailwind CSS.

## 🚀 Features

- **Home Page** - Hero section with owner's welcome message
- **Menu Page** - Browse food items by category (Burger, Pizza, Fries, Drinks)
- **Shopping Cart** - Add items and manage quantities
- **Order Tracking** - Track order status in real-time
- **Admin Dashboard** - Manage menu items and order status
- **About Page** - Learn about the owner and restaurant
- **Contact Page** - Get in touch via form or WhatsApp
- **Responsive Design** - Works perfectly on mobile and desktop

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** MongoDB with Mongoose
- **Icons:** Lucide React
- **Images:** Cloudinary (optional)

## 📦 Installation

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd usman-fast-food
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Cloudinary (Optional)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. **Get MongoDB Connection String:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Click "Connect" → "Connect your application"
   - Copy the connection string and replace `<password>` with your database password

5. **Seed the database (Optional):**

You can manually add menu items through the admin dashboard, or use MongoDB Compass to import sample data.

## 🚀 Running the Application

### Development Mode:
```bash
npm run dev
```
Visit: `http://localhost:3000`

### Production Build:
```bash
npm run build
npm start
```

## 📱 Pages

### Public Pages:
- `/` - Home Page
- `/menu` - Menu Page
- `/cart` - Shopping Cart
- `/track` - Order Tracking
- `/about` - About Us
- `/contact` - Contact Page

### Admin Pages:
- `/admin/login` - Admin Login
- `/admin/dashboard` - Admin Dashboard

**Admin Credentials:**
- Username: `admin`
- Password: `admin123`

## 🎨 Color Theme

- Primary: Yellow (#fbbf24)
- Secondary: Black (#000000)
- Background: White (#ffffff)

## 📝 Project Structure

```
usman-fast-food/
├── lib/
│   └── mongodb.ts          # Database connection
├── models/
│   ├── MenuItem.ts         # Menu item schema
│   ├── Order.ts           # Order schema
│   └── User.ts            # User schema
├── components/
│   └── Header.tsx         # Navigation header
├── src/app/
│   ├── index.tsx          # Home page
│   ├── menu.tsx           # Menu page
│   ├── cart.tsx           # Cart page
│   ├── track.tsx          # Order tracking
│   ├── about.tsx          # About page
│   ├── contact.tsx        # Contact page
│   ├── admin/
│   │   ├── login.tsx      # Admin login
│   │   └── dashboard.tsx  # Admin dashboard
│   └── api/
│       ├── menu.ts        # Menu API endpoints
│       └── orders.ts      # Orders API endpoints
├── styles/
│   └── globals.css        # Global styles
└── package.json
```

## 🔑 Key Features Explained

### 1. Menu Management
- Add, edit, and delete menu items
- Categorize items (Burger, Pizza, Fries, Drinks)
- Upload images via URL (Cloudinary recommended)

### 2. Order System
- Customers can add items to cart
- Submit orders with delivery details
- Get unique order ID for tracking
- Track order status: Pending → Cooking → Out for Delivery → Delivered

### 3. Admin Dashboard
- View all orders in real-time
- Update order status
- Manage menu items (CRUD operations)
- Simple authentication system

### 4. Shopping Cart
- Add/remove items
- Adjust quantities
- View total price
- Persistent cart (localStorage)

## 🌐 Deployment

### Deploy to Vercel:

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!

### Deploy to Netlify:

1. Build the project: `npm run build`
2. Deploy the `.next` folder to Netlify
3. Add environment variables
4. Set build command: `npm run build`
5. Set publish directory: `.next`

## 📸 Sample Menu Items

You can use these image URLs from Unsplash:

**Burgers:**
- https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400
- https://images.unsplash.com/photo-1550547660-d9450f859349?w=400

**Pizza:**
- https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400
- https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400

**Fries:**
- https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400
- https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400

**Drinks:**
- https://images.unsplash.com/photo-1546173159-315724a31696?w=400
- https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400

## 🐛 Troubleshooting

### MongoDB Connection Issues:
- Ensure your IP is whitelisted in MongoDB Atlas
- Check if connection string is correct
- Verify database user has proper permissions

### Build Errors:
- Clear `.next` folder: `rm -rf .next`
- Delete node_modules: `rm -rf node_modules`
- Reinstall: `npm install`
- Rebuild: `npm run build`

### Cart Not Working:
- Check if localStorage is enabled in browser
- Clear browser cache and localStorage
- Try in incognito mode

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Email: info@usmanfastfood.com
- WhatsApp: +92 300 1234567

## 📄 License

This project is open source and available under the MIT License.

## 🎉 Credits

Developed with ❤️ for Usman Fast Food

---

**Happy Coding! 🍔🍕🍟**