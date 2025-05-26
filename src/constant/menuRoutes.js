import { PATHS } from './path';

// Map menu keys to route paths
export const menuRoutes = {
  'hiv-test': PATHS.ANALYSIS,
  'pharmacy': PATHS.PHARMACY,
  'contact': PATHS.CONTACT,
  'faq': PATHS.FORUM,
    // Services submenu
  'service-1': PATHS.SERVICES.COUNSELING,
  'service-2': PATHS.SERVICES.TESTING,
  'service-3': PATHS.SERVICES.TREATMENT,
  'service-4': PATHS.SERVICES.SUPPORT,
  'service-5': PATHS.SERVICES.OTHERS,
  
  // News submenu
  'news-1': PATHS.NEWS.PREP_FREE,
  'news-2': PATHS.NEWS.PRESS,
  'news-3': PATHS.NEWS.PREP_COMMERCIAL,
  
  // Knowledge submenu
  'knowledge-1': PATHS.KNOWLEDGE.HIV_TREATMENT,
  'knowledge-2': PATHS.KNOWLEDGE.STDS,
};

export const getRoutePath = (menuKey) => {
  return menuRoutes[menuKey] || '/';
};
