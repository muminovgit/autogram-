export type Car = {
  id: string;
  brand: string;
  model: string;
  year: string;
  photo?: string;
};

export type Comment = { id: string; author: string; text: string };

export type Post = {
  id: string;
  author: string;
  photo: string;
  caption: string;
  carLabel: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
  createdAt: number;
};

export type Profile = { name: string; bio: string };
