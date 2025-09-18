
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
    Vote, Users,
    CheckCircle, Trophy, User
} from "lucide-react";

// Note: Import these in your actual project:
// import { useParams, useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast"; // or your preferred toast library
// import pollService from "@/services/pollService";

export interface Candidate {
    _id: string;
    name: string;
    party?: string;
    description?: string;
    voteCount: number;
    image?: string;
}


interface CandidateTableProps {
    candidates: Candidate[];
    canVote: boolean;
    onVote: (candidateId: string) => void;
    loading?: boolean;
    userVote?: string; // ID of candidate user has voted for
}

// Reusable Candidate Table Component
export const CandidateTable = ({
    candidates,
    canVote,
    onVote,
    loading = false,
    userVote
}: CandidateTableProps) => {
    const sortedCandidates = [...candidates].sort((a, b) => b.voteCount - a.voteCount);
    const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.voteCount, 0);

    const getVotePercentage = (votes: number) => {
        if (totalVotes === 0) return 0;
        return ((votes / totalVotes) * 100).toFixed(1);
    };

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0:
                return <Trophy className="h-5 w-5 text-yellow-500" />;
            case 1:
                return <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>;
            case 2:
                return <div className="w-5 h-5 bg-amber-600 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>;
            default:
                return <span className="text-gray-500 font-semibold">{index + 1}</span>;
        }
    };

    return (
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                    <Users className="h-6 w-6 mr-3 text-blue-600" />
                    Candidates
                </CardTitle>
                {totalVotes > 0 && (
                    <div className="text-sm text-gray-600">
                        Total Votes: <span className="font-semibold">{totalVotes.toLocaleString()}</span>
                    </div>
                )}
            </CardHeader>

            <CardContent className="p-0">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/80">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rank
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Candidate
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Votes
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Percentage
                                </th>
                                {canVote && (
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Action
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {sortedCandidates.map((candidate, index) => {
                                const percentage = getVotePercentage(candidate.voteCount);
                                const hasVoted = userVote === candidate._id;

                                return (
                                    <tr
                                        key={candidate._id}
                                        className={`hover:bg-gray-50/50 transition-colors ${hasVoted ? 'bg-blue-50/50 ring-1 ring-blue-200' : ''
                                            }`}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {getRankIcon(index)}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                                                    {candidate.image ? (
                                                        <img src={candidate.image} alt={candidate.name} className="w-10 h-10 rounded-full object-cover" />
                                                    ) : (
                                                        <User className="h-5 w-5 text-white" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900 flex items-center">
                                                        {candidate.name}
                                                        {hasVoted && (
                                                            <CheckCircle className="h-4 w-4 ml-2 text-green-600" />
                                                        )}
                                                    </div>
                                                    {candidate.party && (
                                                        <div className="text-sm text-gray-600">{candidate.party}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-900">
                                                {candidate.voteCount.toLocaleString()}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-1 mr-4">
                                                    <div className="text-sm font-bold text-gray-900 mb-1">{percentage}%</div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                                                            style={{ width: `${percentage}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {canVote && (
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {hasVoted ? (
                                                    <Badge className="bg-green-100 text-green-800 border-green-200">
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        Voted
                                                    </Badge>
                                                ) : (
                                                    <Button
                                                        onClick={() => onVote(candidate._id)}
                                                        disabled={loading}
                                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                                        size="sm"
                                                    >
                                                        {loading ? (
                                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                                        ) : (
                                                            <>
                                                                <Vote className="h-4 w-4 mr-1" />
                                                                Vote
                                                            </>
                                                        )}
                                                    </Button>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4 p-4">
                    {sortedCandidates.map((candidate, index) => {
                        const percentage = getVotePercentage(candidate.voteCount);
                        const hasVoted = userVote === candidate._id;

                        return (
                            <Card
                                key={candidate._id}
                                className={`${hasVoted ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white'}`}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            {getRankIcon(index)}
                                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                                {candidate.image ? (
                                                    <img src={candidate.image} alt={candidate.name} className="w-12 h-12 rounded-full object-cover" />
                                                ) : (
                                                    <User className="h-6 w-6 text-white" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 flex items-center">
                                                    {candidate.name}
                                                    {hasVoted && <CheckCircle className="h-4 w-4 ml-2 text-green-600" />}
                                                </div>
                                                {candidate.party && (
                                                    <div className="text-sm text-gray-600">{candidate.party}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-medium text-gray-600">Votes</span>
                                            <span className="text-sm font-bold">{candidate.voteCount.toLocaleString()} ({percentage}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>

                                    {canVote && (
                                        <div className="flex justify-end">
                                            {hasVoted ? (
                                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Voted
                                                </Badge>
                                            ) : (
                                                <Button
                                                    onClick={() => onVote(candidate._id)}
                                                    disabled={loading}
                                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                                    size="sm"
                                                >
                                                    {loading ? (
                                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                                    ) : (
                                                        <>
                                                            <Vote className="h-4 w-4 mr-1" />
                                                            Vote
                                                        </>
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};