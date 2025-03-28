import { TouchableOpacity, Text, StyleSheet } from "react-native";

const TabButton = ({text, isSelected}) => {
    return (
        <TouchableOpacity
        style={{
            borderRadius: 0,
            backgroundColor: '#f8f8f9',
            color: (isSelected ? '#009688' : 'grey'),
            fontWeight: (isSelected ? 'bolder' : 'unset'),
            borderBottomStyle: 'solid',
            borderBottomColor: (isSelected ? '#009688' : '#d8d8d8'),
            borderBottomWidth: (isSelected ? 'thick' : 'thin'),
            margin: 0,
            padding: '0.5em',
        }}
        >
            <Text>{text}</Text>
        </TouchableOpacity>
    );
}

export default TabButton;