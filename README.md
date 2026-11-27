# BASH CRM – Free CRM with Firestore & Vercel

## Overview
BASH CRM is a tiny, free‑tier CRM that lets you:
- Accept orders via a public HTML form.
- Store orders in **Firestore** (1 GiB free quota).
- Log in as an admin to view and update order status (`unconfirmed → confirmed → in_process → delivered`).
- Let each sales rep create their own custom order‑capture form and embed it on a sales page.
- Use a tiny **Vercel Serverless function** to safely update order status.
- Host the public form on **Firebase Hosting** (free) and the admin dashboard on **Vercel** (free functions).

## Directory layout (inside your workspace)
```
BASH_CRM/
├─ firebase.json
├─ .firebaserc
├─ firestore.rules
├─ README.md          ← you are reading this
├─ public/
│   └─ order-form.html   # embed on your sales page
├─ admin/               # Next.js admin UI (run on Vercel)
│   ├─ pages/
│   │   ├─ index.js      # dashboard – list orders
│   │   └─ login.js      # simple Firebase Auth login
│   ├─ lib/
│   │   └─ firebaseAdmin.js
│   └─ package.json
└─ api/
    └─ update-status.js   # Vercel serverless function
```

## One‑time setup steps
1. **Create a Firebase project** (free tier) – e.g. `bash-crm-demo`.
2. Enable **Firestore** (in Native mode) and **Hosting**.
3. Add a **Web app** in the Firebase console to get the config snippet (apiKey, projectId, …).  You’ll paste it into `public/order-form.html` and the admin UI.
4. Enable **Firebase Authentication** (Email/Password) and create an admin user.
   - After creating the user, set a custom claim `admin:true` via the Firebase CLI or a one‑off Cloud Function (see README notes).
5. Install the Firebase CLI locally:
   ```
   npm i -g firebase-tools
   firebase login
   firebase use --add   # select the project you created
   ```
6. Deploy the public form:
   ```
   cd BASH_CRM
   firebase deploy --only hosting
   ```
7. Deploy the Vercel function and admin UI:
   ```
   cd BASH_CRM/admin
   npm install   # installs next, react, firebase-admin, etc.
   vercel login
   vercel   # follow prompts – choose "Create Project" and "link to existing"
   ```
   The Vercel deployment will automatically host `api/update-status.js` and the Next.js dashboard.

## How it works
- **Public form** (`public/order-form.html`) uses the Firebase JS SDK to write a new document to the `orders` collection. No auth required, only `create` permission is allowed by the Firestore rules.
- **Admin UI** uses the Firebase **Admin SDK** (server‑side) to list orders and call the Vercel function `api/update-status` to change the `status` field. Only users with the `admin` claim can access the dashboard.
- **Sales‑rep custom forms** – each logged‑in sales rep can copy the snippet from the dashboard, edit the fields (e.g., product ID, default quantity) and embed it on their own sales page. The form always writes to the same Firestore collection, so all orders are centralised.

## Optional extras (you can add later)
- Email notifications (`firebase extensions:install trigger-email`).
- Export orders to CSV (Cloud Function → Cloud Storage free bucket).
- Basic analytics dashboard (Chart.js).
- Rate‑limit the public endpoint (Firestore rules + optional reCAPTCHA).

---
**Ready to go** – the remaining files are already generated in the artifact folder. just copy the `BASH_CRM` folder into your workspace, run the commands above, and you’ll have a working CRM.
