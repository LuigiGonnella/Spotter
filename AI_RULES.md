# AI Development Rules for Spotter App

This document outlines the core technologies and specific library usage guidelines for developing the Spotter application. Adhering to these rules ensures consistency, maintainability, and optimal performance across the project.

## 🚀 Tech Stack Overview

*   **Backend**: Node.js with Express.js for building robust RESTful APIs.
*   **Database**: PostgreSQL, managed with Prisma ORM for type-safe database interactions.
*   **Authentication**: JWT (JSON Web Tokens) for secure, role-based authentication, utilizing `argon2` for password and token hashing.
*   **Caching/Sessions**: Redis for efficient session management and rate limiting.
*   **Real-time Communication**: Socket.io for enabling real-time features like chat and notifications.
*   **Frontend**: React for building dynamic and interactive user interfaces. The long-term vision includes Next.js for server-side rendering and enhanced performance.
*   **Styling**: Tailwind CSS for utility-first, responsive, and highly customizable styling.
*   **UI Components**: shadcn/ui for pre-built, accessible, and customizable UI components.
*   **Icons**: Lucide React for a comprehensive set of SVG icons.
*   **State Management (Frontend)**: React Context API or Zustand for managing application state.
*   **Routing (Frontend)**: React Router for client-side navigation.

## 📚 Library Usage Rules

*   **Backend Framework**: Always use **Express.js** for server-side logic and API endpoints.
*   **Database ORM**: **Prisma** is the sole ORM for all PostgreSQL database operations.
*   **Hashing**: Use **`argon2`** for all password and token hashing operations (as seen in `backend/utils/hash.mjs`).
*   **Logging**: Use **`pino`** for server-side logging, configured with `pino-pretty` for development readability.
*   **Environment Variables**: Manage environment variables using **`dotenv`**.
*   **HTTP Utilities (Backend)**: Use **`express`**, **`cookie-parser`**, **`cors`**, and **`express-validator`** for handling HTTP requests, cookies, CORS policies, and input validation respectively.
*   **Frontend Framework**: Develop all UI components and pages using **React**.
*   **Styling**: All styling must be implemented using **Tailwind CSS** classes. Avoid custom CSS files unless absolutely necessary for very specific, non-Tailwindable styles.
*   **UI Components**: Prioritize using components from **shadcn/ui**. If a specific component is not available or needs significant customization, create a new component following the project's component structure. Do not modify shadcn/ui source files directly.
*   **Icons**: Use icons from **`lucide-react`**.
*   **State Management (Frontend)**: For global or shared state, prefer **React Context API** or **Zustand**.
*   **Routing (Frontend)**: Implement client-side routing using **React Router**.
*   **Real-time**: Use **Socket.io** for both backend and frontend real-time communication.