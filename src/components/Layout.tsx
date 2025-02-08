import React, { useState, useRef, useEffect } from 'react';
import { Music2, Search, Home, Library, Upload, User, ShoppingCart, Users, Settings, LogOut, Radio, Sun, Moon, Menu, X, BarChart3, MoreVertical } from 'lucide-react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { usePlayer } from '../lib/player';
import { useSettings } from '../lib/settings';
import NotificationsPopover from './NotificationsPopover';

const Layout: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const user = useAuth((state) => state.user);
  const signOut = useAuth((state) => state.signOut);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentSong, setIsExpanded } = usePlayer();
  const { theme, fontSize, fontFamily, updateSettings } = useSettings();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Apply theme and font settings
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
    };

    const fontFamilyMap = {
      sans: 'ui-sans-serif, system-ui, sans-serif',
      serif: 'ui-serif, Georgia, serif',
      mono: 'ui-monospace, monospace',
    };

    root.style.fontSize = fontSizeMap[fontSize];
    root.style.fontFamily = fontFamilyMap[fontFamily];
  }, [theme, fontSize, fontFamily]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth/login');
  };

  // Only show upload link for admins and artists
  const showUploadLink = user?.is_admin || user?.is_artist;

  const navigationItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/library', icon: Library, label: 'Your Library' },
    { to: '/store', icon: ShoppingCart, label: 'Store' },
    { to: '/community', icon: Users, label: 'Community' },
    ...(showUploadLink ? [
      { to: '/upload', icon: Upload, label: 'Upload Music' },
      { to: '/artist', icon: BarChart3, label: 'Artist Dashboard' }
    ] : []),
    ...(user?.is_admin ? [{ to: '/admin', icon: Settings, label: 'Admin' }] : [])
  ];

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-b ${
      theme === 'dark' 
        ? 'from-gray-900 to-black text-white' 
        : 'from-gray-100 to-white text-gray-900'
    }`}>
      {/* Mobile Header */}
      <div className={`fixed top-0 left-0 right-0 h-16 ${
        theme === 'dark'
          ? 'bg-black/50'
          : 'bg-white/50'
      } backdrop-blur-sm z-50 md:hidden px-4 flex items-center justify-between`}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg"
          >
            {isSidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          <Link to="/" className="flex items-center gap-2">
            <Music2 className="h-6 w-6 text-purple-500 animate-[pulse_3s_ease-in-out_infinite]" strokeWidth={1.5} />
            <span className="font-bold">GOMusiq</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <NotificationsPopover />
          <div className="relative" ref={moreMenuRef}>
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className="p-2 hover:bg-gray-800 rounded-lg"
            >
              <MoreVertical className="h-6 w-6" />
            </button>
            {isMoreMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700"
                  onClick={() => setIsMoreMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <button
                  onClick={() => {
                    updateSettings({ theme: theme === 'dark' ? 'light' : 'dark' });
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-700"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-gray-700"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className={`fixed top-0 left-0 right-0 h-16 ${
        theme === 'dark'
          ? 'bg-black/50'
          : 'bg-white/50'
      } backdrop-blur-sm z-40 px-8 hidden md:flex items-center justify-between md:pl-64`}>
        <Link to="/" className="flex items-center gap-2">
          <Music2 className="h-8 w-8 text-purple-500 animate-[pulse_3s_ease-in-out_infinite]" strokeWidth={1.5} />
          <span className="font-bold text-xl">GOMusiq</span>
        </Link>
        <div className="flex items-center gap-4">
          <NotificationsPopover />
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 hover:opacity-80 transition"
            >
              <img
                src={user?.avatar_url || `https://source.unsplash.com/random/40x40?face&sig=${user?.id}`}
                alt={user?.full_name}
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-500"
              />
            </button>

            {/* User Dropdown */}
            {isDropdownOpen && (
              <div className={`absolute right-0 mt-2 w-64 ${
                theme === 'dark'
                  ? 'bg-gray-800'
                  : 'bg-white'
              } rounded-lg shadow-lg overflow-hidden border ${
                theme === 'dark'
                  ? 'border-gray-700'
                  : 'border-gray-200'
              }`}>
                <div className={`p-4 border-b ${
                  theme === 'dark'
                    ? 'border-gray-700'
                    : 'border-gray-200'
                }`}>
                  <p className="font-medium truncate">{user?.full_name}</p>
                  <p className={`text-sm ${
                    theme === 'dark'
                      ? 'text-gray-400'
                      : 'text-gray-500'
                  } truncate`}>{user?.email}</p>
                </div>
                
                {/* Settings Section */}
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${
                      theme === 'dark'
                        ? 'text-gray-300'
                        : 'text-gray-700'
                    }`}>
                      Theme
                    </label>
                    <button
                      onClick={() => updateSettings({ theme: theme === 'dark' ? 'light' : 'dark' })}
                      className={`w-full flex items-center justify-between p-2 rounded ${
                        theme === 'dark'
                          ? 'hover:bg-gray-700'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {theme === 'dark' ? (
                          <Moon className="w-4 h-4" />
                        ) : (
                          <Sun className="w-4 h-4" />
                        )}
                        {theme === 'dark' ? 'Dark' : 'Light'} Mode
                      </span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${
                      theme === 'dark'
                        ? 'text-gray-300'
                        : 'text-gray-700'
                    }`}>
                      Font Size
                    </label>
                    <select
                      value={fontSize}
                      onChange={(e) => updateSettings({ fontSize: e.target.value as Settings['fontSize'] })}
                      className={`w-full p-2 rounded ${
                        theme === 'dark'
                          ? 'bg-gray-700 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${
                      theme === 'dark'
                        ? 'text-gray-300'
                        : 'text-gray-700'
                    }`}>
                      Font Family
                    </label>
                    <select
                      value={fontFamily}
                      onChange={(e) => updateSettings({ fontFamily: e.target.value as Settings['fontFamily'] })}
                      className={`w-full p-2 rounded ${
                        theme === 'dark'
                          ? 'bg-gray-700 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <option value="sans">Sans Serif</option>
                      <option value="serif">Serif</option>
                      <option value="mono">Monospace</option>
                    </select>
                  </div>
                </div>

                <div className="p-2">
                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className={`flex items-center gap-2 px-4 py-2 ${
                      theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    } rounded-lg transition`}
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-gray-700 rounded-lg transition text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 ${
        theme === 'dark'
          ? 'bg-black'
          : 'bg-gray-100'
      } w-64 transform transition-transform duration-300 ease-in-out z-30 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 flex flex-col pt-16`}>
        {/* Sidebar content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <nav className="space-y-4">
            {navigationItems.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 ${
                  location.pathname === item.to
                    ? 'text-purple-500'
                    : theme === 'dark'
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}

            {/* Music Player Button */}
            {currentSong && (
              <button
                onClick={() => setIsExpanded(true)}
                className={`flex items-center gap-3 w-full mt-8 p-3 rounded-lg ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:text-white bg-purple-500/10 hover:bg-purple-500/20'
                    : 'text-gray-700 hover:text-black bg-purple-500/10 hover:bg-purple-500/20'
                } transition`}
              >
                <Radio className="h-5 w-5" />
                Now Playing
                <span className={`text-sm ${
                  theme === 'dark'
                    ? 'text-gray-400'
                    : 'text-gray-500'
                } truncate flex-1 text-right`}>
                  {currentSong.title}
                </span>
              </button>
            )}
          </nav>
        </div>

        {/* Mobile User Profile - Bottom of Sidebar */}
        <div className="md:hidden p-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar_url || `https://source.unsplash.com/random/40x40?face&sig=${user?.id}`}
              alt={user?.full_name}
              className="w-10 h-10 rounded-full object-cover border-2 border-purple-500"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user?.full_name}</p>
              <p className="text-sm text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 pt-16 md:pl-64">
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </div>

      {/* Music Player Spacer */}
      <div className="h-20 md:h-24">
        {/* This empty div creates space for the fixed music player */}
      </div>
    </div>
  );
};

export default Layout;