export interface ITask {
  _id: string;
  title: string;
  description: string;
  status: {
    value: string;
    textColor: string;
    bgColor: string;
  };
  priority: {
    value: string;
    textColor: string;
    bgColor: string;
  };
  assignees: {
    _id: string;
    name: string;
    email: string;
    profilePicture: string;
  }[];
  createdBy: string;
  projectId: {
    _id: string;
    title: string;
  };
  dueDate: string;
  startDate: string;
}

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
