import colors from '@utils/colors';
import {StyleSheet, View, Text} from 'react-native';

interface Props {
  heading?: string;
  subHeading?: string;
  children: React.ReactNode;
}

const AuthFormContainer = ({children, heading, subHeading}: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>{heading}</Text>
        <Text style={styles.subHeading}>{subHeading}</Text>
      </View>

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerContainer: {
    width: '100%',
    marginBottom: 20,
  },
  heading: {
    color: colors.CONTRAST,
    fontSize: 25,
    fontWeight: 'bold',
    paddingVertical: 10,
  },
  subHeading: {
    color: colors.CONTRAST,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AuthFormContainer;
