# ML Studio

A production-grade, full-stack machine learning web application built with FastAPI and React.

## 🚀 Features
- **Upload Datasets**: Automatically detect columns and types.
- **Train Models**: Support for Classification, Regression, and Clustering.
- **Advanced Algorithms**: Random Forest, SVM, Gradient Boosting, etc.
- **Visualizations**: Confusion Matrices, Feature Importance, Residual Plots.
- **Explanations**: Rule-based engine explaining model performance in plain English.
- **Experiment History**: Track and compare previous runs.

## 🛠 Tech Stack
- **Backend**: FastAPI, Scikit-learn, Pandas, SQLAlchemy, PostgreSQL
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Recharts
- **Database**: PostgreSQL (Production) / SQLite (Local)

## 📦 Installation & Local Setup

### Prerequisites
- **Python 3.9+**
- **Node.js 18+** (Required for frontend) - [Download Here](https://nodejs.org/)

### Backend
1. Navigate to backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the server:
   ```bash
   python -m uvicorn main:app --reload
   ```
   The API will be available at `http://localhost:8000`.

### Frontend
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The UI will be available at `http://localhost:5173`.

## ☁️ Deployment

### Backend (Railway)
1. Push the code to GitHub.
2. Link the repository to Railway.
3. Add a PostgreSQL database service in Railway.
4. Set the `DATABASE_URL` environment variable in the backend service.
5. Railway will automatically detect the `Procfile` and start the FastAPI app.

### Frontend (Vercel)
1. Push the code to GitHub.
2. Link the repository to Vercel.
3. Configure the `VITE_API_URL` environment variable to point to your Railway backend URL (e.g., `https://web-production.up.railway.app/api`).
4. Deploy.

## 🔒 Configuration
- Create a `.env` file in `backend/` for local development if needed, though defaults work for SQLite.
- Ensure `CORS` origins in `backend/main.py` include your production frontend URL.

## 📝 License
MIT