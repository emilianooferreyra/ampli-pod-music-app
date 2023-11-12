import colors from 'src/constants/colors';
import {ReactNode} from 'react';
import {View, StyleSheet, Text} from 'react-native';

interface Props {
  children: ReactNode;
  heading?: string;
  subHeading?: string;
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  heading: {
    color: colors.SECONDARY,
    fontSize: 25,
    fontWeight: 'bold',
    paddingVertical: 5,
  },
  subHeading: {color: colors.CONTRAST, fontSize: 16},
  headerContainer: {width: '100%', marginBottom: 20},
});

export default AuthFormContainer;
