import { useEffect, useState } from "react";
import { PollCard } from "./PollCard";
import { Pagination } from "./Pagination";
import pollService from "@/services/pollService";
import { useSearchParams } from "react-router-dom";

interface Poll {
    _id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
}

interface ApiResponse {
    data: {
        data: Poll[];
        total: number;
    };
}

export const PollGrid = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 9;

    const filterParam = searchParams.get("filter");
    const filter = filterParam ? JSON.parse(filterParam) : {};

    const [data, setData] = useState<ApiResponse>({ data: { data: [], total: 0 } });
    const [isLoading, setIsLoading] = useState(false);

    const fetchPolls = async ({ page, limit }: { page: number; limit: number }) => {
        const response = await pollService.fetchPolls({ page, limit, filter });
        return response;
    };

    useEffect(() => {
        setIsLoading(true);
        fetchPolls({ page, limit })
            .then((response) => setData(response))
            .catch((error) => console.error("Error fetching polls:", error))
            .finally(() => setIsLoading(false));
    }, [page, limit, filterParam]);

    const handlePagination = (newPage: number) => {
        const params = { page: newPage.toString(), limit: limit.toString(), filter: '' };
        if (Object.keys(filter).length > 0) {
            params.filter = JSON.stringify(filter);
        }
        setSearchParams(params);
    };

    return (
        <div className="p-4">
            <div className="flex items-center justify-start md:justify-end mb-4">
                {data.data.data.length > 0 ? (
                    <div className="hidden md:block">
                        <Pagination
                            title="Polls"
                            count={data.data.total}
                            page={page}
                            limit={limit}
                            handlePagination={handlePagination}
                        />
                    </div>
                ) : null}
            </div>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                    <p>Loading polls...</p>
                ) : (
                    data.data.data.map((poll) => <PollCard poll={poll} />)
                )}
            </div>

            {data.data.data.length > 0 ? (
                <div className="hidden md:block">
                    <Pagination
                        title="Polls"
                        count={data.data.total}
                        page={page}
                        limit={limit}
                        handlePagination={handlePagination}
                    />
                </div>
            ) : null}
        </div>
    );
};
