export interface Post {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  content: string[];
  author: any; // Replace with a proper User interface if available
  date: string;
  likes: string[]; // Array of user IDs
  comments: Comment[];
}

export interface Comment {
  id: string;
  author: any; // Replace with a proper User interface if available
  text: string;
  timestamp: string;
}
