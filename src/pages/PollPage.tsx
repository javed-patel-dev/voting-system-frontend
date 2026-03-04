import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import candidateService from "@/services/candidateService";
import pollService, { PollWithCandidates } from "@/services/pollService";
import voteService, { VoteStatusResponse } from "@/services/voteService";
import { RootState } from "@/store/store";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  TrendingUp,
  Trophy,
  UserPlus,
  Users,
  Vote,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

type PollStatus = "UPCOMING" | "ACTIVE" | "ENDED";

export const PollDetailPage = () => {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);
  const isAuthenticated = Boolean(auth.token && auth.decodedToken);

  // State
  const [pollData, setPollData] = useState<PollWithCandidates | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Vote status
  const [voteStatus, setVoteStatus] = useState<VoteStatusResponse | null>(null);

  // Candidate registration
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [manifesto, setManifesto] = useState("");
  const [registering, setRegistering] = useState(false);

  // Computed values
  const poll = pollData?.poll;
  const candidates = pollData?.candidates || [];
  const winner = pollData?.winner;
  const status: PollStatus = (poll?.computedStatus || poll?.status || "UPCOMING") as PollStatus;
  const totalVotes = candidates.reduce((sum, c) => sum + (c.voteCount || 0), 0);

  // Fetch poll data
  const fetchPollData = useCallback(async () => {
    if (!pollId) return;

    try {
      setLoading(true);
      const response = await pollService.fetchFullPollDetails(pollId);

      if (response.success) {
        setPollData(response.data);
      } else {
        setError("Failed to load poll details");
      }

      // Fetch vote status if authenticated
      if (isAuthenticated) {
        try {
          const voteStatusRes = await voteService.checkVoteStatus(pollId);
          if (voteStatusRes.success) {
            setVoteStatus(voteStatusRes.data);
          }
        } catch {
          // Ignore vote status errors for now
        }
      }
    } catch (err) {
      setError("Failed to load poll details");
      console.error("Error fetching poll:", err);
    } finally {
      setLoading(false);
    }
  }, [pollId, isAuthenticated]);

  useEffect(() => {
    fetchPollData();
  }, [fetchPollData]);

  // Handle vote
  const handleVote = async (candidateId: string) => {
    if (!poll || !isAuthenticated) return;

    try {
      setVoting(true);
      setError("");

      const response = await voteService.castVote({ candidateId, pollId: poll._id });

      if (response.success) {
        setSuccessMessage("Your vote has been cast successfully!");
        setVoteStatus({
          hasVoted: true,
          isCandidate: false,
          canVote: false,
          votedAt: new Date().toISOString(),
        });
        // Refresh poll data to get updated vote counts
        await fetchPollData();
      } else {
        setError(response.message || "Failed to cast vote");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to cast vote. Please try again.";
      setError(errorMessage);
    } finally {
      setVoting(false);
    }
  };

  // Handle candidate registration
  const handleRegisterCandidate = async () => {
    if (!poll || !manifesto.trim()) return;

    try {
      setRegistering(true);
      setError("");

      const response = await candidateService.registerAsCandidate({
        pollId: poll._id,
        manifesto: manifesto.trim(),
      });

      if (response.success) {
        setSuccessMessage("Successfully registered as a candidate!");
        setShowRegisterForm(false);
        setManifesto("");
        setVoteStatus((prev) => (prev ? { ...prev, isCandidate: true, canVote: false } : null));
        await fetchPollData();
      } else {
        setError(response.message || "Failed to register as candidate");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to register. Please try again.";
      setError(errorMessage);
    } finally {
      setRegistering(false);
    }
  };

  // Status configuration
  const getStatusConfig = (s: PollStatus) => {
    switch (s) {
      case "UPCOMING":
        return {
          badge: "bg-blue-100 text-blue-800 border-blue-200",
          icon: <Calendar className="h-4 w-4" />,
          text: "Upcoming",
          color: "blue",
        };
      case "ACTIVE":
        return {
          badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
          icon: <TrendingUp className="h-4 w-4" />,
          text: "Voting Active",
          color: "emerald",
        };
      case "ENDED":
        return {
          badge: "bg-gray-100 text-gray-800 border-gray-200",
          icon: <AlertCircle className="h-4 w-4" />,
          text: "Ended",
          color: "gray",
        };
      default:
        return {
          badge: "bg-gray-100 text-gray-800 border-gray-200",
          icon: <Clock className="h-4 w-4" />,
          text: "Unknown",
          color: "gray",
        };
    }
  };

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600">Loading poll details...</p>
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Poll Not Found</h2>
          <p className="text-gray-600 mb-4">
            The poll you are looking for does not exist or has been removed.
          </p>
          <Button
            onClick={() => navigate("/home")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Polls
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(status);
  const canRegisterAsCandidate =
    status === "UPCOMING" && isAuthenticated && !voteStatus?.isCandidate;
  const canVote = status === "ACTIVE" && isAuthenticated && voteStatus?.canVote;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/home")}
            className="text-white hover:bg-white/20 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Polls
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Poll Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <Badge className={`${statusConfig.badge} flex items-center gap-2`}>
                  {statusConfig.icon}
                  {statusConfig.text}
                </Badge>
                {poll.isResultDeclared && (
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1">
                    <Trophy className="h-3 w-3" />
                    Results Declared
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{poll.title}</h1>
              <p className="text-lg text-white/90 leading-relaxed mb-4">{poll.description}</p>

              <div className="flex items-center gap-6 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Start: {formatDate(poll.startDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>End: {formatDate(poll.endDate)}</span>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{totalVotes.toLocaleString()}</div>
                <div className="text-white/80 text-sm font-medium mb-6">Total Votes Cast</div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-2xl font-bold">{candidates.length}</div>
                    <div className="text-white/80 text-xs">Candidates</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <Users className="h-6 w-6 mx-auto mb-1" />
                    <div className="text-white/80 text-xs">Voters</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Vote Status Banner */}
        {isAuthenticated && voteStatus && (
          <Card className="mb-6">
            <CardContent className="py-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  {voteStatus.hasVoted && (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-700 font-medium">
                        You have already voted in this poll
                      </span>
                    </>
                  )}
                  {voteStatus.isCandidate && (
                    <>
                      <UserPlus className="h-5 w-5 text-purple-600" />
                      <span className="text-purple-700 font-medium">
                        You are a candidate in this poll
                      </span>
                    </>
                  )}
                  {!voteStatus.hasVoted && !voteStatus.isCandidate && status === "ACTIVE" && (
                    <>
                      <Vote className="h-5 w-5 text-blue-600" />
                      <span className="text-blue-700 font-medium">You can cast your vote</span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Candidate Registration Section (UPCOMING phase) */}
        {canRegisterAsCandidate && (
          <Card className="mb-6 border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <UserPlus className="h-5 w-5" />
                Register as a Candidate
              </CardTitle>
              <CardDescription>
                This poll is upcoming. You can register as a candidate and add your manifesto.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showRegisterForm ? (
                <Button
                  onClick={() => setShowRegisterForm(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Register as Candidate
                </Button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="manifesto">Your Manifesto</Label>
                    <textarea
                      id="manifesto"
                      value={manifesto}
                      onChange={(e) => setManifesto(e.target.value)}
                      placeholder="Describe why people should vote for you... (min 10 characters)"
                      className="w-full mt-2 p-3 border rounded-lg resize-none h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      maxLength={2000}
                    />
                    <p className="text-xs text-gray-500 mt-1">{manifesto.length}/2000 characters</p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleRegisterCandidate}
                      disabled={registering || manifesto.trim().length < 10}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {registering ? "Registering..." : "Submit Registration"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowRegisterForm(false);
                        setManifesto("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Winner Announcement (ENDED + Results Declared) */}
        {status === "ENDED" && poll.isResultDeclared && winner && (
          <Card className="mb-6 border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50">
            <CardContent className="py-6">
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Trophy className="h-12 w-12 text-yellow-500" />
                <div className="text-center">
                  <p className="text-sm text-yellow-700 font-medium">Winner</p>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {winner.userId?.name || "Unknown"}
                  </h2>
                  <p className="text-lg text-gray-600">
                    {winner.voteCount} votes ({winner.percentage}%)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Candidates List */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="h-6 w-6" />
            Candidates ({candidates.length})
          </h2>

          {candidates.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No candidates registered yet.</p>
                {status === "UPCOMING" && (
                  <p className="text-sm text-gray-500 mt-2">
                    Be the first to register as a candidate!
                  </p>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {candidates.map((candidate, index) => (
                <Card
                  key={candidate._id}
                  className={`relative transition-all hover:shadow-lg ${
                    winner && winner._id === candidate._id ? "border-yellow-400 bg-yellow-50" : ""
                  }`}
                >
                  {winner && winner._id === candidate._id && (
                    <div className="absolute -top-3 -right-3">
                      <div className="bg-yellow-400 rounded-full p-2">
                        <Trophy className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                          {candidate.userId?.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {candidate.userId?.name || "Unknown"}
                          </CardTitle>
                          <p className="text-sm text-gray-500">Candidate #{index + 1}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-lg font-bold">
                        {candidate.voteCount || 0}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <FileText className="h-4 w-4" />
                        Manifesto
                      </div>
                      <p className="text-gray-700 text-sm line-clamp-3">{candidate.manifesto}</p>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Votes</span>
                        <span className="font-medium">{candidate.percentage || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${candidate.percentage || 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Vote Button */}
                    {canVote && (
                      <Button
                        onClick={() => handleVote(candidate._id)}
                        disabled={voting}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        {voting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                            Voting...
                          </>
                        ) : (
                          <>
                            <Vote className="h-4 w-4 mr-2" />
                            Vote for {candidate.userId?.name?.split(" ")[0]}
                          </>
                        )}
                      </Button>
                    )}

                    {status === "ENDED" && !poll.isResultDeclared && (
                      <div className="text-center text-sm text-gray-500 py-2">
                        Waiting for results declaration
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Not Authenticated Message */}
        {!isAuthenticated && status === "ACTIVE" && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="py-6 text-center">
              <AlertCircle className="h-8 w-8 text-orange-500 mx-auto mb-3" />
              <p className="text-orange-800 font-medium">Login required to vote</p>
              <p className="text-sm text-orange-700 mt-1 mb-4">
                Please login or register to cast your vote in this poll.
              </p>
              <Button
                onClick={() => navigate("/login")}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Login to Vote
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
