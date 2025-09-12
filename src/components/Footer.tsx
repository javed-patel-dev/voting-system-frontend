import { Vote, Facebook, Twitter, Instagram, Mail, Phone, Globe } from "lucide-react";

export const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                                <Vote className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold">Online Voting System</span>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">
                            Secure, transparent, and accessible digital voting platform for the modern democracy.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="/polls" className="text-gray-400 hover:text-white transition-colors">Active Polls</a></li>
                            <li><a href="/results" className="text-gray-400 hover:text-white transition-colors">Results</a></li>
                            <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                            <li><a href="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2">
                            <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                            <li><a href="/security" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
                            <li><a href="/accessibility" className="text-gray-400 hover:text-white transition-colors">Accessibility</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center text-gray-400">
                                <Mail className="h-4 w-4 mr-2" />
                                support@Online Voting System.com
                            </li>
                            <li className="flex items-center text-gray-400">
                                <Phone className="h-4 w-4 mr-2" />
                                +1 (555) 123-4567
                            </li>
                            <li className="flex items-center text-gray-400">
                                <Globe className="h-4 w-4 mr-2" />
                                www.Online Voting System.com
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8 mt-8 text-center">
                    <p className="text-gray-400 text-sm">
                        © 2024 Online Voting System. All rights reserved. Built with security and transparency in mind.
                    </p>
                </div>
            </div>
        </footer>
    );
};