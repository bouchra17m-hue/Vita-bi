import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './CartContext';
import { AuthProvider } from './AuthContext';
import ToastProvider from './components/Toast';
import Navbar from './components/Navbar';
import Home from './Home';
import Shop from './Shop';
import Nutrition from './Nutrition';
import Calculator from './Calculator';
import Login from './Login';
import Register from './Register';
import Profile from './Profile';
import About from './About';
import AdminProducts from './AdminProducts';
import CustomCursor from './CustomCursor';
import ScrollToTop from './ScrollToTop';
import WaitlistModal from './WaitlistModal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem('vitabi_waitlist_dismissed');
    if (!isDismissed) {
      // Show modal after 2 seconds on first load
      const timer = setTimeout(() => {
        setIsModalOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    localStorage.setItem('vitabi_waitlist_dismissed', 'true');
  };

  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
        <Router>
          <ScrollToTop />
          <div className="App">
            <CustomCursor />
            <WaitlistModal isOpen={isModalOpen} onClose={handleCloseModal} />
            <Navbar />
            <main className="page-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/nutrition" element={<Nutrition />} />
                <Route path="/calculator" element={<Calculator />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/about" element={<About />} />
                 <Route path="/admin" element={<AdminProducts />} />
              </Routes>
            </main>
          </div>
        </Router>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
