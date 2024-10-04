# Management Dashboard Demo

This project is for demoing/testing purposes to demonstrate the integration of authentication, data management, and dynamic form handling in a web app for managing records. It is not meant to be used by real users with real records and not meant for reuse.

## Features

- **Management:**
  - View a comprehensive list of records in a paginated table format.
  - Add/edit/delete records with standard and custom fields.
  - Detailed view of individual records, including custom attributes.

- **Custom Fields Management:**
  - Dynamically create and manage custom fields to capture additional information.
  - Flexible handling of various field types (e.g., string, number, boolean, date).

- **Global Notifications:**
  - Real-time feedback using a global notification system for actions like login, logout, data submission, and error handling.

- **User Authentication:**
  - Email/Password registration and login support via firebase
  - Protected routes to prevent unauthenticated access
  - User-friendly login and registration forms with validation and feedback

## Technologies Used

- **Frontend:**
  - [React](https://reactjs.org/) with TypeScript
  - [Vite](https://vitejs.dev/) for fast development and build
  - [React Router](https://reactrouter.com/) for client-side routing
  - [Material-UI](https://mui.com/) for UI components and styling
  - [React Hook Form](https://react-hook-form.com/) for form management and validation

- **Backend & Services:**
  - [Firebase](https://firebase.google.com/) for authentication and Firestore database

## Setup

### 1. **Clone the Repository and install dependencies**

```bash
git clone https://github.com/rroque98/management-dashboard-demo.git
cd management-dashboard-demo
npm install
```

### 2. **Configure your firebase firestore and auth**
Create a Firebase Project, set up Firestore, and enable Authentication via Email/Password in the Firebase Console. Refer to the Firebase docs to learn about secruity considerations and how to configure appropriate security rules.

Use the `.env.example` template to create a `.env` file in the root directory and add your Firebase configuration.

### 3. **Run the App**

```bash
npm run dev
```

For local testing, navigate to `http://localhost:5173/`

### 4. **Authentication**

#### Register a New User

1. **Navigate** to the **Register** page.
2. Fill out the registration form with a valid email and password.
3. Upon successful registration, you'll be redirected to the main dashboard view.

#### Login

If you already have an account, **Enter** your registered email and password to access the dashboard and management functionality.

#### Logout

**Click** the **Logout** button in the header to sign out of the dashboard.
