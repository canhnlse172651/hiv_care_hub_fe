const PRODUCTS_PATH = "/product";
const PROFILE_PATH = "/profile";
const PROFILE_ORDER = "/profile/order";
const PROFILE_ADDRESS = "/profile/address";
const PROFILE_WISHLIST = "/profile/wishlist";
const ADMIN_PATH = "/admin";

export const PATHS = {
    HOME : "/",
    PRODUCTS : PRODUCTS_PATH,
    PRODUCT_DETAIL : PRODUCTS_PATH + "/:slug",
    CART : "/cart",
    CHECKOUT : "/checkout",
    CHECKOUT_SUCCESS : "/checkout_success",
    DASHBOARD : "/dashboard",
    FAQ : "/faq",
    PAYMENT_METHOD : "/payment_method",
    PRIVACY_POLICY : "/privacy_policy",
    RETURN : "/return",
    SHIPPING : "/shipping",
    PROFILE : {
        INDEX : PROFILE_PATH,
        PROFILE_ORDER : PROFILE_ORDER,
        PROFILE_WISHLIST : PROFILE_WISHLIST,
        PROFILE_ADDRESS : PROFILE_ADDRESS
    },    BLOG : "/blog",
    BLOG_DETAIL: "/blog/:slug",      CONTACT : "/lien-he",    ABOUT : "/about",    FORUM : "/forum",
    ANALYSIS : "/xet-nghiem",
    PHARMACY: "/pharmacy",    ADMIN: {
        INDEX: ADMIN_PATH,
        DASHBOARD: ADMIN_PATH + "/dashboard",
        USER_MANAGEMENT: ADMIN_PATH + "/usermanagement",
        APPOINTMENT_MANAGEMENT: ADMIN_PATH + "/appointments",
        DOCTOR_MANAGEMENT: ADMIN_PATH + "/doctors",
        TREATMENT_TRACKING: ADMIN_PATH + "/treatment-tracking"
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
}
