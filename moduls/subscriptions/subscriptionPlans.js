import { FEATURES } from './featureGates';

export const PLAN_CONFIG = {

  COMMUNITY: {
    canCreateEvents: false,
    features: [],
  },

  PRO: {
    canCreateEvents: true,
    features: [
      FEATURES.PROMOTION,
      FEATURES.ANALYTICS,
      FEATURES.PREMIUM_PORTFOLIO,
      FEATURES.GIGSDA_PASS,
      FEATURES.RADAR_BOOST,
    ],
  },

  AGENCY: {
    canCreateEvents: true,
    features: [
      FEATURES.PROMOTION,
      FEATURES.ANALYTICS,
      FEATURES.PREMIUM_PORTFOLIO,
      FEATURES.RADAR_BOOST,
    ],
  },

};