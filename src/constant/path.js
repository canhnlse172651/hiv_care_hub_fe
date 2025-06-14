// Base paths
const PRODUCTS_PATH = "/product";
const PROFILE_PATH = "/profile";
const ADMIN_PATH = "/admin";
const DOCTOR_PATH = "/doctor";
const STAFF_PATH = "/staff";
const PATIENT_PATH = "/patient";

export const PATHS = {
    // Main paths
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    FORUM: "/forum",
    CONTACT: "/lien-he",
    ANALYSIS: "/xet-nghiem-hiv",
    PHARMACY: "/nha-thuoc",
    SERVICE_BOOKING: "/service-booking",

    // Product related paths
    PRODUCTS: PRODUCTS_PATH,
    PRODUCT_DETAIL: PRODUCTS_PATH + "/:slug",
    CART: "/cart",
    CHECKOUT: "/checkout",
    CHECKOUT_SUCCESS: "/checkout_success",

    // Information paths
    DASHBOARD: "/dashboard",
    FAQ: "/faq",
    PAYMENT_METHOD: "/payment_method",
    PRIVACY_POLICY: "/privacy_policy",
    RETURN: "/return",
    SHIPPING: "/shipping",

    // User profile paths
    PROFILE: {
        INDEX: PROFILE_PATH,
        PROFILE_ORDER: PROFILE_PATH + "/order",
        PROFILE_WISHLIST: PROFILE_PATH + "/wishlist",
        PROFILE_ADDRESS: PROFILE_PATH + "/address"
    },

    // Services paths
    SERVICES: {
        COUNSELING: "/services/counseling",
        TESTING: "/services/testing",
        TREATMENT: "/services/treatment",
        SUPPORT: "/services/support",
        OTHERS: "/services/others"
    },

    // News paths
    NEWS: {
        PREP_FREE: "/news/prep-free",
        PRESS: "/news/press",
        PREP_COMMERCIAL: "/news/prep-commercial"
    },

    // Knowledge paths
    KNOWLEDGE: {
        HIV_TREATMENT: "/knowledge/hiv-treatment",
        STDS: "/knowledge/stds"
    },

    // Admin paths
    ADMIN: {
        INDEX: ADMIN_PATH,
        DASHBOARD: ADMIN_PATH + "/dashboard",
        USER_MANAGEMENT: ADMIN_PATH + "/users",
        APPOINTMENT_MANAGEMENT: ADMIN_PATH + "/appointments",
        DOCTOR_MANAGEMENT: ADMIN_PATH + "/doctors",
        TREATMENT_TRACKING: ADMIN_PATH + "/treatments",
    },

    // Doctor paths
    DOCTOR: {
        INDEX: DOCTOR_PATH,
        DASHBOARD: DOCTOR_PATH + "/dashboard",
        CONSULTATION: DOCTOR_PATH + "/consultation",
        MEDICAL_RECORDS: DOCTOR_PATH + "/medical-records",
        PATIENTS: DOCTOR_PATH + "/patients",
        APPOINTMENTS: DOCTOR_PATH + "/appointments",
        REGIMENS: DOCTOR_PATH + "/regimens"
    },

    // Staff paths
    STAFF: {
        INDEX: STAFF_PATH,
        DASHBOARD: STAFF_PATH + "/dashboard",
        PAYMENT: STAFF_PATH + "/payment",
        PATIENTS: STAFF_PATH + "/patients"
    },

    // Patient paths
    PATIENT: {
        PROFILE: PATIENT_PATH + "/profile",
        APPOINTMENTS: PATIENT_PATH + "/appointments",
        PRESCRIPTIONS: PATIENT_PATH + "/prescriptions",
        MEDICAL_RECORDS: PATIENT_PATH + "/medical-records",
    }
};
