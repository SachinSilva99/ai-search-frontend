# 🛒 AI-Powered Semantic Product Search — Frontend

> Angular 17+ single-page application serving as the customer and admin portal for an AI-powered e-commerce platform with natural language product search.

---

## 🚀 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **Angular** | 17.3 | Frontend framework (standalone components) |
| **TypeScript** | 5.4 | Type-safe development |
| **Bootstrap** | 5.3 | Responsive UI styling |
| **Bootstrap Icons** | 1.13 | Icon library |
| **RxJS** | 7.8 | Reactive programming & HTTP handling |
| **Angular Router** | 17.3 | Client-side routing with lazy loading |

---

## ✨ Features

### Customer Portal
- 🔍 **AI Semantic Search** — Natural language product search with confidence scores
- 🏠 **Home Page** — Hero section with prominent search bar
- 📦 **Product Catalog** — Browse products with category filtering and pagination
- 📄 **Product Detail** — Individual product page with full description
- 🛒 **Shopping Cart** — Add, update quantity, remove items
- 💳 **Checkout** — Place orders with shipping address and payment method
- 📋 **Order History** — View past orders with status tracking
- 📝 **Order Detail** — Detailed order breakdown with line items
- 👤 **User Profile** — View and update personal information
- 🔐 **Authentication** — Login and registration with reactive forms

### Admin Portal
- 📊 **Dashboard** — Sales analytics, revenue charts, recent orders summary
- 📦 **Product Management** — Full CRUD operations for products
- 🏷️ **Category Management** — Create, update, and delete product categories
- 📋 **Order Management** — Update order statuses (PENDING → CONFIRMED → SHIPPED → DELIVERED)
- 👥 **User Management** — View user list and promote users to admin role

### Technical Features
- 🛡️ **Route Guards** — `authGuard` for authenticated routes, `adminGuard` for admin-only routes
- 🔑 **JWT Interceptor** — Automatically attaches Bearer token to all API requests
- ⚠️ **Error Interceptor** — Global HTTP error handling with user-friendly toast notifications
- 🌙 **Theme Service** — Dark/light mode toggle
- 📱 **Responsive Design** — Mobile-friendly layout using Bootstrap grid system
- ⚡ **Lazy Loading** — Route-level code splitting for optimised bundle size

---

## 📁 Project Structure

```
src/app/
├── components/              # Shared/reusable components
│   ├── navbar/              # Navigation bar (customer & admin)
│   └── footer/              # Footer component
├── layouts/                 # Layout wrappers
│   ├── customer-layout/     # Customer portal shell
│   └── admin-layout/        # Admin portal shell with sidebar
├── pages/                   # Route-level page components
│   ├── home/                # Landing page with AI search
│   ├── product-list/        # Product catalog with filters
│   ├── product-detail/      # Single product view
│   ├── search-results/      # AI search results display
│   ├── cart/                # Shopping cart
│   ├── checkout/            # Checkout form (reactive)
│   ├── order-history/       # Customer's orders
│   ├── order-detail/        # Order breakdown
│   ├── profile/             # User profile (reactive forms)
│   ├── login/               # Login (reactive forms)
│   ├── register/            # Registration (reactive forms)
│   ├── not-found/           # 404 page
│   └── admin/               # Admin sub-pages
│       ├── dashboard/       # Analytics dashboard
│       ├── products/        # Product CRUD
│       ├── categories/      # Category CRUD
│       ├── orders/          # Order management
│       └── users/           # User management
├── guards/                  # Route guards
│   ├── auth.guard.ts        # Checks JWT token exists
│   └── admin.guard.ts       # Checks user role === ADMIN
├── interceptors/            # HTTP interceptors
│   ├── auth.interceptor.ts  # Injects Authorization header
│   └── error.interceptor.ts # Catches HTTP errors globally
├── models/
│   └── models.ts            # TypeScript interfaces & DTOs
├── services/                # Injectable API services
│   ├── auth.service.ts      # Login, register, logout
│   ├── product.service.ts   # Product catalog API
│   ├── search.service.ts    # AI search API
│   ├── cart.service.ts      # Cart CRUD API
│   ├── order.service.ts     # Order placement & history
│   ├── user.service.ts      # Profile management API
│   ├── admin.service.ts     # Admin panel API
│   ├── toast.service.ts     # Toast notification service
│   └── theme.service.ts     # Dark/light theme toggle
├── app.component.ts         # Root component
├── app.config.ts            # Providers (HTTP, router, interceptors)
└── app.routes.ts            # Route definitions (lazy-loaded)
```

---

## ⚙️ Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Angular CLI** 17.x (`npm install -g @angular/cli`)

---

## 🏁 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/ai-search-frontend.git
cd ai-search-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure proxy (development)
The `proxy.conf.json` routes API calls to the Spring Boot backend:
```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false
  }
}
```

### 4. Start the development server
```bash
ng serve
```
Navigate to `http://localhost:4200/`. The application will automatically reload on file changes.

### 5. Build for production
```bash
ng build --configuration production
```
Build artefacts will be stored in the `dist/` directory.

---

## 🔗 API Integration

The frontend communicates with two backend services:

| Service | URL | Purpose |
|---|---|---|
| **Spring Boot Backend** | `http://localhost:8080/api/*` | REST API (auth, products, cart, orders, admin) |
| **Flask AI Service** | Proxied via Spring Boot | AI semantic search (transparent to frontend) |

> **Note:** The frontend never calls the Flask service directly. All AI search requests go through the Spring Boot backend's `/api/search` endpoint, which internally forwards them to Flask via `WebClient`.

---

## 🔐 Authentication Flow

1. User logs in via `/login` → receives JWT token
2. Token stored in `localStorage`
3. `AuthInterceptor` attaches `Authorization: Bearer <token>` to every request
4. `authGuard` checks token existence for protected routes
5. `adminGuard` additionally checks `user.role === 'ADMIN'` for admin routes
6. `ErrorInterceptor` catches `401 Unauthorized` and redirects to login

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start dev server at `http://localhost:4200` |
| `npm run build` | Build production bundle |
| `npm run watch` | Build with live reload (development) |
| `npm test` | Run unit tests via Karma |

---

## 📄 License

This project is part of a BSc Final Year Project at ICBT Campus.
