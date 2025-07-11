# Frontend - Task Management System

This is the frontend for the **Task Management System**, where users and admins can manage tasks, view their profile, and interact in real-time with Socket.io notifications.

## Features:
* **Login & Registration**: Users can log in and register to access their dashboards.
* **Task Management**: Users can view, create, update, and delete tasks. Admins can assign tasks to users.
* **Admin Features**:
   * Admins can view a list of all users.
   * Admins can create, view, and assign tasks to users.
   * Admins can delete and update user profiles.
* **Real-Time Notifications**: When tasks are assigned, users receive real-time alerts using **Socket.io** and **React Hot Toast**.

## Prerequisites:
* **Node.js** (v16 or higher)
* **React.js** (v18)
* **React Query** for data fetching
* **Socket.io-client** for real-time communication
* **React Hot Toast** for notifications

## Installation:
1. Clone the repository:

```bash
git clone https://github.com/StreetGUY32/ExactTestFrontEnd.git
cd ExactTestFrontEnd
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`.

## Features Walkthrough:
1. **Login & Registration**
* Login form includes email and password.
* Registration allows new users to sign up with email, name, and password.

2. **Dashboard**
* **Admin Users**: Admins can view all users, assign tasks to them, and view/edit their profiles.
* **Task Management**: Users and admins can manage tasks from the dashboard.

3. **Real-Time Notifications**
* Socket.io connection established with the backend.
* **React Hot Toast** is used to show notifications when a task is assigned.

4. **Task Assignment**
* Admin assigns tasks to users using a dropdown that lists all available users.
* Notifications are sent in real-time when tasks are assigned.

## Technologies Used:
* **React** (for building the UI)
* **React Query** (for handling API calls)
* **Socket.io-client** (for real-time updates)
* **React Hot Toast** (for showing toast notifications)
* **Axios** (for API requests)
