export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: "user" | "owner" | "admin";
    created_at: string;
    updated_at: string;
}
