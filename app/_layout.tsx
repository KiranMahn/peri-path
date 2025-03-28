import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './(tabs)/home';
import Calendar from './(tabs)/calendar';
import Track from './(tabs)/track';
import Analysis from './(tabs)/analysis';
import Profile from './(tabs)/profile';
import Learn from './(tabs)/learn';
const Stack = createStackNavigator();

const App = () => {
    return (
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
            },
            headerTitleAlign: 'center',
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
              },
              headerTitleAlign: 'center',
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
            },
            headerTitleAlign: 'center',
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
            },
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen 
          name="Profile" 
          component={Profile} 
          options={{
            title: 'Profile',
            headerStyle: {
              backgroundColor: '#rgb(0, 150, 136);',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerTitleAlign: 'center',
          }}
        />
      </Stack.Navigator>
    );
};

export default App;