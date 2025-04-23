export interface IcreateProjectProps {
  _id?: string;
  title: string;
  description: string;
  teams: {
    _id: string;
    name: string;
    profilePicture?: string;
  }[];
  createdBy: string;
  startDate: string;
  client: string;
  endDate: string;
}

export interface IListData {
  _id: string;
  title: string;
  description: string;
  teams: {
    _id: string;
    name: string;
    profilePicture?: string;
  }[];
  coments: string[];
  createdBy: string;
  startDate: string;
  endDate: string;
  profilePicture?: string;
}
