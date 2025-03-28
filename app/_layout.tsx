import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './(tabs)/home';
import Calendar from './(tabs)/calendar';
import Track from './(tabs)/track';
import Analysis from './(tabs)/analysis';
import Profile from './(tabs)/profile';
import Learn from './(tabs)/learn';
import Settings from './(tabs)/settings';
import { Button } from '@react-navigation/elements';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { SettingsProvider } from './settings-context';

const Stack = createStackNavigator();
type RootStackParamList = {
  Home: undefined;
  Calendar: undefined;
  Track: undefined;
  Analysis: undefined;
  Learn: undefined;
  Settings: undefined;
};

const App = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    return (
      <SettingsProvider>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen 
            name="Home" 
            component={Home} 
            options={{
              title: 'Home',
              headerStyle: {
                backgroundColor: '#rgb(0, 150, 136);',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 20,

              },
              headerTitleAlign: 'center',
              headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate('Settings')}
                style={{ marginRight: 15 }}>
                  <Ionicons name="settings" size={21} color="white" />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen 
              name="Calendar" 
              component={Calendar} 
              options={{
                title: 'Calendar',
                headerStyle: {
                  backgroundColor: '#rgb(0, 150, 136);',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 20,
                },
                headerTitleAlign: 'center',
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Settings')}
                  style={{ marginRight: 15 }}>
                    <Ionicons name="settings" size={21} color="white" />
                  </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen 
            name="Learn" 
            component={Learn} 
            options={{
              title: 'Learn',
              headerStyle: {
                backgroundColor: '#rgb(0, 150, 136);',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 20,

              },
              headerTitleAlign: 'center',
              headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate('Settings')}
                style={{ marginRight: 15 }}>
                  <Ionicons name="settings" size={21} color="white" />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen 
            name="Track" 
            component={Track} 
            options={{
              title: 'Track',
              headerStyle: {
                backgroundColor: '#rgb(0, 150, 136);',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 20,

              },
              headerTitleAlign: 'center',
            }}
          />
          <Stack.Screen 
            name="Analysis" 
            component={Analysis} 
            options={{
              title: 'Analysis',
              headerStyle: {
                backgroundColor: '#rgb(0, 150, 136);',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 20,

              },
              headerTitleAlign: 'center',
              headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate('Settings')}
                style={{ marginRight: 15 }}>
                  <Ionicons name="settings" size={21} color="white" />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen 
            name="Settings" 
            component={Settings} 
            options={{
              title: 'Settings',
              headerStyle: {
                backgroundColor: '#rgb(0, 150, 136);',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 20,

              },
              headerTitleAlign: 'center',
            }}
          />
        </Stack.Navigator>  
      </SettingsProvider>

    );
    
};

export default App;