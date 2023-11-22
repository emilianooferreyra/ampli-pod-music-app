import {Provider} from 'react-redux';
import {QueryClient, QueryClientProvider} from 'react-query';
import store from 'src/store';
import Navigator from 'src/navigation';
import AppContainer from '@components/AppContainer';

const queryClient = new QueryClient();

const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppContainer>
          <Navigator />
        </AppContainer>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
