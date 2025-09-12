import {
    Vote, Calendar,
    Users, TrendingUp, Clock, MapPin, Check, Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Candidate = {
    name: string;
    party: string;
    votes: number;
};

type Poll = {
    id: number;
    title: string;
    description: string;
    status: string;
    endDate: string;
    totalVotes: number;
    category: string;
    candidates: Candidate[];
};

type PollCardProps = {
    poll?: Poll;
    onVote?: (pollId: number) => void;
    onViewResults?: (pollId: number) => void;
};

export const PollCard = ({
    poll = {
        id: 1,
        title: "2024 Presidential Election",
        description: "Cast your vote for the next president of the country.",
        status: "active",
        endDate: "2024-11-05",
        totalVotes: 15420,
        category: "National",
        candidates: [
            { name: "John Smith", party: "Democratic", votes: 8500 },
            { name: "Jane Doe", party: "Republican", votes: 6920 }
        ]
    },
    onVote,
    onViewResults
}: PollCardProps) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-emerald-100 text-emerald-800';
            case 'upcoming': return 'bg-blue-100 text-blue-800';
            case 'ended': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active': return <TrendingUp className="h-3 w-3" />;
            case 'upcoming': return <Clock className="h-3 w-3" />;
            case 'ended': return <Check className="h-3 w-3" />;
            default: return <Clock className="h-3 w-3" />;
        }
    };

    return (
        <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {poll.title}
                        </CardTitle>
                        <CardDescription className="mt-1 text-gray-600">
                            {poll.description}
                        </CardDescription>
                    </div>
                    <Badge className={`${getStatusColor(poll.status)} flex items-center gap-1`}>
                        {getStatusIcon(poll.status)}
                        {poll.status}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Poll Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {poll.totalVotes.toLocaleString()} votes
                    </div>
                    <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Ends {new Date(poll.endDate).toLocaleDateString()}
                    </div>
                </div>

                {/* Category */}
                <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                    <span className="text-sm text-gray-600">{poll.category}</span>
                </div>

                {/* Top Candidates Preview */}
                {poll.candidates && poll.candidates.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Leading Candidates:</p>
                        {poll.candidates.slice(0, 2).map((candidate, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                                <span className="text-sm font-medium">{candidate.name}</span>
                                <div className="flex items-center text-xs text-gray-600">
                                    <span className="mr-2">{candidate.party}</span>
                                    <Badge variant="secondary">{candidate.votes.toLocaleString()}</Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>

            <CardFooter className="pt-3 flex gap-2">
                {poll.status === 'active' && (
                    <Button
                        onClick={() => onVote?.(poll.id)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    >
                        <Vote className="h-4 w-4 mr-2" />
                        Vote Now
                    </Button>
                )}
                <Button
                    variant="outline"
                    onClick={() => onViewResults?.(poll.id)}
                    className={poll.status === 'active' ? 'flex-1' : 'w-full'}
                >
                    <Eye className="h-4 w-4 mr-2" />
                    View Results
                </Button>
            </CardFooter>
        </Card>
    );
};