import { PLAN_CONFIG } from './subscriptionPlans';

export const subscriptionService = {

  getPlan() {
    return 'COMMUNITY';
  },

  canCreateEvent() {
    const plan = this.getPlan();

    return PLAN_CONFIG[plan]?.canCreateEvents === true;
  },

  hasFeature(feature) {
    const plan = this.getPlan();

    return PLAN_CONFIG[plan]?.features?.includes(feature);
  },

};