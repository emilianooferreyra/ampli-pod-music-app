import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import AuthNavigator from './src/navigation/AuthNavigator';
import store from 'src/store';

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
