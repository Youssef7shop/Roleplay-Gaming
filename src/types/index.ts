export type UserRole = 'player' | 'admin';

export type WhitelistStatus = 'none' | 'pending' | 'accepted' | 'rejected';

export interface UserProfile {
  uid: string;
  username: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: UserRole;
  isBlocked?: boolean;
  createdAt: any;
  updatedAt: any;
  whitelistStatus: WhitelistStatus;
}

export type JobType = 
  | 'Police Officer'
  | 'Doctor'
  | 'Mechanic'
  | 'Taxi Driver'
  | 'Business Owner'
  | 'Civilian'
  | 'Lawyer'
  | 'Real Estate Agent'
  | 'Other';

export interface RoleplayAnswers {
  question1: string; // What is Roleplay (RP) in your own words?
  question2: string; // What would you do if another player provokes your character?
  question3: string; // What would you do if your character is involved in a dangerous situation?
  question4: string; // What is the difference between IC and OOC?
  question5: string; // What is Fail RP?
  question6: string; // What is Powergaming?
  question7: string; // What is Metagaming?
  question8: string; // What would you do if you witnessed another player breaking server rules?
}

export interface WhitelistApplication {
  id?: string;
  userId: string;
  
  // Personal Info
  fullName: string;
  realAge: number;
  country: string;
  discordUsername: string;
  email: string;

  // Character Info
  characterName: string;
  characterAge: number;
  characterJob: JobType | string;
  customJob?: string;
  personality: string;
  strengths: string;
  weaknesses: string;
  goals: string;

  // Backstory
  backstory: string;

  // RP Answers
  roleplayAnswers: RoleplayAnswers;

  // Rules & Status
  rulesAccepted: boolean;
  status: WhitelistStatus;
  submittedAt: any;
  reviewedAt?: any;
  reviewedBy?: string;
  reviewerName?: string;
  adminNote?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}
