import { StyleSheet } from 'react-native';

const stylesLarge = StyleSheet.create({
  background: {
    height: '100%',
    width: '100%',
  },
  containerRowInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  containerInput: {
    width: '100%',
    backgroundColor: 'white',
    marginVertical: '1%',
    borderRadius: 10,
    borderBottomWidth: 0,
  },
  containerContent: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  containerPriceButton: {
    width: '33%',
  },
  header: {
    height: '100%',
    width: '100%',
  },
  headerLogo: {
    marginHorizontal: '20%',
    width: '60%',
    aspectRatio: 1,
  },
  headerLogoContainer: {
    position: 'absolute',
    height: '50%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    bottom: 0,
    position: 'absolute',
    height: '14%',
    width: '100%',
  },
  button: {
    marginHorizontal: 10,
    backgroundColor: 'rgba(7,162,186,0.7)',
    marginVertical: '1%',
    borderRadius: 10,
  },
  buttonConfig: {
    width: 42,
    marginVertical: '4%',
  },
  text: {
    fontSize: 20,
    margin: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 0,
  },
  loading: {
    left: 0,
    right: 0,
    top: '-50%',
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
  containerButtonPrice: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  titleButton: {
    fontSize: 25,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginVertical: 10,
    color: 'white',
  },
  input: {
    fontSize: 40,
    backgroundColor: 'white',
    borderRadius: 6,
    marginBottom: 10,
    marginTop: 20,
  },
  titleModal: {
    alignSelf: 'center',
    alignItems: 'center',
    fontSize: 20,
    marginTop: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  inputModal: {
    fontSize: 20,
    backgroundColor: 'white',
    marginBottom: 10,
    marginTop: 20,
    borderRadius: 6,
  },

  containerInputModal: {
    fontSize: 23,
    width: '100%',
    backgroundColor: 'white',
    marginVertical: '1%',
    borderRadius: 10,
    borderBottomWidth: 0,
  },
  containerInfoGreen: {
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 10,
    backgroundColor: 'rgba(7, 162, 186, 0.7)',
  },
  icon: {
    fontSize: 50,
  },
});

const stylesMedium = StyleSheet.create({
  background: {
    height: '100%',
    width: '100%',
  },
  containerRowInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  containerInput: {
    width: '100%',
    backgroundColor: 'white',
    marginVertical: '1%',
    borderRadius: 10,
    borderBottomWidth: 0,
  },
  containerContent: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  containerPriceButton: {
    width: '33%',
  },
  header: {
    height: '100%',
    width: '100%',
  },
  headerLogo: {
    marginHorizontal: '20%',
    width: '60%',
    aspectRatio: 1,
  },
  headerLogoContainer: {
    position: 'absolute',
    height: '50%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    bottom: 0,
    position: 'absolute',
    height: '14%',
    width: '100%',
  },
  button: {
    marginHorizontal: 10,
    backgroundColor: 'rgba(7,162,186,0.7)',
    marginVertical: '1%',
    borderRadius: 10,
  },
  buttonConfig: {
    width: 42,
    marginVertical: '4%',
  },
  text: {
    fontSize: 18,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 0,
  },
  loading: {
    left: 0,
    right: 0,
    top: '-50%',
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
  containerButtonPrice: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  titleButton: {
    fontSize: 18,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginVertical: 10,
    color: 'white',
  },
  input: {
    fontSize: 22,
    backgroundColor: 'white',
    borderRadius: 6,
    marginBottom: 10,
    marginTop: 20,
  },
  titleModal: {
    alignSelf: 'center',
    alignItems: 'center',
    fontSize: 18,
    marginTop: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  containerInputModal: {
    fontSize: 20,
    width: '100%',
    backgroundColor: 'white',
    marginVertical: '1%',
    borderRadius: 10,
    borderBottomWidth: 0,
  },
  inputModal: {
    fontSize: 18,
    backgroundColor: 'white',
    marginBottom: 10,
    marginTop: 20,
    borderRadius: 6,
  },
  containerInfoGreen: {
    backgroundColor: 'rgba(7, 162, 186, 0.7)',
  },
  icon: {
    fontSize: 24,
  },
});

export {stylesLarge, stylesMedium};
