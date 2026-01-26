export interface Notification {
  id: number;
  recipient: any; // User summary
  actor: any; // User summary
  type: string;
  message: string;
  relatedId: string;
  read: boolean;
  createdAt: string;
}
