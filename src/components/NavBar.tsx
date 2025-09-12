import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Vote, User, LogOut, Settings, Menu, X,
    ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useNavigate } from "react-router-dom";
import { logout } from "@/store/slices/authSlice";
import { RootState } from "@/store/store";

// Navbar Component
export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Mock authentication - replace with actual selector
    const auth = useSelector((state: RootState) => state.auth);
    const isAuthenticated = auth.token !== null;
    const user = auth.decodedToken

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm ">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <a href="/" className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                                <Vote className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">Online Voting System</span>
                        </a>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="/polls" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                            Polls
                        </a>
                        <a href="/results" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                            Results
                        </a>

                        {/* Auth Section */}
                        {isAuthenticated ? (
                            <div className="relative">
                                <Button
                                    variant="ghost"
                                    className="flex items-center space-x-2 p-2"
                                    onMouseEnter={() => setShowProfileDropdown(true)}
                                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                >
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                                        <User className="h-4 w-4 text-white" />
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-gray-500" />
                                </Button>

                                {/* Profile Dropdown */}
                                {showProfileDropdown && (
                                    <div
                                        className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-3 z-50"
                                        onMouseEnter={() => setShowProfileDropdown(true)}
                                        onMouseLeave={() => setShowProfileDropdown(false)}
                                    >
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                                                    <User className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">{user?.email}</p>
                                                    <Badge variant="secondary" className="mt-1 text-xs">
                                                        {user?.role}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="py-2">
                                            <a href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                <Settings className="h-4 w-4 mr-3" />
                                                Profile Settings
                                            </a>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                <LogOut className="h-4 w-4 mr-3" />
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Button variant="ghost" asChild>
                                    <a href="/login">Sign In</a>
                                </Button>
                                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700" asChild>
                                    <a href="/signup">Get Started</a>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <a href="/polls" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Polls</a>
                        <a href="/results" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Results</a>
                        <a href="/about" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">About</a>

                        {isAuthenticated ? (
                            <div className="border-t border-gray-200 pt-4">
                                <div className="flex items-center px-3 py-2">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mr-3">
                                        <User className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-base font-medium text-gray-800">{user?.email}</p>
                                        <p className="text-sm text-gray-500">{user?.role}</p>
                                    </div>
                                </div>
                                <a href="/profile" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Profile</a>
                                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50">
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className="border-t border-gray-200 pt-4 space-y-2">
                                <a href="/login" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Sign In</a>
                                <a href="/signup" className="block px-3 py-2 text-base font-medium text-blue-600 hover:bg-blue-50">Get Started</a>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};