import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text } from "react-native";
import { Item } from './item';
import { SearchBar } from './searchBar';

export const Options = (props) => {
    const { data = [], onEndReached, onEndReachedThreshold = 0.5, initialNumToRender, onPress } = props;
    const [list, setList] = useState(data);
    const [search, setSearch] = useState("");
    const searchItems = (searchedValue) => {
        if (searchedValue === "") {
            setSearch(searchedValue);
            setList(data);
            return;
        }
        let newList = [];
        data.forEach(element => {
            if (element.label && (element.label.toLowerCase().includes(searchedValue.toLowerCase()))) {
                newList.push(element);
            }
        });
        setSearch(searchedValue);
        setList(newList);
    }
    return (
        <View style={{ marginTop: 10, height:'80%', backgroundColor: 'white', padding: 5, }}>
            <SearchBar
                value={search}
                onChangeText={(value) => searchItems(value)}
            ></SearchBar>
                <FlatList
                    data={list}
                    renderItem={({ item }) =>
                        <Item item={item} onPress={onPress} />
                    }
                    keyExtractor={item => "key" + item.value}
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
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#81a925'
    },
    header: {
        flexDirection: 'row',
        borderBottomColor: "black",
        borderBottomWidth: 1,
        borderTopLeftRadius: 9,
        borderTopRightRadius: 10,
        padding: 10,
        alignItems: 'center',
        backgroundColor: 'black'
    },
    label: {
        fontSize: 15,
        width: '30%',
        fontWeight: 'bold',
        color: 'white'
    },
    containerHorizontal: {
        flexDirection: "row",
        backgroundColor: 'rgba(7,162,186,0.5)',

    },
    searchBarInput: {
        backgroundColor: 'white',
        color: 'black'
    },
    searchBarContainer: {
        borderRadius: 8,
        marginHorizontal: 5,
        backgroundColor: 'white',
        padding: 0,
    }
});