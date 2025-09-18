import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Clock, Calendar, MapPin, TrendingUp,
    AlertCircle, ArrowLeft
} from "lucide-react";
import { Candidate, CandidateTable } from "@/components/CandidateTable";


export interface Poll {
    _id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    status: 'upcoming' | 'active' | 'ended';
    totalVotes: number;
    category: string;
    candidates: Candidate[];
    canVote?: boolean; // API will determine this based on user and time
}

export const PollDetailPage = () => {
    // const { pollId } = useParams();
    // const navigate = useNavigate();

    const [poll, setPoll] = useState<Poll | null>(null);
    const [loading, setLoading] = useState(true);
    const [voting, setVoting] = useState(false);
    const [userVote, setUserVote] = useState<string | undefined>(undefined);
    const [error, setError] = useState<string>("");

    // Mock poll data - replace with actual API call
    useEffect(() => {
        const fetchPoll = async () => {
            try {
                setLoading(true);
                // Replace with actual API call
                // const response = await pollService.getPollById(pollId);

                // Mock data
                const mockPoll: Poll = {
                    _id: "1",
                    title: "2024 Presidential Election",
                    description: "Cast your vote for the next president of the country. This election will determine the leadership for the next four years and shape the future of our nation.",
                    startDate: "2024-01-01T00:00:00Z",
                    endDate: "2024-12-31T23:59:59Z",
                    status: "active",
                    totalVotes: 25750,
                    category: "National Election",
                    canVote: true,
                    candidates: [
                        {
                            _id: "1",
                            name: "John Smith",
                            party: "Democratic Party",
                            description: "Experienced leader with 20 years in public service",
                            voteCount: 15420
                        },
                        {
                            _id: "2",
                            name: "Jane Doe",
                            party: "Republican Party",
                            description: "Business leader focused on economic growth",
                            voteCount: 10330
                        },
                        {
                            _id: "3",
                            name: "Robert Johnson",
                            party: "Independent",
                            description: "Reform-minded candidate for change",
                            voteCount: 0
                        }
                    ]
                };

                setPoll(mockPoll);
                // Check if user has already voted
                // setUserVote(response.userVote || null);

            } catch (error) {
                setError("Failed to load poll details");
                console.error("Error fetching poll:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPoll();
    }, []);

    const handleVote = async (candidateId: string) => {
        if (!poll) return;

        try {
            setVoting(true);

            // Replace with actual API call
            // const response = await pollService.vote(poll._id, candidateId);

            // Mock API response handling
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mock different responses to show error handling
            const mockResponses = [
                { success: true, message: "Vote cast successfully!" },
                { success: false, message: "Poll has ended. Voting is no longer allowed." },
                { success: false, message: "You have already voted in this poll." },
                { success: false, message: "Voting period has not started yet." }
            ];

            const mockResponse = mockResponses[0]; // Change index to test different responses

            if (mockResponse.success) {
                // toast.success(mockResponse.message);
                console.log("Success:", mockResponse.message);

                // Update local state
                setUserVote(candidateId);
                setPoll(prevPoll => {
                    if (!prevPoll) return prevPoll;
                    return {
                        ...prevPoll,
                        candidates: prevPoll.candidates.map(candidate =>
                            candidate._id === candidateId
                                ? { ...candidate, voteCount: candidate.voteCount + 1 }
                                : candidate
                        ),
                        totalVotes: prevPoll.totalVotes + 1,
                        canVote: false // User can't vote again
                    };
                });

            } else {
                // toast.error(mockResponse.message);
                console.error("Error:", mockResponse.message);
                setError(mockResponse.message);

                // If poll ended, update state
                if (mockResponse.message.includes("ended")) {
                    setPoll(prevPoll => prevPoll ? { ...prevPoll, canVote: false, status: "ended" } : prevPoll);
                }
            }

        } catch (error) {
            const errorMessage = "Failed to cast vote. Please try again.";
            // toast.error(errorMessage);
            console.error("Vote error:", error);
            setError(errorMessage);
        } finally {
            setVoting(false);
        }
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'upcoming':
                return {
                    badge: 'bg-blue-100 text-blue-800 border-blue-200',
                    icon: <Calendar className="h-4 w-4" />,
                    text: 'Upcoming'
                };
            case 'active':
                return {
                    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                    icon: <TrendingUp className="h-4 w-4" />,
                    text: 'Active Now'
                };
            case 'ended':
                return {
                    badge: 'bg-gray-100 text-gray-800 border-gray-200',
                    icon: <AlertCircle className="h-4 w-4" />,
                    text: 'Ended'
                };
            default:
                return {
                    badge: 'bg-gray-100 text-gray-800 border-gray-200',
                    icon: <Clock className="h-4 w-4" />,
                    text: 'Unknown'
                };
        }
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
                    <p className="text-gray-600 mb-4">The poll you're looking for doesn't exist or has been removed.</p>
                    <Button
                        onClick={() => {/* navigate('/polls') */ }}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Polls
                    </Button>
                </div>
            </div>
        );
    }

    const statusConfig = getStatusConfig(poll.status);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    {/* Back Button */}
                    <Button
                        variant="ghost"
                        onClick={() => {/* navigate('/polls') */ }}
                        className="text-white hover:bg-white/20 mb-6"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Polls
                    </Button>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2">
                            <div className="flex items-center mb-4">
                                <Badge className={`${statusConfig.badge} flex items-center gap-2 mr-4`}>
                                    {statusConfig.icon}
                                    {statusConfig.text}
                                </Badge>
                                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {poll.category}
                                </Badge>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                                {poll.title}
                            </h1>
                            <p className="text-xl text-white/90 leading-relaxed">
                                {poll.description}
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                            <div className="text-center">
                                <div className="text-3xl font-bold mb-2">{poll.totalVotes.toLocaleString()}</div>
                                <div className="text-white/80 text-sm font-medium mb-4">Total Votes Cast</div>

                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <div className="text-2xl font-bold">{poll.candidates.length}</div>
                                        <div className="text-white/80 text-xs">Candidates</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">
                                            {poll.status === 'active' ? <Clock className="h-6 w-6 mx-auto" /> : '—'}
                                        </div>
                                        <div className="text-white/80 text-xs">Time Left</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Error Alert */}
                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Candidates Table */}
                <CandidateTable
                    candidates={poll.candidates}
                    canVote={poll.canVote || false}
                    onVote={handleVote}
                    loading={voting}
                    userVote={userVote}
                />
            </div>
        </div>
    );
};