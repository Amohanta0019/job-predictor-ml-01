import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import MarksPredictor from './components/MarksPredictor'
import QuizApp from './components/QuizApp'
import './App.css'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"      element={<Home />} />
        <Route path="/marks" element={<MarksPredictor />} />
        <Route path="/quiz"  element={<QuizApp />} />
      </Routes>
    </Router>
  )
}
