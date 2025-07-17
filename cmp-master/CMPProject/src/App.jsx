import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WorkerForm from './components/WorkerForm';
import WorkerCards from './pages/WorkerCards';
import DashboardHome from './pages/DashboardHome';
import ReportPage from './pages/ReportPage';
import EditWorker from "./pages/EditWorker";

function App() {
  return (
    <Router>
      <>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/add" element={<WorkerForm />} />
        <Route path="/view" element={<WorkerCards />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/edit-worker/:id" element={<EditWorker />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
      </>
    </Router>
  );
}

export default App;
