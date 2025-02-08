import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import Upload from './pages/Upload';
import Profile from './pages/Profile';
import Store from './pages/Store';
import Community from './pages/Community';
import Dashboard from './pages/admin/Dashboard';
import ArtistDashboard from './pages/artist/Dashboard';
import ArtistProfile from './pages/ArtistProfile';
import AlbumDetails from './pages/AlbumDetails';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { AuthProvider } from './components/AuthProvider';
import { AuthGuard } from './components/AuthGuard';
import { ErrorBoundary } from './lib/errorBoundary';
import MusicPlayer from './components/MusicPlayer';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public authentication routes */}
            <Route path="/auth/login" element={
              <AuthGuard requireAuth={false}>
                <Login />
              </AuthGuard>
            } />
            <Route path="/auth/register" element={
              <AuthGuard requireAuth={false}>
                <Register />
              </AuthGuard>
            } />

            {/* Protected routes */}
            <Route path="/" element={
              <AuthGuard>
                <Layout />
              </AuthGuard>
            }>
              <Route index element={<Home />} />
              <Route path="search" element={<Search />} />
              <Route path="library" element={<Library />} />
              <Route path="upload" element={<Upload />} />
              <Route path="store" element={<Store />} />
              <Route path="community" element={<Community />} />
              <Route path="profile" element={<Profile />} />
              <Route path="artist" element={<ArtistDashboard />} />
              <Route path="artist/:id" element={<ArtistProfile />} />
              <Route path="album/:id" element={<AlbumDetails />} />
              <Route path="admin" element={<Dashboard />} />
            </Route>
          </Routes>

          {/* Global music player */}
          <MusicPlayer />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;