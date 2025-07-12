# Expense Tracker

A modern expense tracking app build with **React**, **PrimeReact**, **Axios**, and **MongoDB**, allowing users to add, view, edit, and delete their monthly expenses with beautiful UI componenets and smooth transition

## Features

- Add, edit, and delete expenses
- Filter expenses by month and year
- View total, average per day, and number of expenses
- User authentication with JWT
- Clean, responsive UI using PrimeReact and TailwindCSS

## Tech Stack

**Client:** React + Vite, PrimeReact, TailwindCSS

**Server:** Node, Express, JWT Auth, Axios

**Database:** MongoDB Atlas, Mongoose

## Getting Started

**Prerequisites**

- [Node.js](https://nodejs.org/en/) (v16+ recommended)
- [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database)
- [Git](https://git-scm.com/)

## Setup Instructions

1. Clone the Repository

```
git clone https://github.com/Korbin-Hillan/expense-tracker
cd expense-tracker
```

2. install Dependencies
   **Frontend**

```
cd expense-tracker
npm install
```

**Backend**

```
cd expense-tracker-backend
npm install
```

3. Configure Environment Variables
   Create a `.env` in **Backend**

```
DB_CONN_STRING=mongodb+srv://<your-user>:<your-pass>@cluster.mongodb.net/expenses
DB_NAME=expense-tracker
JWT_SECRET=your_jwt_secret
```

## Run the App

**Backend**

```
cd expense-tracker-backend
npm run dev
```

**Frontend**

```
cd expense-tracker
npm run dev
```

Then go to: http://localhost:5173

## Usage

Once up and running expense-tracker will:

1. Show your allow you to see all your expenses spent for the month. as well as your daily spend average.

## API Endpoints

| Method | Endpoint             | Description        |
| ------ | -------------------- | ------------------ |
| POST   | `/api/auth/register` | Register a user    |
| POST   | `/api/auth/login`    | Login a user       |
| GET    | `/api/expense`       | Fetch all expenses |
| POST   | `/api/expense`       | Add new expense    |
| PUT    | `/api/expense/:id`   | Edit an expense    |
| DELETE | `/api/expense/:id`   | Delete an expense  |

## Screenshots

![Dashboard](image.png)

## License

This project is licensed under the MIT License. See [LICENSE](https://choosealicense.com/licenses/mit/) for more information.
