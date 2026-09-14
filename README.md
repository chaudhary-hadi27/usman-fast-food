# Usman Fast Food - Full Stack Website

A professional fast food website built with Next.js and Tailwind CSS.

## 🚀 Features

- **Home Page** - Hero section with owner's welcome message
- **Menu Page** - Browse food items by category (Burger, Pizza, Fries, Drinks)
- **Contact Page** - Get in touch via form or WhatsApp
- **Responsive Design** - Works perfectly on mobile and desktop

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Icons:** Lucide React

## 📦 Installation

1. **Clone the repository:**
```bash
git clone https://github.com/chaudhary-hadi27/usman-fast-food.git
cd usman-fast-food
```

2. **Install dependencies:**
```bash
npm install
```

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

## 🎨 Color Theme

- Primary: Yellow (#fbbf24)
- Secondary: Black (#000000)
- Background: White (#ffffff)

## 🔑 Key Features Explained

### 1. Menu Management
- Add, edit, and delete menu items
- Categorize items (Burger, Pizza, Fries, Drinks)
- Upload images via URL (Cloudinary recommended)

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


### Build Errors:
- Clear `.next` folder: `rm -rf .next`
- Delete node_modules: `rm -rf node_modules`
- Reinstall: `npm install`
- Rebuild: `npm run build`

### Cart Not Working:
- Check if localStorage is enabled in browser
- Clear browser cache and localStorage
- Try in incognito mode


## 🎉 Credits

Developed with ❤️ for Usman Fast Food

---

**Happy Coding! 🍔🍕🍟**
