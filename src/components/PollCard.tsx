import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Vote, Calendar, AlertCircle } from "lucide-react";

interface Poll {
    _id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
}

interface PollCardProps {
    poll: Poll;
}

export const PollCard = ({ poll }: PollCardProps) => {
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    } | null>(null);
    const [status, setStatus] = useState<'upcoming' | 'active' | 'ended'>('upcoming');

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date().getTime();
            const startTime = new Date(poll.startDate).getTime();
            const endTime = new Date(poll.endDate).getTime();

            if (now < startTime) {
                // Poll hasn't started yet
                setStatus('upcoming');
                const difference = startTime - now;
                setTimeLeft(calculateTimeLeft(difference));
            } else if (now >= startTime && now < endTime) {
                // Poll is active
                setStatus('active');
                const difference = endTime - now;
                setTimeLeft(calculateTimeLeft(difference));
            } else {
                // Poll has ended
                setStatus('ended');
                setTimeLeft(null);
            }
        };

        const calculateTimeLeft = (difference: number) => {
            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((difference % (1000 * 60)) / 1000)
            };
        };

        updateTimer();
        const timer = setInterval(updateTimer, 1000);

        return () => clearInterval(timer);
    }, [poll.startDate, poll.endDate]);

    const getStatusConfig = () => {
        switch (status) {
            case 'upcoming':
                return {
                    badge: 'bg-blue-100 text-blue-800 border-blue-200',
                    icon: <Calendar className="h-3 w-3" />,
                    text: 'Upcoming',
                    gradient: 'from-blue-50 to-blue-100',
                    accent: 'border-l-blue-500'
                };
            case 'active':
                return {
                    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                    icon: <Vote className="h-3 w-3" />,
                    text: 'Active',
                    gradient: 'from-emerald-50 to-emerald-100',
                    accent: 'border-l-emerald-500'
                };
            case 'ended':
                return {
                    badge: 'bg-gray-100 text-gray-800 border-gray-200',
                    icon: <AlertCircle className="h-3 w-3" />,
                    text: 'Ended',
                    gradient: 'from-gray-50 to-gray-100',
                    accent: 'border-l-gray-500'
                };
            default:
                return {
                    badge: 'bg-gray-100 text-gray-800 border-gray-200',
                    icon: <Clock className="h-3 w-3" />,
                    text: 'Unknown',
                    gradient: 'from-gray-50 to-gray-100',
                    accent: 'border-l-gray-500'
                };
        }
    };

    const statusConfig = getStatusConfig();

    const formatTimeLeft = () => {
        if (!timeLeft) return null;

        const { days, hours, minutes, seconds } = timeLeft;

        if (days > 0) {
            return `${days}d ${hours}h ${minutes}m`;
        } else if (hours > 0) {
            return `${hours}h ${minutes}m ${seconds}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds}s`;
        } else {
            return `${seconds}s`;
        }
    };

    const getTimerLabel = () => {
        switch (status) {
            case 'upcoming':
                return 'Starts in';
            case 'active':
                return 'Ends in';
            default:
                return null;
        }
    };

    return (
        <Card className={`group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br ${statusConfig.gradient} border-l-4 ${statusConfig.accent} backdrop-blur-sm overflow-hidden relative`}>
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />

            <div className="relative z-10">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-3">
                        <Badge className={`${statusConfig.badge} flex items-center gap-1.5 font-medium px-3 py-1.5 shadow-sm`}>
                            {statusConfig.icon}
                            {statusConfig.text}
                        </Badge>

                        {timeLeft && status !== 'ended' && (
                            <div className="text-right">
                                <div className="text-xs text-gray-600 font-medium">
                                    {getTimerLabel()}
                                </div>
                                <div className="text-sm font-bold text-gray-900 flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {formatTimeLeft()}
                                </div>
                            </div>
                        )}
                    </div>

                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                        {poll.title}
                    </CardTitle>
                    <CardDescription className="text-gray-700 text-base leading-relaxed mt-2">
                        {poll.description}
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-2">
                    {/* Countdown Display for Active Polls */}
                    {status === 'active' && timeLeft && (
                        <div className="bg-white/70 rounded-lg p-4 mb-4 border border-emerald-200">
                            <div className="flex items-center justify-center space-x-6 text-center">
                                {timeLeft.days > 0 && (
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-bold text-emerald-700">{timeLeft.days}</span>
                                        <span className="text-xs text-gray-600 font-medium">DAYS</span>
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <span className="text-2xl font-bold text-emerald-700">{timeLeft.hours}</span>
                                    <span className="text-xs text-gray-600 font-medium">HOURS</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-2xl font-bold text-emerald-700">{timeLeft.minutes}</span>
                                    <span className="text-xs text-gray-600 font-medium">MINUTES</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-2xl font-bold text-emerald-700">{timeLeft.seconds}</span>
                                    <span className="text-xs text-gray-600 font-medium">SECONDS</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Upcoming Poll Info */}
                    {status === 'upcoming' && timeLeft && (
                        <div className="bg-white/70 rounded-lg p-4 mb-4 border border-blue-200">
                            <div className="text-center">
                                <div className="text-blue-700 font-semibold mb-2">Poll starts in:</div>
                                <div className="text-2xl font-bold text-blue-800">{formatTimeLeft()}</div>
                            </div>
                        </div>
                    )}

                    {/* Ended Poll Info */}
                    {status === 'ended' && (
                        <div className="bg-white/70 rounded-lg p-4 mb-4 border border-gray-200">
                            <div className="text-center">
                                <div className="text-gray-700 font-semibold">This poll has ended</div>
                                <div className="text-sm text-gray-600 mt-1">Results are now available</div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        {status === 'active' && (
                            <Button
                                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                                size="lg"
                            >
                                <Vote className="h-4 w-4 mr-2" />
                                Vote Now
                            </Button>
                        )}

                        {status === 'upcoming' && (
                            <Button
                                variant="outline"
                                className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
                                size="lg"
                                disabled
                            >
                                <Clock className="h-4 w-4 mr-2" />
                                Coming Soon
                            </Button>
                        )}
                    </div>
                </CardContent>
            </div>

            {/* Subtle hover glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-500/5 to-emerald-500/5 pointer-events-none" />
        </Card>
    );
};