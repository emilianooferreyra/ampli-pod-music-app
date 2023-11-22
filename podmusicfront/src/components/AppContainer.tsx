import {SafeAreaView, StyleSheet} from 'react-native';
import Notification from './Notification';

interface Props {
  children: React.ReactNode;
}

const AppContainer = ({children}: Props) => {
  return (
    <SafeAreaView style={styles.container}>
      <Notification />
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AppContainer;
