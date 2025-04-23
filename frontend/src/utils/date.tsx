import moment from "moment";

export const convertTime = (date: string) => {
  if (!date) return "Invalid date";
  const formattedDate = moment(date).format("MMMM DD, YYYY");
  return formattedDate;
};
