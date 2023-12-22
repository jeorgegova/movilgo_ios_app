import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import Modal from "react-native-modal";
import { Options } from './components/options';

const timeOptions = [{
    label: "ejemplo 1", value: "1"
},
{
    label: "ejemplo 2", value: "2"
},
{
    label: "ejemplo 3", value: "3"
},
{
    label: "ejemplo 4", value: "4"
},
{
    label: "ejemplo 5", value: "5"
},
{
    label: "ejemplo 6", value: "6"
},
{
    label: "ejemplo 7", value: "7"
},
{
    label: "ejemplo 8", value: "8"
},
{
    label: "ejemplo 9", value: "9"
},
{
    label: "ejemplo 10", value: "10"
},
{
    label: "ejemplo 11", value: "11"
},
{
    label: "ejemplo 12", value: "12"
},
{
    label: "ejemplo 13", value: "13"
},
{
    label: "ejemplo 14", value: "14"
},
{
    label: "ejemplo 15", value: "15"
},
]

export const SearchPicker = (props) => {
    const { items = timeOptions, value = items[0] ?? '', onChange = () => { }, style = { button: {} } } = props
    const [showOptions, setShowOptions] = useState(false);
    const selectItem = (item) => {
        onChange(item);
        setShowOptions(false);
    }
    return (
        <>
            <TouchableOpacity onPress={() => { setShowOptions(true) }} style={[styles.button, style.button]}>
                <Text style={{ width:'80%', alignSelf: 'center', marginLeft: 16, fontSize: 18 }}>{value.label}</Text>
                <Icon name="sort-down" type="font-awesome-5" size={16} color='#606060' containerStyle={{ width: '20%', paddingRight: 16, marginTop: 0, justifyContent: 'center' }}></Icon>
            </TouchableOpacity>
            <Modal
                style={{ flex: 1 }}
                isVisible={showOptions}
                onRequestClose={() => {
                    setShowOptions(false);
                }}
                onBackButtonPress={() => {
                    setShowOptions(false);
                }}
                onBackdropPress={() => {
                    setShowOptions(false);
                }}
            >
                <Options data={items} onPress={selectItem}></Options>
            </Modal>
        </>
    )
}
export const SearchPickerEconomi = (props) => {
    const { items = timeOptions, value = items[0] ?? '', onChange = () => { }, style = { button: {} } } = props
    const [showOptions, setShowOptions] = useState(false);
    const selectItem = (item) => {
        onChange(item);
        setShowOptions(false);
    }
    return (
        <>
            <TouchableOpacity onPress={() => { setShowOptions(true) }} style={[styles.button2, style.button2]}>
                <Text style={{ width:'80%', alignSelf: 'center', marginLeft: 16, fontSize: 18 }}>{value.label}</Text>
                <Icon name="sort-down" type="font-awesome-5" size={16} color='#606060' containerStyle={{ width: '20%', paddingRight: 16, marginTop: 0, justifyContent: 'center' }}></Icon>
            </TouchableOpacity>
            <Modal
                style={{ flex: 1 }}
                isVisible={showOptions}
                onRequestClose={() => {
                    setShowOptions(false);
                }}
                onBackButtonPress={() => {
                    setShowOptions(false);
                }}
                onBackdropPress={() => {
                    setShowOptions(false);
                }}
            >
                <Options data={items} onPress={selectItem}></Options>
            </Modal>
        </>
    )
}
const styles = StyleSheet.create({
    button: { borderWidth: 1, marginHorizontal: 5, borderRadius: 10, justifyContent: 'space-between', height: 50, flexDirection: 'row' },
    button2: { borderWidth: 1, marginHorizontal: 5, borderRadius: 10, justifyContent: 'space-between', height: 100, flexDirection: 'row' }

})