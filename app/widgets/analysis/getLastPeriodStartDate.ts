export const getLastPeriodStartDate = (periodDates: string[]): string => {
    if (periodDates.length === 0) {
        return 'No period data available.';
    }

    let lastPeriodStart = periodDates[0];
    for (let i = 1; i < periodDates.length; i++) {
        const prevDate = new Date(periodDates[i - 1]);
        const currentDate = new Date(periodDates[i]);
        const daysBetween = (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

        if (daysBetween > 1) {
            lastPeriodStart = periodDates[i];
        }
    }

    return new Date(lastPeriodStart).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
};