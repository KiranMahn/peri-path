import React, {useContext} from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SettingsContext } from '../settings-context';

// Nav Bar

type RootStackParamList = {
    Home: undefined;
    Calendar: undefined;
    Track: undefined;
    Analysis: undefined;
    Learn: undefined;
    Settings: undefined;
};

type NavButtonProps = {
    screen: keyof RootStackParamList; 
    label: string;
    icon: string;
};

const NavButton: React.FC<NavButtonProps> = ({ screen, label, icon }) => {

    const context = useContext(SettingsContext);

    if (!context) {
        throw new Error('SettingsContext is not provided');
    }
    const { settings } = context;

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    return (
        <TouchableOpacity onPress={() => navigation.navigate(screen)} style={[styles.navButton, { width: screen === 'Track' ? '12%' : undefined }]}>

            <Icon name={icon} size={screen === "Track" ? 50 : 25} style={[styles.icon, {color: settings.highContrast ? 'white' : screen === 'Track' ? '#009668' : 'black'}, {position: screen === 'Track' ? 'absolute' : undefined}, {bottom:screen === 'Track' ? 15 : undefined}]} />
            <Text style={{color: settings.highContrast ? 'white' : 'black', fontWeight: 'bold'}}>{label}</Text>

        </TouchableOpacity>
    );
};

const Nav = () => {
    const context = useContext(SettingsContext);
    
    if (!context) {
        throw new Error('SettingsContext is not provided');
    }
    const { settings } = context;

    return (
        <View style={[styles.navContainer, { backgroundColor: settings.highContrast ? '#555' : 'white', borderTopColor: settings.highContrast ? '#444' : '#ddd' }]}>
            <NavButton screen="Home" label="Home" icon="home" />
            <NavButton screen="Calendar" label="Calendar" icon="calendar" />
            <NavButton screen="Track" label="Track" icon="plus-circle" />
            <NavButton screen="Analysis" label="Analysis" icon="line-chart" />
            <NavButton screen="Learn" label="Learn" icon="book" />
        </View>
    );
};

const styles = StyleSheet.create({
    navContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        backgroundColor: '#f8f8f8',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        width: '100%',
        bottom: 10,
        paddingHorizontal: 17,
    },
    navButton: {
        alignItems: 'center',
    },
    icon: {
        marginBottom: 5,
    },
});

export default Nav;
