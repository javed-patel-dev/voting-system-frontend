import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar, Clock, Trophy, Vote } from "lucide-react";
import { useEffect, useState } from "react";

interface Poll {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  isResultDeclared?: boolean;
  candidatesCount?: number;
  totalVotes?: number;
}

interface PollCardProps {
  poll: Poll;
}

export const PollCard = ({ poll }: PollCardProps) => {
  const [status, setStatus] = useState<"upcoming" | "active" | "ended">("upcoming");
  const [timeDisplay, setTimeDisplay] = useState<string>("");

  useEffect(() => {
    const updateStatus = () => {
      const now = new Date().getTime();
      const startTime = new Date(poll.startDate).getTime();
      const endTime = new Date(poll.endDate).getTime();

      if (now < startTime) {
        setStatus("upcoming");
        setTimeDisplay(formatTimeUntil(startTime - now, "Starts"));
      } else if (now >= startTime && now < endTime) {
        setStatus("active");
        setTimeDisplay(formatTimeUntil(endTime - now, "Ends"));
      } else {
        setStatus("ended");
        setTimeDisplay("");
      }
    };

    const formatTimeUntil = (diff: number, prefix: string) => {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        return `${prefix} in ${days}d ${hours}h`;
      } else if (hours > 0) {
        return `${prefix} in ${hours}h ${minutes}m`;
      } else {
        return `${prefix} in ${minutes}m`;
      }
    };

    updateStatus();
    const timer = setInterval(updateStatus, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [poll.startDate, poll.endDate]);

  const getStatusStyle = () => {
    switch (status) {
      case "upcoming":
        return {
          badge: "bg-blue-500 text-white",
          border: "border-l-blue-500",
          icon: Calendar,
          label: "Upcoming",
        };
      case "active":
        return {
          badge: "bg-green-500 text-white",
          border: "border-l-green-500",
          icon: Vote,
          label: "Vote Now",
        };
      case "ended":
        return {
          badge: "bg-gray-500 text-white",
          border: "border-l-gray-400",
          icon: Clock,
          label: "Ended",
        };
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const styleConfig = getStatusStyle();
  const StatusIcon = styleConfig.icon;

  return (
    <Card
      className={`group overflow-hidden hover:shadow-xl transition-all duration-300 border-l-4 ${styleConfig.border} bg-white cursor-pointer`}
    >
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-5 pb-4">
          <div className="flex items-start justify-between mb-3">
            <Badge className={`${styleConfig.badge} px-3 py-1 font-medium`}>
              <StatusIcon className="h-3 w-3 mr-1.5" />
              {styleConfig.label}
            </Badge>
            {poll.isResultDeclared && (
              <Badge className="bg-yellow-500 text-white px-2 py-1">
                <Trophy className="h-3 w-3 mr-1" />
                Results
              </Badge>
            )}
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {poll.title}
          </h3>

          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{poll.description}</p>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 bg-gray-50 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(poll.startDate)}
              </span>
              {status === "active" && timeDisplay && (
                <span className="flex items-center gap-1 text-green-600 font-medium">
                  <Clock className="h-3.5 w-3.5" />
                  {timeDisplay}
                </span>
              )}
              {status === "upcoming" && timeDisplay && (
                <span className="flex items-center gap-1 text-blue-600 font-medium">
                  <Clock className="h-3.5 w-3.5" />
                  {timeDisplay}
                </span>
              )}
            </div>

            <div className="flex items-center text-blue-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
              View
              <ArrowRight className="h-4 w-4 ml-1" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
