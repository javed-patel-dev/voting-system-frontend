
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
    Vote, Users, Trophy, User
} from "lucide-react";

export interface Candidate {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
    }
    voteCount: number;
}

interface CandidateTableProps {
    candidates: Candidate[];
    canVote: boolean;
    onVote: (candidateId: string) => void;
    loading?: boolean;
}

// Reusable Candidate Table Component
export const CandidateTable = ({
    candidates,
    canVote,
    onVote,
    loading = false
}: CandidateTableProps) => {
    const sortedCandidates = [...candidates].sort((a, b) => b.voteCount - a.voteCount);

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
                                {canVote && (
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Action
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {sortedCandidates.map((candidate, index) => {
                                return (
                                    <tr
                                        key={candidate._id}
                                        className={`hover:bg-gray-50/50 transition-colors duration-200`}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {getRankIcon(index)}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                                                    <User className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900 flex items-center">
                                                        {candidate.user.name}
                                                    </div>
                                                    {candidate.user.email && (
                                                        <div className="text-sm text-gray-600">{candidate.user.email}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-900">
                                                {candidate.voteCount.toLocaleString()}
                                            </div>
                                        </td>

                                        {canVote && (
                                            <td className="px-6 py-4 whitespace-nowrap">
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

                        return (
                            <Card
                                key={candidate._id}
                                className='bg-white'
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            {getRankIcon(index)}
                                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                                <User className="h-6 w-6 text-white" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 flex items-center">
                                                    {candidate.user.name}
                                                </div>
                                                {candidate.user.email && (
                                                    <div className="text-sm text-gray-600">{candidate.user.email}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {canVote && (
                                        <div className="flex justify-end">
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