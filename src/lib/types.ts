export interface IPost {
  id?: string;
  title: string;
  description: string;
  userUid?: string;
  username?: string;
  downloadUrl?: string;
  createdAt?: string | null;
}

export interface IUser {
  name: string;
  username: string;
  email: string;
  photoURL: string;
  emailVerified: boolean;
}

export type RootStackParamList = {
  Main: undefined;
  Search: undefined;
  Post: undefined;
  Add: undefined;
  Save: undefined;
  Comment: undefined;
  Profile: undefined;
  FeaturedPosts: undefined;
  PostDetail: { post: IPost }; // Define the PostDetail parameter
};
