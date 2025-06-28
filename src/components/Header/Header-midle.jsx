import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import HeaderActions from './components/HeaderActions';
import NavigationMenu from './components/NavigationMenu';

const HeaderMidle = () => {
  const handleSearch = (value) => {
    console.log('Search:', value);
  };

  return (
    <div className="bg-white w-full z-50 fixed top-0 left-0 shadow-md px-4 md:px-10">
      {/* Top Row: Brand, Searchbar, Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-[1100px] mx-auto gap-2 md:gap-8 py-3">
        {/* Brand */}
        <div className="flex items-center justify-start">
          <Link to="/">
            <img src="/assets/logo.png" alt="Logo" className="max-h-[70px] flex-shrink-0" />
          </Link>
        </div>
        
        {/* Searchbar */}
        <SearchBar onSearch={handleSearch} />
        
        {/* Actions (Phone, User, Cart) */}
        <HeaderActions />
      </div>
      
      {/* Bottom Row: Navigation Menu */}
      <NavigationMenu />
    </div>
  );
};

export default HeaderMidle;