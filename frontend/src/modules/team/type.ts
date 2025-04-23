export interface IUser {
  _id: string;
  role: "member" | "projectManager" | "admin";
  name: string;
  email: string;
  profilePicture?: string;
}

export interface IcreateUserProps {
  name: string;
  email: string;
  password: string;
  role: "member" | "projectManager" | "admin";
}
