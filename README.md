# 💳 PayTrackr

**PayTrackr** is a smart shop management and due tracking system designed to help small businesses efficiently manage customer dues, payments, and stitching records in one place.

---

## 🚀 Features

* 📒 Manage customer dues and payments
* 🧾 Track billing details (Name, Item, Bill No, Phone, Remarks)
* 📊 Weekly/Monthly reports generation
* 📥 Export pending dues as Excel files
* ✂️ Stitching record management with delivery tracking
* 🔔 Reminder system for pending payments
* ☁️ Cloudinary integration for file/image uploads
* 🔐 Secure access using passcode (.env-based entry system)

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

### Services

* Cloudinary (media storage)
* ExcelJS (report generation)

---

## 📁 Project Structure

```
PayTrackr/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── db.js
│   └── server.js
│
├── frontend/
│   ├── src/
│   └── public/
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Paytrackr.git
cd Paytrackr
```

---

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
PASSCODE=your_secret_passcode

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run backend:

```bash
npm run dev
```

---

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Authentication

This project uses a **passcode-based entry system** instead of traditional login/signup.
Only users with the correct passcode (stored in `.env`) can access the application.

---

## 📊 Reports

* Generate weekly/monthly reports
* Download pending dues as Excel files
* Track customer payment history easily

---

## 🌐 Deployment

You can deploy:

* Frontend → Vercel / Netlify
* Backend → Render / Railway

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork this repo and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Shivam Singh Rathore**
Passionate Full Stack Developer 🚀

---
