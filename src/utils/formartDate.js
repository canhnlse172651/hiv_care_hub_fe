import moment from "moment";

export const formartDate = (date, type) => {
  if (!date) return "";
  return moment(date).format(type);
};
