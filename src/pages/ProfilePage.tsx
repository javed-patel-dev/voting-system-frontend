import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/NavBar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import analyticService from "@/services/analyticService";
import userService from "@/services/userService";
import { RootState } from "@/store/store";
import { getApiErrorMessage } from "@/utils/errorHelper";
import { toast } from "@/utils/toast";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Edit2,
  Eye,
  EyeOff,
  History,
  Key,
  Lock,
  Mail,
  Settings,
  Trophy,
  User,
  UserCircle,
  UserPlus,
  Vote,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Predefined avatar options
const AVATARS = [
  { id: "blue", gradient: "from-blue-500 to-blue-600" },
  { id: "purple", gradient: "from-purple-500 to-purple-600" },
  { id: "green", gradient: "from-green-500 to-green-600" },
  { id: "orange", gradient: "from-orange-500 to-orange-600" },
  { id: "pink", gradient: "from-pink-500 to-pink-600" },
  { id: "cyan", gradient: "from-cyan-500 to-cyan-600" },
  { id: "indigo", gradient: "from-indigo-500 to-indigo-600" },
  { id: "rose", gradient: "from-rose-500 to-rose-600" },
];

interface VotingHistory {
  _id: string;
  pollId: {
    _id: string;
    title: string;
    startDate: string;
    endDate: string;
  };
  candidateId: {
    _id: string;
    userId: {
      name: string;
    };
  };
  createdAt: string;
}

interface CandidacyHistory {
  _id: string;
  pollId: string;
  pollTitle: string;
  manifesto: string;
  voteCount: number;
  pollStatus: string;
  isResultDeclared: boolean;
  winnerId?: string;
  isWinner?: boolean;
  createdAt: string;
}

type TabType = "profile" | "security" | "votes" | "candidacies";

