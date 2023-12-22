import { StyleSheet } from "react-native";

const stylesLarge = StyleSheet.create({
  containerInput: {
      width: '100%',
      backgroundColor: 'white',
      marginVertical: '1%',
      borderRadius: 10,
      borderBottomWidth: 0
  },
  header: {
      height: '100%',
      width: '100%'
  },
  headerLogo: {
      marginHorizontal: '20%',
      width: '60%',
      aspectRatio: 1,
  },
  button: {
      marginHorizontal: 10,
      backgroundColor: 'rgba(7,162,186,0.7)',
      marginVertical: '1%',
      borderRadius: 10
  },
  text: {
      fontSize: 20,
      margin: 10
  },
  title: {
      fontSize: 25,
      fontWeight: "bold",
      marginTop: 4,
      marginBottom: 0
  },
  loading: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center'
  },
  buttonPrice: {
      borderRadius: 10,
      marginVertical: '1%',
      borderBottomWidth: 0,
      minHeight: 30,
      marginHorizontal: 10,
  },
  input: {
      fontSize: 40,
      backgroundColor: 'white',
      borderRadius: 6,
      marginBottom: 10,
      marginTop: 20
  },
  titleModal: {
      alignSelf: "center",
      alignItems: "center",
      fontSize: 20,
      marginTop: 10,
      fontWeight: 'bold',
      color: 'white'
  },
  inputModal: {
      fontSize: 20,
      backgroundColor: 'white',
      marginBottom: 10,
      marginTop: 20,
      borderRadius: 6
  },
  containerInfoGreen: {
      borderRadius: 10,
      marginHorizontal: 10,
      marginVertical: 10,
      backgroundColor: 'rgba(7, 162, 186, 0.9)'
  },
  icon: {
      fontSize: 50
  },
});

const stylesMedium = StyleSheet.create({
  containerInput: {
      width: '100%',
      backgroundColor: 'white',
      marginVertical: '1%',
      borderRadius: 10,
      borderBottomWidth: 0
  },
  header: {
      height: '100%',
      width: '100%'
  },
  headerLogo: {
      marginHorizontal: '20%',
      width: '60%',
      aspectRatio: 1,
  },
  button: {
      marginHorizontal: 10,
      backgroundColor: 'rgba(7,162,186,0.7)',
      marginVertical: '1%',
      borderRadius: 10
  },
  text: {
      fontSize: 18,
      margin: 10
  },
  title: {
      fontSize: 18,
      fontWeight: "bold",
      marginTop: 4,
      marginBottom: 0
  },
  loading: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center'
  },
  buttonPrice: {
      borderRadius: 10,
      marginVertical: '1%',
      borderBottomWidth: 0,
      marginHorizontal: 10,
  },
  input: {
      fontSize: 22,
      backgroundColor: 'white',
      borderRadius: 6,
      marginBottom: 10,
      marginTop: 20
  },
  titleModal: {
      alignSelf: "center", alignItems: "center", fontSize: 18, marginTop: 10, fontWeight: 'bold', color: 'white'
  },
  inputModal: {
      fontSize: 18,
      backgroundColor: 'white',
      marginBottom: 10,
      marginTop: 20,
      borderRadius: 6,
  },
  containerInfoGreen: {
      backgroundColor: '#02606e'
  },
  icon: {
      fontSize: 24
  },
});

export {stylesLarge, stylesMedium};
