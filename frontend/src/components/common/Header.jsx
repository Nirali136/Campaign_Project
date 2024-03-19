import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isLoggedIn, logout } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include', 
      });
      const data = response.statusText;
      console.log('User is logged out successfully' ,data);
        logout();
        navigate('/');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  return (
    <header>
        <nav className="navbar navbar-expand-lg navbar-dark">
          <NavLink to="/" className="navbar-brand">
            <span>My app</span>
          </NavLink>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <NavLink to="/" className="nav-link">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="campaigns" className="nav-link">Campaigns</NavLink>
            </li>
            {isLoggedIn ? (
              <>
            <li className="nav-item">
              <NavLink to="createcampaign" className="nav-link">Add Campaign</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="updatecampaign" className="nav-link">Update Campaign</NavLink>
            </li>
            </>
            ):(<></>)}
            </ul>
            <ul className="navbar-nav ms-auto">
            {isLoggedIn ? (
            <>
              <li className="nav-item">
                <NavLink to="logout" className="nav-link" onClick={handleLogout}>Logout</NavLink>
              </li>
            </>
          ) : (
            <>
            <li className="nav-item">
              <NavLink to="login" className="nav-link">Login</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="signup" className="nav-link">SignUp</NavLink>
            </li>
             </>
             )}
          </ul>
        </nav>
    </header>
  )
}

export default Header
