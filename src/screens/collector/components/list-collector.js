import React from 'react';
import { StyleSheet } from 'react-native';
import { View, FlatList } from "react-native";
import { ItemCollector } from './item-collector';

export const ListCollector = (props) => {
    const { setBalance, data = [], onEndReached, onEndReachedThreshold = 0.9, onPressClose, initialNumToRender, findDebts, navigation } = props;
    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={({ item }) =>
                    <View style={{ borderBottomColor: "black", borderBottomWidth: 1 }}>
                        <ItemCollector setBalance={(amount) => { setBalance(amount) }} item={item} findDebts={findDebts} navigation={navigation} ></ItemCollector>
                    </View>
                }
                keyExtractor={item => "key" + item.cliente_id}
                onEndReached={onEndReached}
                onEndReachedThreshold={onEndReachedThreshold}
                initialNumToRender={initialNumToRender}
            />
        </View>
    );
}

var styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        width:'98%',
        alignSelf:'center'
        
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