import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ConfigProvider, theme } from 'antd'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'
import Profile from './pages/Profile'
import ProtectedRoutes from './components/ProtectedRoutes'
import MovieDetail from './pages/MovieDetail'
import SeatSelection from './pages/SeatSelection'
import MyBookings from './pages/MyBookings'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#e50914',
          colorLink: '#e50914',
          borderRadius: 8,
          colorBgBase: '#141414',
          colorBgContainer: '#1f1f1f',
          colorBgLayout: '#0d0d0d',
          fontFamily: "'Segoe UI', sans-serif",
        },
      }}
    >
      <div className="app-wrapper">
        <BrowserRouter>
          <Routes>
            <Route path='/' element={
              <ProtectedRoutes>
                <Home />
              </ProtectedRoutes>
            } />

            <Route path='/profile' element={
              <ProtectedRoutes>
                <Profile />
              </ProtectedRoutes>
            } />

            <Route path='/admin' element={
              <ProtectedRoutes>
                <Admin />
              </ProtectedRoutes>
            } />

            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/reset-password/:token' element={<ResetPassword />} />

            <Route path='/partner' element={
              <ProtectedRoutes>
                <Profile />
              </ProtectedRoutes>
            } />

            <Route path='/user' element={
              <ProtectedRoutes>
                <Profile />
              </ProtectedRoutes>
            } />

            <Route path='/movie/:id' element={
              <ProtectedRoutes>
                <MovieDetail />
              </ProtectedRoutes>
            } />

            <Route path='/booking/:showId' element={
              <ProtectedRoutes>
                <SeatSelection />
              </ProtectedRoutes>
            } />

            <Route path='/my-bookings' element={
              <ProtectedRoutes>
                <MyBookings />
              </ProtectedRoutes>
            } />
          </Routes>
        </BrowserRouter>
      </div>
    </ConfigProvider>
  )
}

export default App;