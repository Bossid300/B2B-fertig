import { ACHIEVEMENTS }
from './achievementConfig';

export const achievementService = {

  getCompletedEvents(events = []) {

    return events.filter(
      ev => ev && ev.archived === true
    ).length;

  },

  getCurrentAchievement(events = []) {

    const completed =
      this.getCompletedEvents(events);

    let current =
      ACHIEVEMENTS[0];

    ACHIEVEMENTS.forEach(item => {

      if (
        completed >= item.requiredEvents
      ) {
        current = item;
      }

    });

    return current;

  }

};