export default function ProfilePage() {
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);
  const user = auth.decodedToken;

  const [votingHistory, setVotingHistory] = useState<VotingHistory[]>([]);
  const [candidacyHistory, setCandidacyHistory] = useState<CandidacyHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: "",
    bio: "",
    avatar: "blue",
  });

  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [changingPassword, setChangingPassword] = useState(false);

  // Avatar selection modal
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [votesRes, candidaciesRes] = await Promise.all([
          analyticService.getMyVotingHistory(),
          analyticService.getMyCandidacies(),
        ]);

        if (votesRes.success) setVotingHistory(votesRes.data?.votes || []);
        if (candidaciesRes.success) setCandidacyHistory(candidaciesRes.data || []);
      } catch (err) {
        console.error("Error fetching profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      setProfileForm({
        name: user.name || "",
        bio: "",
        avatar: "blue",
      });
      fetchData();
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    try {
      setSaving(true);
      setError("");

      const response = await userService.updateProfile({
        name: profileForm.name,
        bio: profileForm.bio,
        avatar: profileForm.avatar,
      });

      if (response.success) {
        toast.success("Profile updated successfully!");
        setEditing(false);
      } else {
        setError(response.message || "Failed to update profile");
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to update profile"));
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    setError("");

    // Validation
    if (passwordForm.newPassword.length < 8) {
      setError("New password must be at least 8 characters long");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      setChangingPassword(true);
      const response = await userService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      if (response.success) {
        toast.success("Password changed successfully!");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setError(response.message || "Failed to change password");
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to change password"));
    } finally {
      setChangingPassword(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAvatarGradient = () => {
    const avatar = AVATARS.find((a) => a.id === profileForm.avatar);
    return avatar?.gradient || AVATARS[0].gradient;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Please login to view your profile</p>
          <Button onClick={() => navigate("/login")} className="mt-4 bg-blue-600 hover:bg-blue-700">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "profile" as TabType, label: "Profile", icon: UserCircle },
    { id: "security" as TabType, label: "Security", icon: Lock },
    { id: "votes" as TabType, label: "My Votes", icon: Vote },
    { id: "candidacies" as TabType, label: "Candidacies", icon: UserPlus },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section with Avatar */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/home")}
            className="text-white hover:bg-white/20 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          <div className="flex items-center gap-6">
            {/* Avatar with edit option */}
            <div className="relative">
              <div
                className={`w-20 h-20 rounded-full bg-gradient-to-br ${getAvatarGradient()} flex items-center justify-center text-3xl font-bold cursor-pointer hover:ring-4 hover:ring-white/30 transition-all`}
                onClick={() => setShowAvatarPicker(true)}
              >
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <button
                onClick={() => setShowAvatarPicker(true)}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              >
                <Edit2 className="h-3.5 w-3.5 text-gray-700" />
              </button>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-white/80 flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4" />
                {user.email}
              </p>
              <Badge className="mt-2 bg-white/20 text-white border-white/30">{user.role}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setError("");
                setSuccessMessage("");
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Messages */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="shadow-md border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  {!editing && (
                    <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {editing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <textarea
                        id="bio"
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm((p) => ({ ...p, bio: e.target.value }))}
                        className="w-full mt-1 p-3 border rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={handleProfileUpdate}
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditing(false);
                          setProfileForm((p) => ({ ...p, name: user.name || "" }));
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 py-3 border-b">
                      <User className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium">{user.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 py-3 border-b">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 py-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Role</p>
                        <p className="font-medium">{user.role}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-md border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Activity Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <Vote className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{votingHistory.length}</div>
                    <div className="text-sm text-gray-600">Votes Cast</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <UserPlus className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{candidacyHistory.length}</div>
                    <div className="text-sm text-gray-600">Candidacies</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="max-w-md">
            <Card className="shadow-md border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Change Password
                </CardTitle>
                <CardDescription>Ensure your account stays secure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative mt-1">
                      <Input
                        id="currentPassword"
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))
                        }
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords((p) => ({ ...p, current: !p.current }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.current ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative mt-1">
                      <Input
                        id="newPassword"
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))
                        }
                        placeholder="Enter new password (min 8 characters)"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords((p) => ({ ...p, new: !p.new }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.new ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative mt-1">
                      <Input
                        id="confirmPassword"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))
                        }
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords((p) => ({ ...p, confirm: !p.confirm }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    onClick={handlePasswordChange}
                    disabled={
                      changingPassword ||
                      !passwordForm.currentPassword ||
                      !passwordForm.newPassword ||
                      !passwordForm.confirmPassword
                    }
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {changingPassword ? "Changing Password..." : "Change Password"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border-0 mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium">Email Verified</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-0">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">Account Type</p>
                      <p className="text-sm text-gray-500">Standard user account</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 border-0">{user.role}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Voting History Tab */}
        {activeTab === "votes" && (
          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Vote className="h-5 w-5" />
                Voting History
              </CardTitle>
              <CardDescription>Your voting activity across all polls</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
                </div>
              ) : votingHistory.length === 0 ? (
                <div className="text-center py-12">
                  <Vote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">You haven't voted in any polls yet</p>
                  <Button
                    onClick={() => navigate("/home")}
                    className="mt-4 bg-blue-600 hover:bg-blue-700"
                  >
                    Browse Polls
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {votingHistory.map((vote) => (
                    <div
                      key={vote._id}
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/polls/${vote.pollId._id}`)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{vote.pollId.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Voted for:{" "}
                            <span className="font-medium text-purple-600">
                              {vote.candidateId?.userId?.name || "Unknown"}
                            </span>
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {formatDateTime(vote.createdAt)}
                          </p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-0">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Voted
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Candidacies Tab */}
        {activeTab === "candidacies" && (
          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Candidacy History
              </CardTitle>
              <CardDescription>Polls where you ran as a candidate</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
                </div>
              ) : candidacyHistory.length === 0 ? (
                <div className="text-center py-12">
                  <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    You haven't registered as a candidate in any polls
                  </p>
                  <Button
                    onClick={() => navigate("/home")}
                    className="mt-4 bg-blue-600 hover:bg-blue-700"
                  >
                    Find Upcoming Polls
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {candidacyHistory.map((candidacy) => {
                    return (
                      <div
                        key={candidacy._id}
                        className={`p-4 border rounded-lg cursor-pointer ${
                          candidacy.isWinner ? "bg-yellow-50 border-yellow-200" : "hover:bg-gray-50"
                        }`}
                        onClick={() => navigate(`/polls/${candidacy.pollId}`)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{candidacy.pollTitle}</h3>
                              {candidacy.isWinner && <Trophy className="h-5 w-5 text-yellow-500" />}
                            </div>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {candidacy.manifesto}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span className="text-gray-500">
                                {formatDate(candidacy.createdAt)}
                              </span>
                              <span className="font-medium text-blue-600">
                                {candidacy.voteCount} votes
                              </span>
                            </div>
                          </div>
                          <div>
                            {candidacy.isWinner ? (
                              <Badge className="bg-yellow-100 text-yellow-800 border-0">
                                <Trophy className="h-3 w-3 mr-1" />
                                Winner
                              </Badge>
                            ) : candidacy.pollStatus === "ENDED" || candidacy.isResultDeclared ? (
                              <Badge className="bg-gray-100 text-gray-800 border-0">Ended</Badge>
                            ) : candidacy.pollStatus === "ACTIVE" ? (
                              <Badge className="bg-green-100 text-green-800 border-0">Active</Badge>
                            ) : (
                              <Badge className="bg-blue-100 text-blue-800 border-0">Upcoming</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Avatar Picker Modal */}
      {showAvatarPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowAvatarPicker(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 animate-in zoom-in-95">
            <h3 className="text-lg font-bold mb-4">Choose Avatar Color</h3>
            <div className="grid grid-cols-4 gap-3">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => {
                    setProfileForm((p) => ({ ...p, avatar: avatar.id }));
                    setShowAvatarPicker(false);
                  }}
                  className={`w-14 h-14 rounded-full bg-gradient-to-br ${avatar.gradient} flex items-center justify-center text-white text-xl font-bold hover:scale-110 transition-transform ${
                    profileForm.avatar === avatar.id ? "ring-4 ring-blue-300 ring-offset-2" : ""
                  }`}
                >
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={() => setShowAvatarPicker(false)}
              className="w-full mt-4"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
