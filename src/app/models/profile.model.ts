export interface Profile {
    id: number;
    userId: number;
    name: string;
    age: number;
    gender: string;
    religion: string;
    caste: string;
    location: string;
    profilePicture: string;
    preferences: {
        ageRange: [number, number];
        religion: string;
        location: string;
    };
    privacySettings: {
        showProfile: boolean;
        showContactDetails: boolean;
    };
}
