# TextApp - Clickable Prototype

A simple Next.js prototype for a text content sharing application with user authentication and post management features.

## Project Structure

```
TextApp/
├── app/
│   ├── layout.js          # Main layout with navigation
│   ├── layout.css         # Global styles
│   ├── page.js            # Home page
│   ├── login/
│   │   └── page.js        # Login page
│   ├── register/
│   │   └── page.js        # Registration page
│   ├── profile/
│   │   └── page.js        # User profile page with posts
│   └── add-post/
│       └── page.js        # Create new post page
├── package.json
├── next.config.js
└── README.md
```

## Pages

### 1. **Home Page** (`/`)
- Welcome message and application overview
- Quick links to login/register
- Feature highlights

### 2. **Registration Page** (`/register`)
- Form to create a new account
- Fields: Full Name, Email, Password, Confirm Password
- Link to login page

### 3. **Login Page** (`/login`)
- Form to authenticate users
- Fields: Email, Password
- Link to registration page

### 4. **Profile Page** (`/profile`)
- User profile information display
- List of user's posts with sample data
- Edit and Delete buttons for posts
- Button to create new post
- Edit Profile and Logout buttons

### 5. **Add Post Page** (`/add-post`)
- Form to create new posts
- Fields: Post Title, Content, Image URL
- Publish and Cancel buttons

## Features

- **Simple Navigation Bar**: Easily navigate between all pages
- **Clean UI Design**: Minimal and user-friendly interface
- **Responsive Layout**: Works on different screen sizes
- **Form Placeholders**: All forms are functional for testing navigation
- **Clickable Prototype**: All links and buttons navigate properly

## Getting Started

### Prerequisites
- Node.js 16.x or higher
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd TextApp
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser and go to:
```
http://localhost:3000
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run linter

## Next Steps

This is a clickable prototype with placeholders. To continue development:

1. **Backend Integration**: Connect to your C#/.NET backend API
2. **Authentication**: Implement proper authentication with JWT tokens
3. **Rich Text Editor**: Add a rich text editor for post content formatting
4. **Image Upload**: Implement image upload functionality
5. **Database**: Connect to your database for storing users and posts
6. **Validation**: Add form validation and error handling
7. **Styling**: Enhance the UI with your preferred styling approach (Tailwind CSS, Styled Components, etc.)

## Notes

- All form submissions currently show placeholder alerts
- User data and posts are hardcoded for demonstration
- This is a frontend prototype - backend integration is needed for actual functionality
