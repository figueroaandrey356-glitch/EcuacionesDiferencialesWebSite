import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import BrowseExams from './pages/BrowseExams';
import ExamPage from './pages/ExamPage';

// El panel de administración se descarga solo al entrar a /admin; ningún enlace del sitio lleva ahí
const AdminApp = lazy(() => import('./admin/AdminApp'));
function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exams" element={<BrowseExams />} />
        {/* /exam sin id no es un examen: lleva a la lista */}
        <Route path="/exam" element={<Navigate to="/exams" replace />} />
        <Route path="/exam/:examId" element={<ExamPage />} />
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={null}>
              <AdminApp />
            </Suspense>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
