# Parking Management System

A full-stack parking management application for managing parking slots, vehicle parking and exits, parking fees, and parking history.

## Features

### Dashboard

* View total parking slots
* View available and occupied slots
* View current parking occupancy
* View recent parking activity
* View total revenue generated from completed parking sessions
* Quickly access common parking operations

### Parking Slot Management

* View all parking slots
* Create new parking slots
* Edit existing parking slots
* Delete parking slots
* Identify whether a slot is currently available or occupied

The occupied state is determined from active vehicle entries rather than being stored separately inside each parking slot.

### Vehicle Management

* Park a vehicle in an available slot
* Support different vehicle types
* Record vehicle details when entering
* Select an available parking slot
* Exit a currently parked vehicle
* Calculate the parking fee when a vehicle exits

### Parking History

* View completed parking sessions
* View vehicle and slot information
* View entry and exit details
* View parking fees
* Track previously completed parking operations

---

## Application Flow

The main workflow of the application is:

```text
Create Parking Slot
        ↓
View Available Slots
        ↓
Park Vehicle
        ↓
Vehicle Remains Parked
        ↓
Exit Vehicle
        ↓
Calculate Parking Fee
        ↓
Store Parking History
```

### Parking a Vehicle

```text
User selects "Park Vehicle"
            ↓
Frontend displays parking dialog
            ↓
User enters vehicle details
            ↓
Frontend requests available slots
            ↓
User selects an available slot
            ↓
Frontend sends vehicle entry request
            ↓
Backend validates and processes request
            ↓
Vehicle entry is stored
            ↓
Slot is considered occupied
            ↓
Frontend updates the displayed data
```

### Exiting a Vehicle

```text
User selects a parked vehicle
            ↓
Frontend opens exit dialog
            ↓
Exit request is sent to backend
            ↓
Backend calculates parking duration
            ↓
Parking fee is calculated
            ↓
Vehicle entry is completed
            ↓
Slot becomes available again
            ↓
Completed record appears in history
```

---

## Architecture

The project follows a simple separation between the frontend, backend, and data persistence layers.

```text
┌──────────────────────────┐
│        Frontend          │
│    React + TypeScript    │
└────────────┬─────────────┘
             │
             │ HTTP / REST API
             ↓
┌──────────────────────────┐
│         Backend          │
│         NestJS           │
│                          │
│ Controllers → Services   │
└────────────┬─────────────┘
             │
             ↓
┌──────────────────────────┐
│   JSON File Persistence  │
│         db.json          │
└──────────────────────────┘
```

### Frontend

The frontend is responsible for:

* Displaying the user interface
* Handling user interaction
* Managing component and page state
* Collecting user input
* Sending requests to the backend
* Displaying API responses
* Showing parking and exit dialogs
* Displaying parking statistics and history

The frontend is organized into pages, reusable components, and a separate API layer.

### Backend

The backend is responsible for:

* Exposing REST APIs
* Managing parking slots
* Managing vehicle entries
* Handling vehicle exits
* Applying parking business logic
* Calculating parking fees
* Persisting application data
* Returning appropriate responses to the frontend

---

## Project Structure

```text
parking-management/
│
├── backend/
│   ├── src/
│   ├── db.json
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.ts
│   │   │   ├── slots.api.ts
│   │   │   └── vehicle-entries.api.ts
│   │   │
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   │   ├── Statistics.tsx
│   │   │   │   ├── Occupancy.tsx
│   │   │   │   └── RecentActivity.tsx
│   │   │   │
│   │   │   ├── slots/
│   │   │   │   ├── CreateSlotDialog.tsx
│   │   │   │   └── EditSlotDialog.tsx
│   │   │   │
│   │   │   └── vehicles/
│   │   │       ├── ParkVehicleDialog.tsx
│   │   │       └── ExitVehicleDialog.tsx
│   │   │
│   │   └── pages/
│   │       ├── Dashboard.tsx
│   │       ├── Slots.tsx
│   │       └── History.tsx
│   │
│   └── ...
│
└── README.md
```

---

## Frontend API Layer

API communication is separated from the UI components.

