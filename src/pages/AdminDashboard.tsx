import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Users, Vote, UserCheck, Plus, Eye, Edit, Trash2,
    TrendingUp, Calendar, Clock, Search, Filter,
    X, CheckCircle, AlertCircle, BarChart3, PieChart,
    Settings, Bell, LogOut, Menu, ChevronDown
} from "lucide-react";

// Note: Import these in your actual project:
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import adminService from "@/services/adminService";

// Types
interface DashboardStats {
    totalVoters: number;
    totalCandidates: number;
    totalPolls: number;
    activePolls: number;
    totalVotes: number;
    recentActivity: number;
}

interface Voter {
    _id: string;
    name: string;
    email: string;
    status: 'active' | 'inactive';
    createdAt: string;
    lastLogin?: string;
    votesCount: number;
}

interface Candidate {
    _id: string;
    name: string;
    party: string;
    email: string;
    pollId: string;
    pollTitle: string;
    voteCount: number;
    status: 'active' | 'inactive';
    createdAt: string;
}

interface Poll {
    _id: string;
    title: string;
    description: string;
    category: string;
    status: 'upcoming' | 'active' | 'ended';
    startDate: string;
    endDate: string;
    totalVotes: number;
    candidatesCount: number;
    createdAt: string;
}

interface CreatePollForm {
    title: string;
    description: string;
    category: string;
    startDate: string;
    endDate: string;
    candidates: Array<{
        name: string;
        party: string;
        description: string;
    }>;
}

