import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

type RootStackParamList = {
    Home: undefined;
    Calendar: undefined;
    Track: undefined;
    Analysis: undefined;
    Learn: undefined;
};

type NavButtonProps = {
    screen: keyof RootStackParamList; // Restrict screen names to valid navigation keys
    label: string;
    icon: string;
};

const NavButton: React.FC<NavButtonProps> = ({ screen, label, icon }) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    return (
        <TouchableOpacity onPress={() => navigation.navigate(screen)} style={styles.navButton}>
            <Icon name={icon} size={20} style={styles.icon} />
            <Text>{label}</Text>
        </TouchableOpacity>
    );
};

const Nav = () => {
    return (
        <View style={styles.navContainer}>
            <NavButton screen="Home" label="Home" icon="home" />
            <NavButton screen="Calendar" label="Calendar" icon="calendar" />
            <NavButton screen="Track" label="Track" icon="clipboard-list" />
            <NavButton screen="Analysis" label="Analysis" icon="line-chart" />
            <NavButton screen="Learn" label="Learn" icon="book" />
        </View>
    );
};

const styles = StyleSheet.create({
    navContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#f8f8f8',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    navButton: {
        alignItems: 'center',
    },
    icon: {
        marginBottom: 5,
    },
});

export default Nav;
