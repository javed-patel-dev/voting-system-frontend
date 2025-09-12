import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Candidate = {
    id: number;
    name: string;
    party: string;
    image: string;
    description: string;
    votes: number;
    percentage: number;
};

type CandidateCardProps = {
    candidate?: Candidate;
    showVotes?: boolean;
    onSelect?: (id: number) => void;
    isSelected?: boolean;
};

export const CandidateCard = ({
    candidate = {
        id: 1,
        name: "John Smith",
        party: "Democratic Party",
        image: "🧑‍💼",
        description: "Experienced leader with a vision for change.",
        votes: 8500,
        percentage: 55.2
    },
    showVotes = true,
    onSelect,
    isSelected = false
}: CandidateCardProps) => {
    return (
        <Card className={`group hover:shadow-lg transition-all duration-300 cursor-pointer ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50/50' : 'bg-white/80 backdrop-blur-sm'
            }`} onClick={() => onSelect?.(candidate.id)}>
            <CardHeader className="text-center pb-3">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-3xl mb-3">
                    {candidate.image}
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                    {candidate.name}
                </CardTitle>
                <CardDescription className="text-blue-600 font-medium">
                    {candidate.party}
                </CardDescription>
            </CardHeader>

            <CardContent className="text-center">
                <p className="text-sm text-gray-600 mb-4">{candidate.description}</p>

                {showVotes && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{candidate.votes.toLocaleString()} votes</span>
                            <span className="text-blue-600 font-bold">{candidate.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${candidate.percentage}%` }}
                            />
                        </div>
                    </div>
                )}

                {isSelected && (
                    <div className="mt-4 flex items-center justify-center text-blue-600">
                        <Check className="h-5 w-5 mr-2" />
                        <span className="font-medium">Selected</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};