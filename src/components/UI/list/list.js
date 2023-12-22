import React from 'react';
import { ItemMoves, ItemError, ItemCollector, ItemReport } from "./item";
import { View, FlatList, StyleSheet, Text, Image } from "react-native";
import { Button, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';


export const ListMoves = (props) => {
    const { data = [], onEndReached, onEndReachedThreshold = 0.5, onPressClose, initialNumToRender } = props;
    return (
        <View style={styles.container}>
            <View style={{ backgroundColor: '#02606e', paddingVertical: 10 }}>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ width: '20%' }}></View>
                    <View style={{ width: '60%' }}>
                        <Text style={styles.title}>Movimientos</Text>
                    </View>
                    <View style={{ width: '20%' }}>
                        <Button
                            buttonStyle={{ width: 40, alignSelf: "flex-end", marginRight: 10 }}
                            type="clear"
                            icon={<Icon name="close" size={24} color='white' ></Icon>}
                            onPress={onPressClose}
                        ></Button>
                    </View>
                </View>
            </View>
            <FlatList
                data={data}
                renderItem={({ item }) =>
                    <View style={{ borderBottomColor: "black", borderBottomWidth: 1, marginHorizontal: 10 }}>
                        <ItemMoves item={item}></ItemMoves>
                    </View>
                }
                keyExtractor={item => "key"+item.id}
                onEndReached={onEndReached}
                onEndReachedThreshold={onEndReachedThreshold}
                initialNumToRender={initialNumToRender}
            />
        </View>
    );
}

export const ListError = (props) => {
    const { data = [], onEndReached, onEndReachedThreshold = 0.5, onPressClose, initialNumToRender } = props;
    return (
        <View style={styles.container}>
            <View style={{ backgroundColor: '#02606e', paddingVertical: 10 }}>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ width: '20%' }}></View>
                    <View style={{ width: '60%' }}>
                        <Text style={styles.title}>Errores</Text>
                    </View>
                    <View style={{ width: '20%' }}>
                        <Button
                            buttonStyle={{ width: 40, alignSelf: "flex-end", marginRight: 10 }}
                            type="clear"
                            icon={<Icon name="close" size={24} color='white' ></Icon>}
                            onPress={onPressClose}
                        ></Button>
                    </View>
                </View>
            </View>
            <FlatList
                data={data}
                renderItem={({ item }) =>
                    <View style={{ borderBottomColor: "black", borderBottomWidth: 1, marginHorizontal: 10 }}>
                        <ItemError item={item}></ItemError>
                    </View>
                }
                keyExtractor={item => 'key' + item.id}
                onEndReached={onEndReached}
                onEndReachedThreshold={onEndReachedThreshold}
                initialNumToRender={initialNumToRender}
            />
        </View>
    );
}

export const ListReport = (props) => {
    const { data = [], onEndReached, onEndReachedThreshold = 0.5, onPressClose, initialNumToRender } = props;
    return (

        <View style={styles.container}>
            <View style={{ backgroundColor: '#02606e', paddingVertical: 10 }}>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ width: '20%' }}></View>
                    <View style={{ width: '60%' }}>
                        <Text style={styles.title}>Resumen caja</Text>
                    </View>
                    <View style={{ width: '20%' }}>
                        <Button
                            buttonStyle={{ width: 40, alignSelf: "flex-end", marginRight: 10 }}
                            type="clear"
                            icon={<Icon name="close" size={24} color='white' ></Icon>}
                            onPress={onPressClose}
                        ></Button>
                    </View>
                </View>
            </View>

            <View style={styles.containerHorizontal}>
                <View style={[styles.containerText, { width: "34%" }]}>
                    <Text style={styles.titleHeader}>Producto</Text>
                </View>
                <View style={[styles.containerText, { width: "32%" }]}>
                    <Text style={[styles.titleHeader, { alignSelf: "center" }]}>Cantidad</Text>
                </View>
                <View style={[styles.containerText, { width: "34%" }]}>
                    <Text style={styles.titleHeader}>Valor</Text>
                </View>
            </View>

            <FlatList

                data={data}
                renderItem={({ item }) =>
                    <View style={{ borderBottomColor: "black", borderBottomWidth: 1, marginHorizontal: 10 }}>

                        <ItemReport item={item}></ItemReport>
                    </View>
                }
                keyExtractor={item => 'key' + item.id}
                onEndReached={onEndReached}
                onEndReachedThreshold={onEndReachedThreshold}
                initialNumToRender={initialNumToRender}
            />
        </View>
    );
}

var styles = StyleSheet.create({
    container: {
        backgroundColor: "white"
    },
    title: {
        alignSelf: "center", alignItems: "center", fontSize: 20, marginTop: 10, fontWeight: 'bold', color: 'white'
    },
    containerHorizontal: {
        flexDirection: "row",
        backgroundColor: 'rgba(7,162,186,0.5)',

    },
    titleHeader: {
        marginHorizontal: 12,
        fontSize: 14,
        fontWeight: "bold",
        marginTop: 4,
        marginBottom: 5
    },
    input: {
        fontSize: 20,
    },
});