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

export interface IUpdateTask {
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
  assignees: string[];
  dueDate: string;
}
