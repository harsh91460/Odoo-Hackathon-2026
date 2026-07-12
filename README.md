# TransitOps: Smart Transport Operations Platform

TransitOps is a modern, comprehensive, and premium web application designed to streamline transit and logistics management. It supports end-to-end operational workflows including vehicle tracking, driver profiles, real-time trip dispatching, maintenance log schedules, fuel and expense monitoring, and rich reports/analytics.

The system comes with a built-in **Role-Based Access Control (RBAC) Simulator**, allowing administrators to instantly switch perspectives and test granular safety and operational permissions.

---

## 🚀 Key Features

*   📊 **Operational Dashboard**: Real-time KPI summaries, active fleet indicators, trip completions, and system health metrics.
*   🚛 **Vehicle Registry**: Complete lifecycle tracking of fleet vehicles, including status, model, fuel type, capacity, and active assignments.
*   👤 **Driver Management**: Manage driver credentials, phone numbers, license states, active/inactive statuses, and safety thresholds.
*   🗺️ **Trip Dispatcher**: Assign drivers and vehicles, schedule start points and destinations, track statuses (Pending, Dispatched, Completed, Cancelled), and log overall distances.
*   🔧 **Maintenance Workflow**: Schedule vehicle servicing, log breakdown issues, track active maintenance orders, and log total repair costs.
*   ⛽ **Fuel & Expense Tracking**: Log fuel receipts, track efficiency, and record general expenses (tolls, driver allowances, food, repairs).
*   📈 **Reports & Analytics**: Multi-dimensional breakdown of operational costs, efficiency metrics, and financial performance.
*   🔐 **RBAC Controller & Configuration**: A simulated RBAC engine to toggle between roles in real-time, plus configurable parameters like safety thresholds, cost-per-km metrics, and warnings.

---

## 🛠️ Technology Stack

### Backend
*   **Core Framework**: Node.js & Express.js
*   **Database**: MongoDB with Mongoose ODM
*   **Authentication**: JSON Web Tokens (JWT) & bcryptjs password hashing
*   **Security & Utils**: CORS, dotenv, Nodemon (development)

### Frontend
*   **Core Library**: React (v19)
*   **Build Tool**: Vite
*   **Styling**: TailwindCSS (v4)
*   **Routing**: React Router DOM (v6)
*   **Icons**: Lucide React
*   **HTTP Client**: Axios
*   **Linter**: Oxlint (fast JavaScript/React linter)

---

## 📁 Directory Structure

```text
Odoo-Hackathon-2026/
├── Backend/
│   ├── config/             # DB configurations
│   ├── controllers/        # Express route handlers
│   ├── middleware/         # JWT protection & authorization
│   ├── models/             # Mongoose schemas (User, Vehicle, Driver, Trip, etc.)
│   ├── routes/             # API routing endpoints
│   ├── services/           # Helper backend services
│   ├── server.js           # Server entrypoint
│   └── .env.sample         # Sample environment configurations
│
├── Frontend/
│   ├── public/             # Static public assets
│   ├── src/
│   │   ├── components/     # UI components (Vehicles, Trips, Drivers, RBAC, etc.)
│   │   ├── context/        # React context (Auth & Data contexts)
│   │   ├── pages/          # App pages (Dashboard, Login, Register)
│   │   ├── services/       # Axios API service instances
│   │   ├── App.jsx         # Root app layout & routing
│   │   └── main.jsx        # Client entrypoint
│   └── vite.config.js      # Vite compilation configs
│
└── README.md               # Project documentation (this file)
```

---

## 🔒 Role-Based Access Control (RBAC)

The application enforces strict access permissions for different operational profiles. You can test these constraints in real-time using the **Role Simulator** under the **Settings & RBAC** tab in the UI.

| Module | Fleet Manager | Driver | Safety Officer | Financial Analyst |
| :--- | :--- | :--- | :--- | :--- |
| **Dashboard KPIs** | Full Access | Read Only | Read Only | Read Only |
| **Vehicle Registry** | Full Access | Read Only | No Access | No Access |
| **Driver Profiles** | Full Access | No Access | Full Access | No Access |
| **Trip Dispatcher** | Full Access | Full Access | No Access | No Access |
| **Maintenance Log** | Full Access | No Access | No Access | No Access |
| **Fuel & Expenses** | Full Access | No Access | No Access | Full Access |
| **Reports & Analytics** | Full Access | No Access | No Access | Full Access |

---

## ⚙️ Getting Started

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18 or higher recommended)
*   [MongoDB](https://www.mongodb.com/) (Local server or MongoDB Atlas URI)

---

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables. Duplicate the sample env file:
   ```bash
   cp .env.sample .env
   ```
   Fill in the variables in your `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=30d
   NODE_ENV=development
   ```

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend API will run on `http://localhost:5000`.

---

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd Frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend application will start on `http://localhost:5173` (or the next available port).

---

## 🔌 API Endpoints Reference

### Authentication Endpoints
*   `POST /api/auth/register` - Create a new user account with selected role.
*   `POST /api/auth/login` - Authenticate user and receive JWT.
*   `GET /api/auth/me` - Fetch authenticated user details (requires JWT).
*   `GET /api/auth/roles` - Get available roles list.

### Fleet & Operations Endpoints (all require JWT header: `Authorization: Bearer <token>`)
*   `GET/POST /api/data/vehicles` - List or create fleet vehicles.
*   `PUT/DELETE /api/data/vehicles/:id` - Update or delete a vehicle.
*   `GET/POST /api/data/drivers` - List or create driver profiles.
*   `PUT/DELETE /api/data/drivers/:id` - Update or delete a driver profile.
*   `GET/POST /api/data/trips` - List or create dispatch trips.
*   `PUT /api/data/trips/dispatch/:id` - Change trip status to Dispatched.
*   `PUT /api/data/trips/complete/:id` - Change trip status to Completed.
*   `PUT /api/data/trips/cancel/:id` - Cancel trip.
*   `DELETE /api/data/trips/:id` - Delete a trip.
*   `GET/POST /api/data/maintenance` - List or create vehicle maintenance logs.
*   `PUT /api/data/maintenance/close/:id` - Close maintenance issues.
*   `GET/POST /api/data/fuel-logs` - List or log fuel transactions.
*   `GET/POST /api/data/expenses` - List or create general operational expenses.

---

## 📝 License
This project is developed for hackathon purposes and is licensed under the MIT License.
