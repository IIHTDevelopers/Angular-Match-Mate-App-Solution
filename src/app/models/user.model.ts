export interface User {
    blockedUsers: number[];
    id: number;
    email: string;
    password: string;
    role: 'provider' | 'patient';
    name: string;
    dateOfBirth: string;
    gender: string;
    religion: string;
    education: string;
    occupation: string;
    age: number;
    location: string;
}
