import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { ProgressProvider } from './lib/ProgressContext.jsx'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import ExamSelect from './pages/ExamSelect.jsx'
import ExamTake from './pages/ExamTake.jsx'
import ExamResult from './pages/ExamResult.jsx'
import ExamHistory from './pages/ExamHistory.jsx'
import Topics from './pages/Topics.jsx'
import TopicPractice from './pages/TopicPractice.jsx'
import Flashcards from './pages/Flashcards.jsx'
import WrongPractice from './pages/WrongPractice.jsx'
import MeoNho from './pages/MeoNho.jsx'
import Search from './pages/Search.jsx'
import Stats from './pages/Stats.jsx'
import NotFound from './pages/NotFound.jsx'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <ProgressProvider>
      <BrowserRouter>
        <ScrollTop />
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="thi-thu" element={<ExamSelect />} />
            <Route path="thi-thu/lam" element={<ExamTake />} />
            <Route path="thi-thu/ket-qua/:id" element={<ExamResult />} />
            <Route path="thi-thu/lich-su" element={<ExamHistory />} />
            <Route path="chu-de" element={<Topics />} />
            <Route path="chu-de/:id" element={<TopicPractice />} />
            <Route path="flashcard" element={<Flashcards />} />
            <Route path="cau-hay-sai" element={<WrongPractice />} />
            <Route path="meo-nho" element={<MeoNho />} />
            <Route path="tim-kiem" element={<Search />} />
            <Route path="thong-ke" element={<Stats />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ProgressProvider>
  )
}
