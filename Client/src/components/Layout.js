import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
    const location = useLocation();
    const hideHeaderFooter = location.pathname === '/login' || location.pathname === '/register';

    return (
        <>
            {!hideHeaderFooter && <Header />}
            <main>{children}</main>
            {!hideHeaderFooter && <Footer />}
        </>
    );
};

export default Layout; 