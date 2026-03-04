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
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Edit2,
  History,
  Mail,
  Trophy,
  User,
  UserCircle,
  UserPlus,
  Vote,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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
  pollId: {
    _id: string;
    title: string;
    startDate: string;
    endDate: string;
    isResultDeclared: boolean;
    winnerId?: string;
  };
  manifesto: string;
  voteCount: number;
  createdAt: string;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);
  const user = auth.decodedToken;

  // State
  const [votingHistory, setVotingHistory] = useState<VotingHistory[]>([]);
  const [candidacyHistory, setCandidacyHistory] = useState<CandidacyHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"profile" | "votes" | "candidacies">("profile");

  // Form state for profile editing
  const [profileForm, setProfileForm] = useState({
    name: "",
    bio: "",
  });

  // Fetch user history
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [votesRes, candidaciesRes] = await Promise.all([
          analyticService.getMyVotingHistory(),
          analyticService.getMyCandidacies(),
        ]);

        if (votesRes.success) {
          setVotingHistory(votesRes.data || []);
        }

        if (candidaciesRes.success) {
          setCandidacyHistory(candidaciesRes.data || []);
        }
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
      });
      fetchData();
    }
  }, [user]);

  // Handle profile update
  const handleProfileUpdate = async () => {
    try {
      setSaving(true);
      setError("");

      const response = await userService.updateProfile({
        name: profileForm.name,
        bio: profileForm.bio,
      });

      if (response.success) {
        setSuccessMessage("Profile updated successfully!");
        setEditing(false);
      } else {
        setError(response.message || "Failed to update profile");
      }
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error("Error updating profile:", err);
    } finally {
      setSaving(false);
    }
  };

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format datetime
  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/home")}
            className="text-white hover:bg-white/20 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-white/80 flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4" />
                {user.email}
              </p>
              <div className="flex gap-3 mt-3">
                <Badge className="bg-white/20 text-white border-white/30">{user.role}</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {[
            { id: "profile", label: "Profile", icon: UserCircle },
            { id: "votes", label: "Voting History", icon: Vote },
            { id: "candidacies", label: "Candidacies", icon: UserPlus },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
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
            <Card>
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
                        onChange={(e) =>
                          setProfileForm((prev) => ({ ...prev, name: e.target.value }))
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <textarea
                        id="bio"
                        value={profileForm.bio}
                        onChange={(e) =>
                          setProfileForm((prev) => ({ ...prev, bio: e.target.value }))
                        }
                        className="w-full mt-1 p-3 border rounded-lg resize-none h-24"
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
                          setProfileForm({ name: user.name || "", bio: "" });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 py-2 border-b">
                      <User className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium">{user.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 py-2 border-b">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 py-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Role</p>
                        <p className="font-medium">{user.role}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
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
                    <div className="text-2xl font-bold text-gray-900">{votingHistory.length}</div>
                    <div className="text-sm text-gray-600">Votes Cast</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <UserPlus className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      {candidacyHistory.length}
                    </div>
                    <div className="text-sm text-gray-600">Candidacies</div>
                  </div>
                </div>

                {candidacyHistory.filter(
                  (c) => c.pollId.isResultDeclared && c.pollId.winnerId === c._id
                ).length > 0 && (
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <Trophy className="h-5 w-5" />
                      <span className="font-medium">
                        {
                          candidacyHistory.filter(
                            (c) => c.pollId.isResultDeclared && c.pollId.winnerId === c._id
                          ).length
                        }{" "}
                        Elections Won!
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Voting History Tab */}
        {activeTab === "votes" && (
          <Card>
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
                <div className="space-y-4">
                  {votingHistory.map((vote) => (
                    <div
                      key={vote._id}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/polls/${vote.pollId._id}`)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{vote.pollId.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Voted for:{" "}
                            <span className="font-medium text-purple-600">
                              {vote.candidateId?.userId?.name || "Unknown Candidate"}
                            </span>
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            {formatDateTime(vote.createdAt)}
                          </p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
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
          <Card>
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
                <div className="space-y-4">
                  {candidacyHistory.map((candidacy) => {
                    const isWinner =
                      candidacy.pollId.isResultDeclared &&
                      candidacy.pollId.winnerId === candidacy._id;

                    return (
                      <div
                        key={candidacy._id}
                        className={`p-4 border rounded-lg transition-colors cursor-pointer ${
                          isWinner
                            ? "bg-yellow-50 border-yellow-200 hover:bg-yellow-100"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => navigate(`/polls/${candidacy.pollId._id}`)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-gray-900">
                                {candidacy.pollId.title}
                              </h3>
                              {isWinner && <Trophy className="h-5 w-5 text-yellow-500" />}
                            </div>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {candidacy.manifesto}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span className="text-gray-500">
                                <Calendar className="h-3 w-3 inline mr-1" />
                                {formatDate(candidacy.pollId.startDate)} -{" "}
                                {formatDate(candidacy.pollId.endDate)}
                              </span>
                              <span className="font-medium text-blue-600">
                                {candidacy.voteCount} votes
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {isWinner ? (
                              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                <Trophy className="h-3 w-3 mr-1" />
                                Winner
                              </Badge>
                            ) : candidacy.pollId.isResultDeclared ? (
                              <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                                Election Ended
                              </Badge>
                            ) : (
                              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                In Progress
                              </Badge>
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

      <Footer />
    </div>
  );
}
