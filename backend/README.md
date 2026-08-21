# Parking Management System

A full-stack parking management application for managing parking slots, vehicle parking and exits, parking fees, and vehicle history.

The project demonstrates how a frontend application communicates with a backend API to perform parking operations while keeping the business logic and data persistence on the backend.

## Features

### Dashboard

- View total parking slots
- View available and occupied slots
- View current parking occupancy
- View recent parking activity
- View total revenue generated from completed parking sessions
- Quickly access common parking operations

### Parking Slot Management

- View all parking slots
- Create new parking slots
- Edit existing parking slots
- Delete parking slots
- Identify whether a slot is currently available or occupied

The occupied state is determined from the active vehicle entries rather than being stored separately inside each slot.

### Vehicle Management

- Park a vehicle in an available slot
- Support for different vehicle types
- Record vehicle details when entering
- Select an available parking slot
- Exit a currently parked vehicle
- Calculate the parking fee when a vehicle exits

### Parking History

- View completed parking sessions
- View vehicle and slot information
- View entry and exit details
- View parking fees
- Track previously completed parking operations

## Application Flow

The main workflow of the application is:

```text
                    Parking Management System
                              |
              +---------------+---------------+
              |                               |
        Slot Management                 Vehicle Management
              |                               |
      Create / Edit / Delete          Park Vehicle / Exit Vehicle
              |                               |
              +---------------+---------------+
                              |
                       Parking Records
                              |
                    History & Dashboard
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
Slot is now considered occupied
            ↓
Frontend refreshes the relevant data
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

## Architecture

The project follows a simple layered structure:

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

- Displaying the user interface
- Managing page-level and component-level state
- Collecting user input
- Sending requests to the backend
- Displaying API results
- Showing dialogs for parking operations
- Presenting parking statistics and history

The frontend is organized into pages, reusable components, and a separate API layer.

### Backend

The backend is responsible for:

- Exposing REST APIs
- Handling parking operations
- Applying business rules
- Managing parking slots
- Managing vehicle entries
- Processing vehicle exits
- Calculating parking fees
- Persisting application data

Keeping the business logic on the backend prevents the frontend from becoming responsible for core parking rules.

## Project Structure

```text
parking-management/
│
├── backend/
│   ├── src/
│   │   ├── ...
│   │
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

## Frontend API Layer

API communication is kept separate from UI components.

For example:

```text
frontend/src/api/
├── axios.ts
├── slots.api.ts
└── vehicle-entries.api.ts
```

The Axios configuration provides a common HTTP client, while the resource-specific files contain functions for communicating with the corresponding backend APIs.

This keeps components focused on UI and user interaction instead of putting HTTP request logic directly inside every component.

## Core Entities

The application mainly works with two concepts:

### Parking Slot

A parking slot represents a location where a vehicle can be parked.

Typical information includes:

- Slot ID
- Slot number
- Slot-related metadata

The slot itself does not need to permanently store whether it is occupied.

Instead, occupancy can be determined from the currently active vehicle entries.

This avoids having two separate pieces of data that could become inconsistent, such as:

```text
Slot says: available
Vehicle entry says: vehicle is parked there
```

### Vehicle Entry

A vehicle entry represents a parking session.

It contains information required to track:

- Vehicle
- Vehicle type
- Assigned parking slot
- Entry time
- Exit time
- Parking fee
- Current/completed state

An active vehicle entry represents a currently parked vehicle, while a completed entry contributes to parking history.

## Parking Fee

When a vehicle exits, the backend determines the parking duration and calculates the corresponding parking fee.

The fee calculation is handled by the backend rather than the frontend so that the core business rule is centralized.

The frontend only displays the result returned by the backend.

## Data Persistence

The project uses a JSON file:

```text
backend/db.json
```

for file-based persistence.

This keeps the project simple and makes it possible to demonstrate backend data handling without introducing a separate database server.

The JSON file contains the application's persisted parking data and is modified as parking operations are performed.

## Design Decisions

### Separate Frontend and Backend Responsibilities

The frontend focuses on presentation and user interaction, while the backend handles business logic and persistence.

This makes the application easier to understand and maintain.

### Separate API Layer

Instead of making HTTP requests directly throughout the UI components, API functions are grouped by resource.

For example:

```text
slots.api.ts
vehicle-entries.api.ts
```

This provides a clear boundary between the UI and backend communication.

### Occupancy Derived From Active Entries

The project does not store a separate `occupied` property inside every parking slot.

Instead, a slot is considered occupied when there is an active vehicle entry associated with that slot.

This avoids maintaining the same state in multiple places.

### Reusable Components

The frontend uses reusable components for specific responsibilities, such as:

- Dashboard statistics
- Occupancy display
- Recent activity
- Slot creation
- Slot editing
- Vehicle parking
- Vehicle exit

This keeps page components from becoming unnecessarily large and makes individual pieces easier to modify.

## Technology Stack

### Frontend

- **React** — UI development
- **TypeScript** — Static typing
- **Vite** — Frontend development and build tooling
- **Tailwind CSS** — Styling
- **Axios** — HTTP communication
- **Lucide React** — Icons

### Backend

- **NestJS** — Backend framework
- **TypeScript** — Static typing
- **JSON file persistence** — Application data storage

## Getting Started

### Prerequisites

Make sure you have:

- Node.js
- npm

installed on your system.

### Clone the repository

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

The backend will start using the configured development port.

### Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite will provide the local development URL in the terminal.

## Development

The application can be developed by running the frontend and backend separately.

```text
Frontend
    ↓
HTTP requests
    ↓
Backend API
    ↓
Business logic
    ↓
db.json
```

Changes made through the application are persisted through the backend.

## Project Goals

This project was built to practice and demonstrate:

- Full-stack application development
- React component design
- TypeScript
- REST API communication
- Frontend and backend separation
- CRUD operations
- Backend business logic
- File-based persistence
- Parking slot management
- Vehicle entry and exit workflows
- Basic application architecture

## Future Improvements

Some possible improvements for a production-oriented version could include:

- Replacing JSON persistence with a relational or NoSQL database
- Adding authentication and authorization
- Adding automated tests
- Adding more advanced reporting
- Adding proper production deployment configuration
- Improving concurrency and data consistency for multiple users

## Author

**Aditya Kaswankar**

GitHub: https://github.com/adityakaswankar-npst/parking-management
