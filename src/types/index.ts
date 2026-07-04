export interface Post {
  id: string;
  title: string;
  slug: string;
  content: Record<string, unknown>;
  excerpt: string;
  cover_image: string | null;
  tags: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface PostFormData {
  title: string;
  slug: string;
  content: Record<string, unknown>;
  excerpt: string;
  cover_image: string | null;
  tags: string[];
  published: boolean;
}

export interface User {
  id: string;
  email: string;
}
