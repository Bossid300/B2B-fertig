export const progressService = {
  getProgress(event) {
    if (!event) {
      return {
        shortlist: 0,
        stage: 0,
        contract: 0,
        planner: 0,
        promotion: 0,
        countdown: 0
      };
    }

    const crewProgress =
      event.crewIds?.length > 1 ? 100 : 50;

    const stageProgress =
      event.crewIds?.length > 0
        ? Math.round(
            (
              Object.values(
                event.riderCenter || {}
              ).filter(r => r?.confirmed).length /
              event.crewIds.length
            ) * 100
          )
        : 0;

    const contractProgress =
      event.dealSent
        ? Math.round(
            (
              Object.keys(
                event.acceptedDeals || {}
              ).length /
              (event.crewIds?.length || 1)
            ) * 100
          )
        : 0;

    const plannerProgress =
      event.plannerLocked ? 100 : 50;

    const promotionProgress =
      event.promotionData?.title ? 100 : 0;

    const countdownProgress = Math.round(
      (
        crewProgress +
        stageProgress +
        contractProgress +
        plannerProgress +
        promotionProgress
      ) / 5
    );

    return {
      shortlist: crewProgress,
      stage: stageProgress,
      contract: contractProgress,
      planner: plannerProgress,
      promotion: promotionProgress,
      countdown: countdownProgress
    };
  }
};