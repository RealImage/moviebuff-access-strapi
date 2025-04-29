# 🌟 Moviebuff Audio APP – Powered by Strapi

A custom CMS backend built using Strapi to manage theater listings, content, and dashboards with extended plugin support and APIs.

## 🚀 Project Overview

This project leverages Strapi to serve as a headless CMS with custom API extensions and plugins designed for:

- Theater search integrated with QUBE WIRE API
- Custom admin dashboard for content and reporting
- Optimized APIs for frontend integration

## 📅 Table of Contents

- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Available Commands](#available-commands)
- [Custom APIs](#custom-apis)
- [Plugins](#plugins)
- [Deployment](#deployment)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [Essential Notes](#essential-notes)

## ⚖️ Tech Stack

- **Strapi v4** – Headless CMS
- **Node.js 14+** – Runtime
- **PostgreSQL** – Database (configurable)
- **Yarn/NPM** – Package manager

## ⚙️ Setup Instructions

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/ravikumar28/moviebuff-audio-backend.git
   cd moviebuff-audio-backend
   ```

2. **Install Dependencies**:

   ```bash
   yarn install
   # or
   npm install
   ```

3. **Run the Project**:

   ```bash
   yarn develop
   # or
   npm run develop
   ```

4. **Access Admin Panel**:
   Open `http://localhost:1337/admin` or `https://moviebuff-audio.moviebuff.com/admin` and create your admin user.

## 🛠️ Environment Variables

Create a `.env` file with the following:

```
HOST=0.0.0.0
PORT=1337
APP_KEYS=S5gUQN14dXw8xQSHtJ25vw==,IaQw57FqPA2cqwYYXzX1mg==,n674R4ips4QL7X7FhWlnkQ==,6hUuWDjgZts120F7r8FE/Q==
API_TOKEN_SALT=KYtTyKGfvKRBWlP4jY5tlA==
ADMIN_JWT_SECRET=3NFKaNLVjJ4siB3kT6nWww==
TRANSFER_TOKEN_SALT=HSVo7Y2Ng1ljmyYMEhQkaQ==
DATABASE_CLIENT=postgres
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=<PASSWORD>
DATABASE_NAME=qa-q
DATABASE_PORT=5432
DATABASE_HOST=<HOST>
DATABASE_SSL=false
JWT_SECRET=N9BROp2FrB+r2e3j41r/gg==
STRAPI_API_TOKEN=<your-strapi-api-token>
STRAPI_API_URL=http://qa-moviebuff-audio.moviebuff.com
```

> **Note:** Replace `<PASSWORD>`, `<HOST>`, and `<your-strapi-api-token>` with actual values.

## 📋 Available Commands

- `yarn develop` – Start with hot-reload
- `yarn start` – Start in production mode
- `yarn build` – Build the admin panel for production

## 📃 Custom APIs

Custom API logic is implemented to allow:

- **Custom Theater List**:
  - Provides a list of theaters when users open the app.
  - Handles Closed Caption (CC) and Audio Description (AD) logic.
  - **Path**: `strapi/src/api/custom-list/controllers/custom-list.js`

### Endpoint Example

```http
GET /api/custom-list?location=12.980165450000001,80.22285056225584,10000000&search=LUXE
```

## 🔹 Plugins

### ✨ Theater Search Plugin

Custom search field in the Theater add page that integrates with the QUBE WIRE API:

```plaintext
https://dimensions.qubewire.com/v1/facilities/search?tag=address.city.name:{cityName}&ps=150&offset=0
```

- `cityName` is extracted from the query.
- MAIN LOGIC HERE: `strapi/src/plugins/theatre-search/admin/src/components/TheatreSearchField/index.js`

> Note: Uses **Location Field plugin** to fetch latitude/longitude. It occasionally causes issues, but is not a blocker.

### 📊 Custom Dashboard Plugin

Custom dashboard to download reports:

- List of theaters with screen counts
- Active device sessions summary
- ENV values are not working here, so the URL is hardcoded.
- MAIN LOGIC HERE: `strapi/src/plugins/custom-dashboard/admin/src/pages/HomePage/index.js`

## 🛠️ Deployment

This project can be deployed on:

- AWS Server (credentials in EMAIL)

See: [Strapi Deployment Docs](https://docs.strapi.io/dev-docs/deployment) – Add self-hosting guide here.

## 🔍 API Reference

All APIs require a JWT token unless specified as public.

### Authenticated Example

```http
Authorization: Bearer <jwt-token>
```

### Endpoints

**External APIs**:

- `https://dimensions.qubewire.com/v1/facilities/search?q=pvr&ps=150&offset=`

**Custom APIs**:

- `POST /api/device-sessions`
- `PUT /api/device-sessions/277`
- `GET /api/custom-list?location=12.980165450000001,80.22285056225584,10000000&search=LUXE`
- `GET https://moviebuff-audio.moviebuff.com/api/custom-list-csv`

## ✅ Essential Notes

- Base URL for admin: `https://moviebuff-audio.moviebuff.com/admin`
- If **any changes** are made in API files:
  1. Stop the PM2 process
  2. Run the app in dev mode (`yarn develop` or `npm run develop`) to check changes
  3. Then rebuild and restart using PM2:
     ```bash
     yarn build
     pm2 restart <process-name>
     ```

## 🤝 Contributing

This project is maintained by the Moviebuff team. External contributions are currently not accepted, as this is a proprietary internal CMS.

For internal improvements:
- Create a feature branch
- Commit and push your changes
- Create a PR within the private GitHub repository for review

---

Maintained by Moviebuff – Built with [Strapi](https://strapi.io)

