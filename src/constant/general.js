import { withSuccess } from "antd/es/modal/confirm";
import { AUTH_MODAL_TYPES } from "./authConfig";

export const MODAL_TYPE = AUTH_MODAL_TYPES;

export const SORT_OPTION = {
  popularity: {
    value: "popularity",
    label: "Most Popular",
    queryObject: { orderBy: undefined, order: undefined },
  },
  pricelow: {
    value: "pricelow",
    label: "Price Low to High",
    queryObject: { orderBy: "price", order: 1 },
  },

  pricehigh: {
    value: "pricehigh",
    label: "Price High to Low",
    queryObject: { orderBy: "price", order: "-1" },
  },

  newest: {
    value: "newest",
    label: "Newest",
    queryObject: { orderBy: "createAt", order: "-1" },
  },

  rating: {
    value: "rating",
    label: "Most Rated",
    queryObject: { orderBy: "rating", order: "-1" },
  },
};

export const DOCTOR_SHIFT_TIME = {
  MORNING: { label: 'Sáng', time: '07:00 - 11:00', start: 7, end: 11 },
  AFTERNOON: { label: 'Chiều', time: '13:00 - 17:00', start: 13, end: 17 },
};