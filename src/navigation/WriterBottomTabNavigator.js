import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WriterNavigator from './WriterNavigator';
import WriteStack from './WriteStack';

const Tab = createBottomTabNavigator();

export default function WriterBottomTabNavigator() {
    const { colors } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                        return <Ionicons name={iconName} size={size} color={color} />;
                    } else if (route.name === 'Write') {
                        iconName = focused ? 'create' : 'create-outline';
                        return <Ionicons name={iconName} size={size} color={color} />;
                    } else if (route.name === 'Drafts') {
                        return <MaterialCommunityIcons 
                            name={focused ? 'file-document' : 'file-document-outline'} 
                            size={size} 
                            color={color} 
                        />;
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                        return <Ionicons name={iconName} size={size} color={color} />;
                    }
                },
                tabBarActiveTintColor: '#4B59B3',
                tabBarInactiveTintColor: '#999',
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 1,
                    borderTopColor: '#F0F0F0',
                    paddingBottom: 5,
                    paddingTop: 5,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontFamily: 'CoFoRaffineMedium',
                },
            })}
        >
            <Tab.Screen 
                name="Home" 
                component={WriterNavigator} 
                options={{
                    tabBarLabel: 'Home',
                }}
            />
            <Tab.Screen 
                name="Write" 
                component={WriteStack} 
                options={{
                    tabBarLabel: 'Write',
                }}
            />
            <Tab.Screen 
                name="Drafts" 
                component={WriterNavigator} 
                options={{
                    tabBarLabel: 'Drafts',
                }}
            />
            <Tab.Screen 
                name="Settings" 
                component={WriterNavigator} 
                options={{
                    tabBarLabel: 'Settings',
                }}
            />
        </Tab.Navigator>
    );
}