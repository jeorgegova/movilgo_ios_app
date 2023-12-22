import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Input, Icon, Button } from 'react-native-elements';
import { TextInput } from 'react-native-gesture-handler';
import NumberFormat from 'react-number-format';


// Campos de solo texto
export const InputForm = (props) => {
    const { maxLength = 255, title = "", field = {}, type = "", handleChange, placeholder = "", onBlur = () => { }, styleInput = {}, titleStyles = {} } = props
    return (
        <View>
            <Text style={[{ marginLeft: '3%' }, titleStyles]}> <Text >{title}{field.required && <Text style={{ color: "red" }}>*</Text>}</Text></Text>
            <View style={styles.containerInput}>
                <Input
                    placeholderTextColor='black'
                    inputContainerStyle={{ borderBottomWidth: 0 }}
                    labelStyle={{ color: 'black', fontWeight: 'bold', fontSize: 20 }}
                    style={[styles.input, styleInput]}
                    value={field.value}
                    type={type}
                    onChangeText={(e) => handleChange(field.name, e)}
                    onBlur={() => onBlur(field.name)}
                    placeholder={placeholder}
                    maxLength={maxLength}
                >
                </Input>
            </View>
            <Text style={{ marginHorizontal: 16 }}>  <Text style={{ color: "red" }}>{field.error}</Text></Text>
        </View>
    )
}

export const InputFormPassword = (props) => {
    const { setSecureTextEntry, secureTextEntry = true, maxLength = 255, title = "", field = {}, type = "", handleChange, placeholder = "", onBlur = () => { }, styleInput = {}, titleStyles = {} } = props
    return (
        <View>
            <Text style={[{ marginLeft: '3%' }, titleStyles]}> <Text >{title}{field.required && <Text style={{ color: "red" }}>*</Text>}</Text></Text>
            <View style={styles.containerInputPassword}>
                <View style={{ width: '80%' }}>
                    <Input
                        secureTextEntry={secureTextEntry}
                        placeholderTextColor='black'
                        inputContainerStyle={{ borderBottomWidth: 0 }}
                        labelStyle={{ color: 'black', fontWeight: 'bold', fontSize: 20 }}
                        style={[styles.input, styleInput]}
                        value={field.value}
                        type={type}
                        onChangeText={(e) => handleChange(field.name, e)}
                        onBlur={() => onBlur(field.name)}
                        placeholder={placeholder}
                        maxLength={maxLength}
                    >
                    </Input>
                </View>
                <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
                    <Button onPress={setSecureTextEntry} type={'clear'} icon={<Icon type="font-awesome-5" name="eye" />} />
                </View>

            </View>
            <Text style={{ marginHorizontal: 16 }}>  <Text style={{ color: "red" }}>{field.error}</Text></Text>
        </View>
    )
}

export const InputNumber = (props) => {
    const { title = "", field = {}, type = "", handleChange, placeholder = "", onBlur = () => { }, icon = null, onPress = () => { }, keyboardType = "number-pad", errorMessage = ""} = props
    return (
        <View>
            <Text style={{ marginLeft: '3%' }}> <Text >{title}{field.required && <Text style={{ color: "red" }}>*</Text>}</Text></Text>
            <View style={styles.containerInput}>
                <Input
                    placeholderTextColor='black'
                    inputContainerStyle={{ borderBottomWidth: 0 }}
                    labelStyle={{ color: 'black', fontWeight: 'bold', fontSize: 20 }}
                    style={styles.input}
                    value={field.value}
                    type={type}
                    onChangeText={(e) => handleChange(field.name, e.replace(/\D/, ''))}
                    onBlur={() => onBlur(field.name)}
                    placeholder={placeholder}
                    keyboardType={keyboardType}
                    errorMessage={errorMessage}
                    rightIcon={icon && <Button onPress={onPress} type="clear" icon={<Icon type="font-awesome-5" name={icon}></Icon>}></Button>}
                    
                >
                </Input>
            </View>
            <Text style={{ marginHorizontal: 16 }}>  <Text style={{ color: "red" }}>{field.error}</Text></Text>
        </View>


    )
}
export const InputMoney = (props) => {
    const { title = "", field = "", type = "", handleChange, placeholder , onBlur = () => { }, value, inputStyle,errorMessage } = props
    //console.log("props de money",props)
    return (
        <View>
            {/* <Text style={{ marginLeft: '3%' }}> <Text >{title}{field && <Text style={{ color: "red" }}>*</Text>}</Text></Text>
             */}<View style={styles.containerInputNumber}>
                <NumberFormat
                    value={value}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'$ '}
                    renderText={value => (
                        <TextInput
                            onBlur={() => onBlur(field.name)}
                            placeholderTextColor='black'
                            value={value}
                            onChangeText={(valor) => handleChange(field.name, (valor.replace("$", "").replace(",", "").replace(",", "")))}
                            placeholder={placeholder}
                            keyboardType="number-pad"
                            style={[styles.input, inputStyle]}
                            errorMessage={errorMessage} >
                               
                        </TextInput>
                    )}
                />
            </View>
            <Text style={{ marginHorizontal: 16 }}>  <Text style={{ color: "red" }}>{field}</Text></Text>
        </View>
    )
}
const styles = StyleSheet.create({
    input: {
        fontSize: 16, backgroundColor: 'white', borderRadius: 6
    },
    containerInputNumber: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: '90%',
        padding: 5,
        borderWidth: 1,
        marginHorizontal: 12,
        borderRadius: 10,
        borderColor: 'black',


    },
    containerInputPassword: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 10,
        width: '90%',
        borderWidth: 1,
        marginHorizontal: 12,
        borderRadius: 10,
        borderColor: 'black',
        height: 60,
        marginTop: 3,

    },
    containerInput: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: '90%',
        borderWidth: 1,
        marginHorizontal: 12,
        borderRadius: 10,
        borderColor: 'black',
        height: 60,
        marginTop: 3,

    },
})