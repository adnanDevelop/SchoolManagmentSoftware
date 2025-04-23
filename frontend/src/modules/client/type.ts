export interface IClientDataProps {
  _id: string;
  name: string;
  email: string;
  password: string;
  description: string;
  deal: string;
  dueDate: string;
  country: string;
  status: string;
  projects: {
    _id: string;
    title: string;
    description: string;
    teams: {
      _id: string;
      name: string;
      email: string;
      profilePicture: string;
    }[];
  }[];
  createdBy: {
    _id: string;
    name: string;
    email: string;
    profilePicture: string;
  };
  profilePicture: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  __v: number;
}

export interface ICreateClient {
  name: string;
  email: string;
  password: string;
  description: string;
  deal: string;
  dueDate: string;
  country: string;
  status: string;
}
