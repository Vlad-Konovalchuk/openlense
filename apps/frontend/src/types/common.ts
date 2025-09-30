// Basic types

export type Option = {
    label: string;
    value: string;
};

export interface Pagination {
    page: number;
    pageSize: number;
    total: number;
}
