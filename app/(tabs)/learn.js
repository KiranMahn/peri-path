import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
const Learn = () => {

    const [selected, setSelected] = useState("For You");


    const TabButton = ({text, isSelected}) => {
        console.log("isSelected", isSelected);
        return (
            <TouchableOpacity
            style={{
                borderRadius: 0,
                backgroundColor: '#f8f8f9',
                borderBottomStyle: 'solid',
                borderBottomColor: (isSelected ? '#009688' : '#d8d8d8'),
                borderBottomWidth: (isSelected ? 7 : 3),
                margin: 0,
                padding: 10,
                // maxWidth: '30%',
                height: 'min-content',
            }}
            >
                <Text
                style={{
                    color: (isSelected ? '#009688' : 'grey'),
                    fontWeight: (isSelected ? 'bolder' : 'unset'),
                    fontSize: 20,
                }}>{text}</Text>
            </TouchableOpacity>
        );
    }

    return (
        <View style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            

            <ScrollView style={styles.ScrollView} horizontal={true} showsHorizontalScrollIndicator={false}>
                <TabButton text={"For You"} isSelected={selected === "For You"}/>
                <TabButton text={"Trending"} isSelected={selected === "Trending"}/>
                <TabButton text={"Recent"} isSelected={(selected == "Recent")}/>
                <TabButton text={"Symptom Relief"} isSelected={(selected == "Symptom Relief")}/>
                <TabButton text={"Menopause Stages"} isSelected={(selected == "Menopause Stages")}/>
            </ScrollView>

            <View style={styles.container}>

                <TouchableOpacity>
                    <Text>Article</Text>
                </TouchableOpacity>
                
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    ScrollView: {
        display: 'flex', 
        flexDirection: 'row', 
        height: '100vh',
        overflowY: 'scroll',
        width: '100%',
        flex: 1,        
    },
    container: {
        flex: 12, 
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        overflowY: 'scroll',

    }
});
export default Learn;