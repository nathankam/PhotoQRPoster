export interface User {
  uuid: string;
  email: string;
  password: string;
}

export interface Image {
  id: number;
  user_uuid: string;
  url: string;
  created_at: string;
} 