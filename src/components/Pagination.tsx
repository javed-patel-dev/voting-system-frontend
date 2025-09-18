import { Button } from '@/components/ui/button';
import { MoveLeft, MoveRight } from 'lucide-react';

type PaginationProps = {
    title?: string;
    count?: number;
    page?: number;
    limit?: number;
    handlePagination?: (newPage: number) => void;
    disabled?: boolean;
};

export function Pagination({
    title = 'Results',
    count,
    page,
    limit,
    handlePagination,
    disabled,
}: PaginationProps) {
    const start = page && limit ? (page - 1) * limit + 1 : 0;
    const end = page && limit && count ? Math.min(page * limit, count) : 0;

    return (
        <div className="flex flex-row items-center justify-center">
            {
                count
                    ? (
                        <span className="text-xs font-bold">
                            {`Showing${start && end ? ` ${start} - ${end} of ` : ''} ${count} ${title}`}
                        </span>
                    )
                    : null
            }

            {
                handlePagination
                    ? (
                        <div className="ml-3">
                            <Button
                                variant="link"
                                size="sm"
                                disabled={disabled ? true : !count || !limit || !page || page === 1}
                                onClick={() => {
                                    if (count && limit && page && page > 1) {
                                        handlePagination(page - 1);
                                    }
                                }}
                            >
                                <MoveLeft />
                            </Button>

                            <Button
                                variant="link"
                                size="sm"
                                disabled={disabled ? true : !count || !limit || !page || page === Math.ceil(count / limit)}
                                onClick={() => {
                                    if (count && limit && page && page < Math.ceil(count / limit)) {
                                        handlePagination(page + 1);
                                    }
                                }}
                            >
                                <MoveRight />
                            </Button>
                        </div>
                    )
                    : null
            }

        </div>
    );
}