```text
frontend/src/api/
├── axios.ts
├── slots.api.ts
└── vehicle-entries.api.ts
```

The Axios configuration provides a common HTTP client, while the resource-specific API files contain functions for communicating with the corresponding backend endpoints.

This keeps HTTP request logic separate from UI components and makes the frontend code easier to organize.

---

## Core Entities

### Parking Slot

A parking slot represents a location where a vehicle can be parked.

A slot contains information such as:

* Slot ID
* Slot number
* Slot-related information

The project does not store a separate `occupied` property inside the slot.

Instead, occupancy is determined from active vehicle entries associated with the slot.

This avoids maintaining the same state in multiple places.

### Vehicle Entry

A vehicle entry represents a parking session.

It contains information required to track:

* Vehicle details
* Vehicle type
* Assigned parking slot
* Entry time
* Exit time
* Parking fee
* Whether the parking session is active or completed

An active vehicle entry represents a currently parked vehicle. Once the vehicle exits, the entry becomes part of the completed parking history.

---

## Parking Fee

When a vehicle exits, the backend calculates the parking duration and determines the parking fee according to the application's parking fee logic.

The calculation is performed on the backend so that the business rule remains centralized instead of being duplicated in the frontend.

The frontend receives the result and displays the calculated fee to the user.

---

## Data Persistence

The project uses a JSON file for file-based persistence:

```text
backend/db.json
```

This keeps the project simple while demonstrating how the backend can persist application data without introducing a separate database server.

The file stores the application's parking data and is updated when parking operations are performed.

---

## Design Decisions

### Separation of Frontend and Backend

The frontend is responsible for presentation and user interaction, while the backend handles business logic and persistence.

This separation keeps responsibilities clear and makes the application easier to maintain.

### Separate API Layer

HTTP requests are grouped into resource-specific API files instead of being written directly inside UI components.

For example:

```text
slots.api.ts
vehicle-entries.api.ts
```

This creates a clear boundary between the UI and backend communication.

### Occupancy Derived From Active Vehicle Entries

The project does not maintain a separate `occupied` field inside each slot.

A slot is considered occupied when an active vehicle entry is associated with it.

This reduces the possibility of inconsistent state between slot information and vehicle records.

### Reusable Components

The frontend uses reusable components for specific responsibilities, including:

* Dashboard statistics
* Occupancy display
* Recent activity
* Slot creation
* Slot editing
* Vehicle parking
* Vehicle exit

This keeps pages focused on coordinating the UI instead of containing all functionality themselves.

---

## Technology Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Axios
* Lucide React

### Backend

* NestJS
* TypeScript
* JSON file persistence

---

## Getting Started

### Prerequisites

Make sure the following are installed:

* Node.js
* npm

### Clone the Repository

```bash
git clone https://github.com/adityakaswankar-npst/parking-management.git
cd parking-management
```

### Start the Backend

```bash
cd backend
npm install
npm run start:dev
```

### Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite will display the local development URL in the terminal.

---

## Development Flow

The application follows this general flow:

```text
User Interaction
       ↓
React Component
       ↓
Frontend API Layer
       ↓
HTTP Request
       ↓
Backend Controller
       ↓
Backend Service / Business Logic
       ↓
JSON Persistence
       ↓
HTTP Response
       ↓
Frontend
       ↓
Updated UI
```

This structure allows the frontend to focus on user interaction while the backend remains responsible for the application's core parking operations.

---

## Project Goals

This project was built to practice and demonstrate:

* Full-stack application development
* React component architecture
* TypeScript
* REST API communication
* Frontend and backend separation
* CRUD operations
* Backend business logic
* File-based persistence
* Parking slot management
* Vehicle entry and exit workflows
* Parking fee calculation
* Frontend-backend integration

---

## Future Improvements

Possible improvements for a more production-oriented version include:

* Replacing JSON persistence with a proper database
* Adding authentication and authorization
* Adding automated tests
* Adding more detailed reporting
* Improving concurrency and data consistency
* Adding production deployment configuration

---

## Author

**Aditya Kaswankar**

GitHub: https://github.com/adityakaswankar-npst
