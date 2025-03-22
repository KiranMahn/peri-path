import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './(tabs)/home';
import Calendar from './(tabs)/calendar';
import Track from './(tabs)/track';
import Analysis from './(tabs)/analysis';
import Profile from './(tabs)/profile';
const Stack = createStackNavigator();

const App = () => {
    return (
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Calendar" component={Calendar} />
        <Stack.Screen name="Track" component={Track} />
        <Stack.Screen name="Analysis" component={Analysis} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    );
};

export default App;