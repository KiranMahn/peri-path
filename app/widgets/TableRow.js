import { Text, View } from "react-native";

const TableRow = ({field, value}) => {
    return (
        <View style={{display: 'flex', width: '100%', justifyContent: 'space-between', padding: '0.5em', borderBottomColor: '#d8d8d8', borderBottomWidth: 'thin', borderBottomStyle: 'solid'}}>

            <Text>{field}: </Text>
            <Text>{value}</Text>
            
        </View>
    );
}

export default TableRow;