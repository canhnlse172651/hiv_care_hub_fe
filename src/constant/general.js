import { withSuccess } from "antd/es/modal/confirm";

export const MODAL_TYPE = {
  login: "login",
  register: "register",
};

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


export const RANGE_PRICE = {
    max : 4400,
    min : 12
}


export const SHIPPING_OPTION = [
  {
    value : "free",
    label : "Free",
    price : 0
  },
  {
    value : "standard",
    label : "Standard",
    price : 10
  },
  {
    value : "express",
    label : "Express",
    price : 20
  }
]

export const PAYMENT_METHOD = {
  cash : "cash",
  card : "card"
}

export const COUPON = {
  addSuccess : "Add Coupon Succsess",
  addFail : "Add Coupon Fail",
  removeSuccess : "Remove Coupon Success",
  removeFail  : "Remove Coupon Fail"
}

export const DOCTOR_SHIFT_TIME = {
  MORNING: { label: 'Sáng', time: '07:00 - 11:00', start: 7, end: 11 },
  AFTERNOON: { label: 'Chiều', time: '13:00 - 17:00', start: 13, end: 17 },
};

export const ServiceType = {
  TEST: 'TEST',
  CONSULT: 'CONSULT',
  TREATMENT: 'TREATMENT',
};

export const SLOTS = [
  { start: '07:00', end: '07:30', shift: 'MORNING' },
  { start: '07:35', end: '08:05', shift: 'MORNING' },
  { start: '08:10', end: '08:40', shift: 'MORNING' },
  { start: '08:45', end: '09:15', shift: 'MORNING' },
  { start: '09:20', end: '09:50', shift: 'MORNING' },
  { start: '09:55', end: '10:25', shift: 'MORNING' },
  { start: '10:30', end: '11:00', shift: 'MORNING' },
  { start: '13:00', end: '13:30', shift: 'AFTERNOON' },
  { start: '13:35', end: '14:05', shift: 'AFTERNOON' },
  { start: '14:10', end: '14:40', shift: 'AFTERNOON' },
  { start: '14:45', end: '15:15', shift: 'AFTERNOON' },
  { start: '15:20', end: '15:50', shift: 'AFTERNOON' },
  { start: '15:55', end: '16:25', shift: 'AFTERNOON' },
];