export interface Sale {
    order_id: string;
    id: string;
    price: number;
    comment: string | null;
    date: string;
    created_at: string;
}

export interface User {
    username: string;
}

export interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => boolean;
    logout: () => void;
    loading: boolean;
}

export interface SaleFormProps {
    onSaleAdded: (sale: Sale) => void;
}

export interface SaleItemProps {
    sale: Sale;
    onSaleDeleted: (id: string) => void;
}

export interface SalesStatsProps {
    sales: Sale[];
}

export interface DailySalesProps {
    date: string;
}

export interface LoginFormProps {
    onLogin: (username: string, password: string) => boolean;
}

export interface DateRangeSelectorProps {
    startDate: string;
    endDate: string;
    onDateRangeChange: (startDate: string, endDate: string) => void;
    maxDate: string;
}

export interface PeriodStatsProps {
    maxDate: string;
    initialStartDate: string;
    initialEndDate: string;
}