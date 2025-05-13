# 🌟 Moviebuff Audio APP – Powered by Strapi

A custom CMS backend built using Strapi to manage theater listings, content, and dashboards with extended plugin support and APIs.

## 🚀 Project Overview

This project leverages Strapi to serve as a headless CMS with custom API extensions and plugins designed for:

- Theater search integrated with QUBE WIRE API
- Custom admin dashboard for content and reporting
- Optimized APIs for frontend integration

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
APP_KEYS=<APP_KEYS>
API_TOKEN_SALT=<API_TOKEN_SALT>
ADMIN_JWT_SECRET=<ADMIN_JWT_SECRET>
TRANSFER_TOKEN_SALT=<TRANSFER_TOKEN_SALT>
DATABASE_CLIENT=postgres
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=<PASSWORD>
DATABASE_NAME=qa-q
DATABASE_PORT=5432
DATABASE_HOST=<HOST>
DATABASE_SSL=false
JWT_SECRET=<JWT_SECRET>
STRAPI_API_TOKEN=<your-strapi-api-token>
STRAPI_API_URL=http://qa-moviebuff-audio.moviebuff.com
```

> **Note:** Replace `<PASSWORD>`, `<HOST>`, `<your-strapi-api-token>`, `<APP_KEYS>`, `<API_TOKEN_SALT>`, `<ADMIN_JWT_SECRET>`, `<TRANSFER_TOKEN_SALT>`, `<JWT_SECRET>`, and `<your-strapi-api-token>` with actual values.

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

- **All APIs require a JWT token** unless specified as public.
  
- **API keys** can be created in the admin panel.

### Authenticated Example

```http
Authorization: Bearer <jwt-token>
```

### Endpoints

**External APIs**:

- `https://dimensions.qubewire.com/v1/facilities/search?q=pvr&ps=150&offset=`

**Custom APIs**: 

Path: `src/api/custom-list/routes/custom-list.js`

- `POST /api/device-sessions` - Post device session details
- `PUT /api/device-sessions/277` - Update device session details
- `GET /api/custom-list?location=12.980165450000001,80.22285056225584,10000000&search=LUXE` - Master theater list API. it returns the list of theaters based on the location and radius.
- `GET https://moviebuff-audio.moviebuff.com/api/custom-list-csv` - Get theater list in CSV format
- `GET https://moviebuff-audio.moviebuff.com/api/device-session-list-csv` - Get device session list in CSV format
- `POST /api/logs` - Post logs through email

## ✅ Essential Notes

- **Base URL for admin**: `https://moviebuff-audio.moviebuff.com/admin`
  
- **If any changes are made in API files**:
  1. **Stop the PM2 process**.
  2. **Run the app in dev mode**:
     ```bash
     yarn develop
     # or
     npm run develop
     ```
  3. **Rebuild and restart using PM2**:
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

