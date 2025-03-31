import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const renderDayBox = (day) => {
    const dateString = day.toDateString();
    const dayData = userData[dateString] || {};
    const periodLevel = dayData.period;

    const symptomKeys = Object.keys(dayData).filter(slider => (dayData[slider] !== 'None') && (dayData[slider] !== ''));
    const symptomDots = symptomKeys.slice(0, 4).map((slider) => (
        <View key={slider} style={[styles.symptomDot, { backgroundColor: getColor(dayData[slider]) }]} />
    ));
    const showPlus = symptomKeys.length > 4;

    const isFutureDate = day > new Date(); // Check if the date is in the future

    // Get the first letter of the day of the week (e.g., "M" for Monday)
    const dayOfWeek = day.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);

    return (
        <TouchableOpacity
            key={dateString}
            onPress={!isFutureDate ? () => navigation.navigate('Track', { date: day }) : null} // Disable onPress for future dates
            style={[
                styles.dayBox,
                isFutureDate && styles.futureDayBox, // Apply greyed-out style for future dates
            ]}
            testID="day-box"
        >
            {/* Day of the week in the top-left corner */}
            <Text style={[styles.dayOfWeek, {color: settings.highContrast ? 'white' : 'rgb(173, 173, 173)'}]}>{dayOfWeek}</Text>

            <Text
                style={[
                    styles.dayText,
                    { fontSize: settings.largeText ? 17 : 14, color: isFutureDate ? '#ccc' : settings.highContrast ? '#fff' : '#000' }, // Grey out text for future dates
                ]}
            >
                {day.getDate()}
            </Text>
            {!isFutureDate && periodLevel && (
                <View style={[styles.periodIndicator, { backgroundColor: getPeriodColor(periodLevel) }]} />
            )}
            <View style={styles.symptomIndicators}>
                {!isFutureDate && symptomDots}
                {!isFutureDate && showPlus && <Ionicons name="circle-with-plus" size={8} color="red" />}
            </View>
        </TouchableOpacity>
    );
};


export {renderDayBox};