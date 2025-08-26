import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { theme } from './theme';
import { AuthProvider } from './hooks/useAuth';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import ApartmentDetail from './pages/ApartmentDetail/ApartmentDetail';
import AddApartment from './pages/AddApartment/AddApartment';
import Profile from './pages/Profile/Profile';
import Dashboard from './pages/Dashboard/Dashboard';
import Groups from './pages/Groups/Groups';
import GroupDetail from './pages/GroupDetail/GroupDetail';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import { Compare, CompareSelect, CompareResult } from './pages/Compare';
import { MatchSetup, MatchSwipe, MatchRedirect } from './pages/Match';
import Alerts from './pages/Alerts';
import GroupApartmentSelect from './pages/GroupDetail/GroupApartmentSelect';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <Box component="main" sx={{ flexGrow: 1, pt: { xs: 7, sm: 8 } }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/apartment/:id" element={<ApartmentDetail />} />
                <Route path="/add-apartment" element={<AddApartment />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/group/:groupId" element={<GroupDetail />} />
                <Route path="/group/:groupId/select-apartments" element={<GroupApartmentSelect />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/compare/select" element={<CompareSelect />} />
                <Route path="/compare/result" element={<CompareResult />} />
                <Route path="/match" element={<MatchRedirect />} />
                <Route path="/match/setup" element={<MatchSetup />} />
                <Route path="/match/swipe" element={<MatchSwipe />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
