import { FEATURES } from './featureGates';

export const PLAN_CONFIG = {

  COMMUNITY: {
    title: 'COMMUNITY',
    price: '0 €',
    badge: null,
    maxEvents: 0,

    canCreateEvents: false,

    displayFeatures: [
      'Profil',
      'Community',
      'Favoriten',
      'Requests',
      'Crew Support'
    ],

    lockedFeatures: [
      'Event-Erstellung',
      'Portfolio'
    ]
  },


  PRO: {
    title: 'PRO',
    price: '9,90 €',
    badge: 'BELIEBTESTE WAHL',
    maxEvents: 25,

    canCreateEvents: true,

    features: [
      FEATURES.PREMIUM_PORTFOLIO,
      FEATURES.GIGSDA_PASS,
      FEATURES.PROMOTION
    ],

    displayFeatures: [
      'Event-Erstellung',
      'Event-Chat',
      'Crew-Management',
      'Rider-Check',
      'Deal-System',
      'Event Planner',
      'Promotion',
      'Premium Portfolio',
      'GIGSDA Pass'
    ]
  },


  AGENCY: {
    title: 'AGENCY',
    price: '24,90 €',
    maxEvents: 100,
    
    canCreateEvents: true,

    features: [
      FEATURES.PREMIUM_PORTFOLIO,
      FEATURES.GIGSDA_PASS,
      FEATURES.PROMOTION,
      FEATURES.AGENCY_DASHBOARD,
      FEATURES.DOCUMENTS,
      FEATURES.TEAM_MANAGEMENT
    ],

    displayFeatures: [
      'Alles aus PRO',
      'Agency Dashboard',
      'Dokumente',
      'Statistiken',
      'Erweiterte Crewsuche',
      'Höhere Event-Kapazitäten'
    ]
  },


  TRIAL: {
    title: 'TRIAL',
    price: '0 €',
    badge: '3 MONATE TEST',
    maxEvents: 5,

    color: 'pink',

    canCreateEvents: true,

    features: [
      FEATURES.PREMIUM_PORTFOLIO,
      FEATURES.GIGSDA_PASS,
      FEATURES.PROMOTION
    ],

    displayFeatures: [
      'Event-Erstellung',
      'Event-Chat',
      'Crew-Management',
      'Rider-Check',
      'Deal-System',
      'Event Planner',
      'Promotion',
      'Premium Portfolio',
      'GIGSDA Pass'
    ]
  }


};

