export interface IAllComentProps {
  _id: string;
  message: string;
  projectId: string;
  userId: {
    profilePicture: string | undefined;
    name: string;
    email: string;
    _id: string;
  };
  replies: {
    _id: string;
    message: string;
    createdAt: string;
    userId: { name: string; email: string; _id: string };
  }[];
  createdAt: string;
}