// Admin Navbar Component
const AdminNavbar = () => {
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    return (
        <nav className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                            <Vote className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-sm text-gray-600">VoteSecure Management</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
                    </Button>

                    <div className="relative">
                        <Button
                            variant="ghost"
                            className="flex items-center space-x-2"
                            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                        >
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                                <Users className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-sm font-medium">Admin</span>
                            <ChevronDown className="h-4 w-4" />
                        </Button>

                        {showProfileDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                    <Settings className="h-4 w-4 mr-3" />
                                    Settings
                                </a>
                                <hr className="my-2" />
                                <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                    <LogOut className="h-4 w-4 mr-3" />
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

// Dashboard Widget Component
const StatsWidget = ({
    title,
    value,
    icon: Icon,
    change,
    changeType = 'positive',
    onClick,
    gradient = 'from-blue-600 to-cyan-600'
}: {
    title: string;
    value: number | string;
    icon: any;
    change?: string;
    changeType?: 'positive' | 'negative';
    onClick?: () => void;
    gradient?: string;
}) => {
    return (
        <Card
            className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
            onClick={onClick}
        >
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">{title}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                        {change && (
                            <p className={`text-sm mt-2 flex items-center ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                <TrendingUp className="h-4 w-4 mr-1" />
                                {change}
                            </p>
                        )}
                    </div>
                    <div className={`w-16 h-16 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="h-8 w-8 text-white" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// Data Table Component
const DataTable = ({
    title,
    data,
    columns,
    onView,
    onEdit,
    onDelete,
    loading = false,
    showCreateButton = false,
    onCreateClick
}: {
    title: string;
    data: any[];
    columns: Array<{
        key: string;
        label: string;
        render?: (value: any, row: any) => React.ReactNode;
    }>;
    onView?: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    loading?: boolean;
    showCreateButton?: boolean;
    onCreateClick?: () => void;
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredData, setFilteredData] = useState(data);

    useEffect(() => {
        const filtered = data.filter(item =>
            Object.values(item).some(value =>
                value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredData(filtered);
    }, [data, searchTerm]);

    if (loading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                        {title}
                        <Badge className="ml-3 bg-purple-100 text-purple-800">
                            {filteredData.length} items
                        </Badge>
                    </CardTitle>
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-64"
                            />
                        </div>
                        {showCreateButton && (
                            <Button
                                onClick={onCreateClick}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Create Poll
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {column.label}
                                    </th>
                                ))}
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredData.map((row, index) => (
                                <tr key={row._id} className="hover:bg-gray-50 transition-colors">
                                    {columns.map((column) => (
                                        <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                                            {column.render ? column.render(row[column.key], row) : row[column.key]}
                                        </td>
                                    ))}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            {onView && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onView(row._id)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            )}
                                            {onEdit && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onEdit(row._id)}
                                                    className="text-green-600 hover:text-green-800"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            )}
                                            {onDelete && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onDelete(row._id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredData.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-500">No data found</div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

// Create Poll Modal Component
const CreatePollModal = ({
    isOpen,
    onClose,
    onSubmit
}: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreatePollForm) => void;
}) => {
    const [formData, setFormData] = useState<CreatePollForm>({
        title: "",
        description: "",
        category: "",
        startDate: "",
        endDate: "",
        candidates: [
            { name: "", party: "", description: "" },
            { name: "", party: "", description: "" }
        ]
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await onSubmit(formData);
            onClose();
            // Reset form
            setFormData({
                title: "",
                description: "",
                category: "",
                startDate: "",
                endDate: "",
                candidates: [
                    { name: "", party: "", description: "" },
                    { name: "", party: "", description: "" }
                ]
            });
        } catch (error) {
            console.error("Error creating poll:", error);
        } finally {
            setLoading(false);
        }
    };

    const addCandidate = () => {
        setFormData(prev => ({
            ...prev,
            candidates: [...prev.candidates, { name: "", party: "", description: "" }]
        }));
    };

    const removeCandidate = (index: number) => {
        setFormData(prev => ({
            ...prev,
            candidates: prev.candidates.filter((_, i) => i !== index)
        }));
    };

    const updateCandidate = (index: number, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            candidates: prev.candidates.map((candidate, i) =>
                i === index ? { ...candidate, [field]: value } : candidate
            )
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">Create New Poll</h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-6 w-6" />
                        </Button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Basic Poll Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                                Poll Title *
                            </Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Enter poll title"
                                className="mt-1"
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                                Description *
                            </Label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Enter poll description"
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                rows={3}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                                Category *
                            </Label>
                            <Input
                                id="category"
                                value={formData.category}
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                placeholder="e.g., National, Local, Student"
                                className="mt-1"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                                    Start Date *
                                </Label>
                                <Input
                                    id="startDate"
                                    type="datetime-local"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                                    className="mt-1"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                                    End Date *
                                </Label>
                                <Input
                                    id="endDate"
                                    type="datetime-local"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                                    className="mt-1"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Candidates Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Candidates</h3>
                            <Button
                                type="button"
                                onClick={addCandidate}
                                variant="outline"
                                size="sm"
                                className="border-purple-300 text-purple-600 hover:bg-purple-50"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Candidate
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {formData.candidates.map((candidate, index) => (
                                <Card key={index} className="border border-gray-200">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-medium text-gray-900">Candidate {index + 1}</h4>
                                            {formData.candidates.length > 2 && (
                                                <Button
                                                    type="button"
                                                    onClick={() => removeCandidate(index)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label className="text-sm font-medium text-gray-700">Name *</Label>
                                                <Input
                                                    value={candidate.name}
                                                    onChange={(e) => updateCandidate(index, 'name', e.target.value)}
                                                    placeholder="Candidate name"
                                                    className="mt-1"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-sm font-medium text-gray-700">Party</Label>
                                                <Input
                                                    value={candidate.party}
                                                    onChange={(e) => updateCandidate(index, 'party', e.target.value)}
                                                    placeholder="Political party"
                                                    className="mt-1"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <Label className="text-sm font-medium text-gray-700">Description</Label>
                                                <Input
                                                    value={candidate.description}
                                                    onChange={(e) => updateCandidate(index, 'description', e.target.value)}
                                                    placeholder="Brief description"
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Create Poll
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Main Admin Dashboard Component
const AdminDashboard = () => {
    const [currentView, setCurrentView] = useState<'dashboard' | 'voters' | 'candidates' | 'polls'>('dashboard');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [loading, setLoading] = useState(true);

    // Mock data - replace with actual API calls
    const [dashboardStats] = useState<DashboardStats>({
        totalVoters: 15420,
        totalCandidates: 45,
        totalPolls: 12,
        activePolls: 3,
        totalVotes: 89567,
        recentActivity: 234
    });

    const [voters] = useState<Voter[]>([
        {
            _id: "1",
            name: "John Smith",
            email: "john@example.com",
            status: "active",
            createdAt: "2024-01-15T10:30:00Z",
            lastLogin: "2024-01-20T14:30:00Z",
            votesCount: 3
        },
        {
            _id: "2",
            name: "Jane Doe",
            email: "jane@example.com",
            status: "active",
            createdAt: "2024-01-10T08:15:00Z",
            lastLogin: "2024-01-19T16:45:00Z",
            votesCount: 2
        }
    ]);

    const [candidates] = useState<Candidate[]>([
        {
            _id: "1",
            name: "Alice Johnson",
            party: "Democratic Party",
            email: "alice@example.com",
            pollId: "poll1",
            pollTitle: "2024 Presidential Election",
            voteCount: 1250,
            status: "active",
            createdAt: "2024-01-05T12:00:00Z"
        },
        {
            _id: "2",
            name: "Bob Wilson",
            party: "Republican Party",
            email: "bob@example.com",
            pollId: "poll1",
            pollTitle: "2024 Presidential Election",
            voteCount: 980,
            status: "active",
            createdAt: "2024-01-05T12:30:00Z"
        }
    ]);

    const [polls] = useState<Poll[]>([
        {
            _id: "1",
            title: "2024 Presidential Election",
            description: "Choose the next president",
            category: "National",
            status: "active",
            startDate: "2024-01-01T00:00:00Z",
            endDate: "2024-12-31T23:59:59Z",
            totalVotes: 2230,
            candidatesCount: 3,
            createdAt: "2024-01-01T10:00:00Z"
        },
        {
            _id: "2",
            title: "Local Mayor Election",
            description: "Select your city mayor",
            category: "Local",
            status: "upcoming",
            startDate: "2024-06-01T00:00:00Z",
            endDate: "2024-06-30T23:59:59Z",
            totalVotes: 0,
            candidatesCount: 2,
            createdAt: "2024-01-15T14:00:00Z"
        }
    ]);

    useEffect(() => {
        // Simulate loading
        setTimeout(() => setLoading(false), 1000);
    }, []);

    const handleCreatePoll = async (pollData: CreatePollForm) => {
        try {
            console.log("Creating poll:", pollData);
            // Replace with actual API call
            // await adminService.createPoll(pollData);
            // toast.success("Poll created successfully!");

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000));

        } catch (error) {
            console.error("Error creating poll:", error);
            // toast.error("Failed to create poll");
            throw error;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status: string) => {
        const configs = {
            active: 'bg-green-100 text-green-800',
            inactive: 'bg-gray-100 text-gray-800',
            upcoming: 'bg-blue-100 text-blue-800',
            ended: 'bg-red-100 text-red-800'
        };
        return <Badge className={configs[status as keyof typeof configs] || 'bg-gray-100 text-gray-800'}>{status}</Badge>;
    };

    // Column definitions for different tables
    const voterColumns = [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        {
            key: 'status',
            label: 'Status',
            render: (value: string) => getStatusBadge(value)
        },
        { key: 'votesCount', label: 'Votes Cast' },
        {
            key: 'createdAt',
            label: 'Created At',
            render: (value: string) => formatDate(value)
        }
    ];

    const candidateColumns = [
        { key: 'name', label: 'Name' },
        { key: 'party', label: 'Party' },
        { key: 'pollTitle', label: 'Poll' },
        { key: 'voteCount', label: 'Votes' },
        {
            key: 'status',
            label: 'Status',
            render: (value: string) => getStatusBadge(value)
        },
        {
            key: 'createdAt',
            label: 'Created At',
            render: (value: string) => formatDate(value)
        }
    ];

    const pollColumns = [
        { key: 'title', label: 'Title' },
        { key: 'category', label: 'Category' },
        {
            key: 'status',
            label: 'Status',
            render: (value: string) => getStatusBadge(value)
        },
        { key: 'totalVotes', label: 'Total Votes' },
        { key: 'candidatesCount', label: 'Candidates' },
        {
            key: 'createdAt',
            label: 'Created At',
            render: (value: string) => formatDate(value)
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto mb-4" />
                    <p className="text-gray-600">Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNavbar />

            <div className="p-6">
                {/* Navigation Tabs */}
                <div className="mb-6">
                    <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
                        {[
                            { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                            { key: 'voters', label: 'Voters', icon: Users },
                            { key: 'candidates', label: 'Candidates', icon: UserCheck },
                            { key: 'polls', label: 'Polls', icon: Vote }
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setCurrentView(tab.key as any)}
                                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${currentView === tab.key
                                        ? 'bg-white text-purple-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <tab.icon className="h-4 w-4 mr-2" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dashboard View */}
                {currentView === 'dashboard' && (
                    <div>
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
                            <p className="text-gray-600">Monitor your voting system performance</p>
                        </div>

                        {/* Stats Widgets */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            <StatsWidget
                                title="Total Voters"
                                value={dashboardStats.totalVoters.toLocaleString()}
                                icon={Users}
                                change="+12% from last month"
                                onClick={() => setCurrentView('voters')}
                                gradient="from-blue-600 to-cyan-600"
                            />
                            <StatsWidget
                                title="Total Candidates"
                                value={dashboardStats.totalCandidates}
                                icon={UserCheck}
                                change="+5 new this month"
                                onClick={() => setCurrentView('candidates')}
                                gradient="from-emerald-600 to-teal-600"
                            />
                            <StatsWidget
                                title="Total Polls"
                                value={dashboardStats.totalPolls}
                                icon={Vote}
                                change={`${dashboardStats.activePolls} active now`}
                                onClick={() => setCurrentView('polls')}
                                gradient="from-purple-600 to-pink-600"
                            />
                            <StatsWidget
                                title="Total Votes Cast"
                                value={dashboardStats.totalVotes.toLocaleString()}
                                icon={TrendingUp}
                                change="+8.5% this week"
                                gradient="from-orange-600 to-red-600"
                            />
                            <StatsWidget
                                title="Active Polls"
                                value={dashboardStats.activePolls}
                                icon={Clock}
                                change="3 ending soon"
                                gradient="from-indigo-600 to-purple-600"
                            />
                            <StatsWidget
                                title="Recent Activity"
                                value={dashboardStats.recentActivity}
                                icon={Bell}
                                change="Last 24 hours"
                                gradient="from-pink-600 to-rose-600"
                            />
                        </div>

                        {/* Recent Activity Cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="shadow-lg border-0">
                                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
                                    <CardTitle className="flex items-center text-lg font-bold text-gray-900">
                                        <Clock className="h-5 w-5 mr-2" />
                                        Recent Polls
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <div className="space-y-4">
                                        {polls.slice(0, 3).map((poll) => (
                                            <div key={poll._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-gray-900">{poll.title}</p>
                                                    <p className="text-sm text-gray-600">{poll.totalVotes} votes • {poll.candidatesCount} candidates</p>
                                                </div>
                                                {getStatusBadge(poll.status)}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-lg border-0">
                                <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b">
                                    <CardTitle className="flex items-center text-lg font-bold text-gray-900">
                                        <TrendingUp className="h-5 w-5 mr-2" />
                                        Top Performing Candidates
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <div className="space-y-4">
                                        {candidates.slice(0, 3).map((candidate, index) => (
                                            <div key={candidate._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center">
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                                                        }`}>
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{candidate.name}</p>
                                                        <p className="text-sm text-gray-600">{candidate.party}</p>
                                                    </div>
                                                </div>
                                                <Badge className="bg-blue-100 text-blue-800">
                                                    {candidate.voteCount} votes
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {/* Voters View */}
                {currentView === 'voters' && (
                    <div>
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Voters Management</h2>
                            <p className="text-gray-600">Manage registered voters and their activities</p>
                        </div>

                        <DataTable
                            title="Registered Voters"
                            data={voters}
                            columns={voterColumns}
                            onView={(id) => console.log('View voter:', id)}
                            onEdit={(id) => console.log('Edit voter:', id)}
                            onDelete={(id) => console.log('Delete voter:', id)}
                        />
                    </div>
                )}

                {/* Candidates View */}
                {currentView === 'candidates' && (
                    <div>
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Candidates Management</h2>
                            <p className="text-gray-600">Manage election candidates and their information</p>
                        </div>

                        <DataTable
                            title="Election Candidates"
                            data={candidates}
                            columns={candidateColumns}
                            onView={(id) => console.log('View candidate:', id)}
                            onEdit={(id) => console.log('Edit candidate:', id)}
                            onDelete={(id) => console.log('Delete candidate:', id)}
                        />
                    </div>
                )}

                {/* Polls View */}
                {currentView === 'polls' && (
                    <div>
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Polls Management</h2>
                            <p className="text-gray-600">Create and manage election polls</p>
                        </div>

                        <DataTable
                            title="Election Polls"
                            data={polls}
                            columns={pollColumns}
                            onView={(id) => console.log('View poll:', id)}
                            onEdit={(id) => console.log('Edit poll:', id)}
                            onDelete={(id) => console.log('Delete poll:', id)}
                            showCreateButton={true}
                            onCreateClick={() => setShowCreateModal(true)}
                        />
                    </div>
                )}
            </div>

            {/* Create Poll Modal */}
            <CreatePollModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreatePoll}
            />
        </div>
    );
};

export default AdminDashboard;