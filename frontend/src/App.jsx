import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ThemeToggle from './components/ThemeToggle';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import CreateProduct from './pages/CreateProduct';
import MyProducts from './pages/MyProducts';
import Payment from './pages/Payment';
import Wishlist from './pages/Wishlist';
import About from './pages/About';
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import AllBids from './pages/admin/AllBids';
import Sales from './pages/admin/Sales';
import Analytics from './pages/admin/Analytics';

const App = () => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <Navbar />
          <ThemeToggle />
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          <Route path="/create-product" element={<ProtectedRoute><CreateProduct /></ProtectedRoute>} />
          <Route path="/my-products" element={<ProtectedRoute><MyProducts /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/payment/:productId" element={<ProtectedRoute><Payment /></ProtectedRoute>} />

          <Route path="/admin" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute adminOnly><Users /></ProtectedRoute>} />
          <Route path="/admin/bids" element={<ProtectedRoute adminOnly><AllBids /></ProtectedRoute>} />
          <Route path="/admin/sales" element={<ProtectedRoute adminOnly><Sales /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute adminOnly><Analytics /></ProtectedRoute>} />
        </Routes>
          <Footer />
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

export default App;
