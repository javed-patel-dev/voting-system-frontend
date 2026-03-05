import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import analyticService from "@/services/analyticService";
import pollService from "@/services/pollService";
import { logout } from "@/store/slices/authSlice";
import { toast } from "@/utils/toast";
import {
  AlertCircle,
  BarChart3,
  Bell,
  Calendar,
  CheckCircle,
  ChevronDown,
  Clock,
  Eye,
  LogOut,
  Plus,
  Search,
  Settings,
  Trash2,
  TrendingUp,
  Trophy,
  UserCheck,
  Users,
  Vote,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// Types
interface DashboardStats {
  totalVoters: number;
  totalCandidates: number;
  totalPolls: number;
  activePolls: number;
  totalVotes: number;
  uniqueVoters: number;
}

interface Poll {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status?: string;
  computedStatus?: string;
  isResultDeclared?: boolean;
  candidatesCount?: number;
  totalVotes?: number;
  createdAt: string;
}

interface CreatePollForm {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

// Admin Navbar Component
const AdminNavbar = ({ onLogout }: { onLogout: () => void }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Vote className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Voting System Management</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
          </Button>

          <div className="relative">
            <Button
              variant="ghost"
              className="flex items-center space-x-2"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium">Admin</span>
              <ChevronDown className="h-4 w-4" />
            </Button>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Settings
                </button>
                <hr className="my-2" />
                <button
                  onClick={onLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
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

// Dashboard Stats Widget
const StatsWidget = ({
  title,
  value,
  icon: Icon,
  subtitle,
  onClick,
  gradient = "from-blue-600 to-cyan-600",
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  subtitle?: string;
  onClick?: () => void;
  gradient?: string;
}) => {
  return (
    <Card
      className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-0 shadow-md"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div
            className={`w-14 h-14 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}
          >
            <Icon className="h-7 w-7 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Create Poll Modal
const CreatePollModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePollForm) => Promise<void>;
  loading: boolean;
}) => {
  const [formData, setFormData] = useState<CreatePollForm>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    setFormData({ title: "", description: "", startDate: "", endDate: "" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Create New Poll</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Users can register as candidates during the upcoming phase
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="title">Poll Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Best Teacher Election 2026"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what this poll is about..."
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                className="mt-1"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {loading ? "Creating..." : "Create Poll"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Poll Card for Admin
const AdminPollCard = ({
  poll,
  onView,
  onDeclareResults,
  onDelete,
}: {
  poll: Poll;
  onView: () => void;
  onDeclareResults: () => void;
  onDelete: () => void;
}) => {
  const now = new Date();
  const startDate = new Date(poll.startDate);
  const endDate = new Date(poll.endDate);

  let status: "UPCOMING" | "ACTIVE" | "ENDED" = "UPCOMING";
  if (now >= startDate && now < endDate) {
    status = "ACTIVE";
  } else if (now >= endDate) {
    status = "ENDED";
  }

  const getStatusConfig = () => {
    switch (status) {
      case "UPCOMING":
        return { bg: "bg-blue-100", text: "text-blue-800", label: "Upcoming" };
      case "ACTIVE":
        return { bg: "bg-green-100", text: "text-green-800", label: "Active" };
      case "ENDED":
        return { bg: "bg-gray-100", text: "text-gray-800", label: "Ended" };
    }
  };

  const statusConfig = getStatusConfig();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="hover:shadow-lg transition-all border-0 shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`${statusConfig.bg} ${statusConfig.text} border-0`}>
                {statusConfig.label}
              </Badge>
              {poll.isResultDeclared && (
                <Badge className="bg-yellow-100 text-yellow-800 border-0">
                  <Trophy className="h-3 w-3 mr-1" />
                  Results Declared
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-gray-900 text-lg">{poll.title}</h3>
            <p className="text-sm text-gray-500 line-clamp-2 mt-1">{poll.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(poll.startDate)}
          </span>
          <span>to</span>
          <span>{formatDate(poll.endDate)}</span>
        </div>

        <div className="flex items-center gap-2 pt-3 border-t">
          <Button variant="outline" size="sm" onClick={onView} className="flex-1">
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          {status === "ENDED" && !poll.isResultDeclared && (
            <Button
              size="sm"
              onClick={onDeclareResults}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              <Trophy className="h-4 w-4 mr-1" />
              Declare Results
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Admin Dashboard
const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currentView, setCurrentView] = useState<"dashboard" | "polls">("dashboard");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Dashboard Stats
  const [stats, setStats] = useState<DashboardStats>({
    totalVoters: 0,
    totalCandidates: 0,
    totalPolls: 0,
    activePolls: 0,
    totalVotes: 0,
    uniqueVoters: 0,
  });

  // Polls
  const [polls, setPolls] = useState<Poll[]>([]);

  // Fetch Dashboard Stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await analyticService.getDashboardStats();
        if (response.success && response.data) {
          setStats({
            totalVoters: response.data.totalVoters || 0,
            totalCandidates: response.data.totalCandidates || 0,
            totalPolls: response.data.totalPolls || 0,
            activePolls: response.data.activePolls || 0,
            totalVotes: response.data.totalVotes || 0,
            uniqueVoters: response.data.uniqueVoters || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  // Fetch Polls
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        setLoading(true);
        const response = await pollService.fetchPolls({
          page: 1,
          limit: 50,
          filter: {},
        });

        if (response.success && response.data) {
          setPolls(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching polls:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Handle create poll
  const handleCreatePoll = async (data: CreatePollForm) => {
    try {
      setActionLoading(true);
      const response = await pollService.createPoll({
        title: data.title,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
      });

      if (response.success) {
        toast.success("Poll created successfully!");
        setShowCreateModal(false);
        // Refresh polls
        const pollsRes = await pollService.fetchPolls({ page: 1, limit: 50, filter: {} });
        if (pollsRes.success) {
          setPolls(pollsRes.data.data || []);
        }
      } else {
        toast.error(response.message || "Failed to create poll");
      }
    } catch (error) {
      console.error("Error creating poll:", error);
      toast.error("Failed to create poll");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle declare results
  const handleDeclareResults = async (pollId: string) => {
    if (!window.confirm("Are you sure you want to declare results for this poll?")) return;

    try {
      setActionLoading(true);
      const response = await pollService.declareResults(pollId);

      if (response.success) {
        toast.success("Results declared successfully! Winner has been notified.");
        // Refresh polls
        const pollsRes = await pollService.fetchPolls({ page: 1, limit: 50, filter: {} });
        if (pollsRes.success) {
          setPolls(pollsRes.data.data || []);
        }
      } else {
        toast.error(response.message || "Failed to declare results");
      }
    } catch (error) {
      console.error("Error declaring results:", error);
      toast.error("Failed to declare results");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle delete poll
  const handleDeletePoll = async (pollId: string) => {
    if (!window.confirm("Are you sure you want to delete this poll? This action cannot be undone."))
      return;

    try {
      setActionLoading(true);
      const response = await pollService.deletePoll(pollId);

      if (response.success) {
        toast.success("Poll deleted successfully");
        setPolls((prev) => prev.filter((p) => p._id !== pollId));
      } else {
        toast.error("Failed to delete poll");
      }
    } catch (error) {
      console.error("Error deleting poll:", error);
      toast.error("Failed to delete poll");
    } finally {
      setActionLoading(false);
    }
  };

  // Filter polls by search
  const filteredPolls = polls.filter(
    (poll) =>
      poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poll.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Categorize polls
  const now = new Date();
  const upcomingPolls = filteredPolls.filter((p) => new Date(p.startDate) > now);
  const activePolls = filteredPolls.filter(
    (p) => new Date(p.startDate) <= now && new Date(p.endDate) > now
  );
  const endedPolls = filteredPolls.filter((p) => new Date(p.endDate) <= now);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar onLogout={handleLogout} />

      <div className="p-6 max-w-7xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={currentView === "dashboard" ? "default" : "outline"}
            onClick={() => setCurrentView("dashboard")}
            className={currentView === "dashboard" ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </Button>
          <Button
            variant={currentView === "polls" ? "default" : "outline"}
            onClick={() => setCurrentView("polls")}
            className={currentView === "polls" ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            <Vote className="h-4 w-4 mr-2" />
            Manage Polls
          </Button>
        </div>

        {/* Dashboard View */}
        {currentView === "dashboard" && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
              <p className="text-gray-600">Monitor your voting system</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsWidget
                title="Total Polls"
                value={stats.totalPolls}
                icon={Vote}
                subtitle={`${stats.activePolls} active`}
                gradient="from-blue-600 to-cyan-600"
              />
              <StatsWidget
                title="Total Voters"
                value={stats.totalVoters}
                icon={Users}
                subtitle="Registered users"
                gradient="from-emerald-600 to-teal-600"
              />
              <StatsWidget
                title="Total Candidates"
                value={stats.totalCandidates}
                icon={UserCheck}
                subtitle="Across all polls"
                gradient="from-purple-600 to-pink-600"
              />
              <StatsWidget
                title="Total Votes"
                value={stats.totalVotes}
                icon={TrendingUp}
                subtitle={`${stats.uniqueVoters} unique voters`}
                gradient="from-orange-600 to-red-600"
              />
            </div>

            {/* Quick Actions */}
            <Card className="mb-8 border-0 shadow-md">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={() => {
                      setCurrentView("polls");
                      setShowCreateModal(true);
                    }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Poll
                  </Button>
                  <Button variant="outline" onClick={() => setCurrentView("polls")}>
                    <Vote className="h-4 w-4 mr-2" />
                    View All Polls
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent/Active Polls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Polls */}
              <Card className="border-0 shadow-md">
                <CardHeader className="bg-green-50 border-b">
                  <CardTitle className="flex items-center text-green-800">
                    <Clock className="h-5 w-5 mr-2" />
                    Active Polls ({activePolls.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {activePolls.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No active polls</p>
                  ) : (
                    <div className="space-y-3">
                      {activePolls.slice(0, 3).map((poll) => (
                        <div
                          key={poll._id}
                          className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                          onClick={() => navigate(`/polls/${poll._id}`)}
                        >
                          <p className="font-medium text-gray-900">{poll.title}</p>
                          <p className="text-sm text-gray-500">
                            Ends: {new Date(poll.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Polls Needing Action */}
              <Card className="border-0 shadow-md">
                <CardHeader className="bg-yellow-50 border-b">
                  <CardTitle className="flex items-center text-yellow-800">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Needs Action
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {endedPolls.filter((p) => !p.isResultDeclared).length === 0 ? (
                    <p className="text-gray-500 text-center py-4">All caught up!</p>
                  ) : (
                    <div className="space-y-3">
                      {endedPolls
                        .filter((p) => !p.isResultDeclared)
                        .slice(0, 3)
                        .map((poll) => (
                          <div
                            key={poll._id}
                            className="p-3 bg-yellow-50 rounded-lg flex items-center justify-between"
                          >
                            <div>
                              <p className="font-medium text-gray-900">{poll.title}</p>
                              <p className="text-sm text-yellow-700">Results pending</p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleDeclareResults(poll._id)}
                              className="bg-yellow-500 hover:bg-yellow-600"
                            >
                              <Trophy className="h-4 w-4 mr-1" />
                              Declare
                            </Button>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Polls Management View */}
        {currentView === "polls" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Manage Polls</h2>
                <p className="text-gray-600">Create and manage election polls</p>
              </div>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Poll
              </Button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search polls..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 max-w-md"
              />
            </div>

            {/* Polls by Status */}
            {upcomingPolls.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Upcoming ({upcomingPolls.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingPolls.map((poll) => (
                    <AdminPollCard
                      key={poll._id}
                      poll={poll}
                      onView={() => navigate(`/polls/${poll._id}`)}
                      onDeclareResults={() => handleDeclareResults(poll._id)}
                      onDelete={() => handleDeletePoll(poll._id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {activePolls.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Active ({activePolls.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activePolls.map((poll) => (
                    <AdminPollCard
                      key={poll._id}
                      poll={poll}
                      onView={() => navigate(`/polls/${poll._id}`)}
                      onDeclareResults={() => handleDeclareResults(poll._id)}
                      onDelete={() => handleDeletePoll(poll._id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {endedPolls.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Ended ({endedPolls.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {endedPolls.map((poll) => (
                    <AdminPollCard
                      key={poll._id}
                      poll={poll}
                      onView={() => navigate(`/polls/${poll._id}`)}
                      onDeclareResults={() => handleDeclareResults(poll._id)}
                      onDelete={() => handleDeletePoll(poll._id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {filteredPolls.length === 0 && (
              <Card className="border-0 shadow-md">
                <CardContent className="py-12 text-center">
                  <Vote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No polls found</p>
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="mt-4 bg-blue-600 hover:bg-blue-700"
                  >
                    Create Your First Poll
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Create Poll Modal */}
      <CreatePollModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreatePoll}
        loading={actionLoading}
      />
    </div>
  );
};

export default AdminDashboard;
