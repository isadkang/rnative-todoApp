import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

import IonIcons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

export interface Todo {
    done: boolean;
    id: string;
    title: string;
}

const List = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [todo, setTodo] = useState('');

    const addTodo = async () => {
        const newTodo = {
            id: new Date().toISOString(),
            title: todo,
            done: false
        };

        const updatedTodos = [...todos, newTodo];
        setTodos(updatedTodos);
        setTodo('');

        try {
            await AsyncStorage.setItem('todos', JSON.stringify(updatedTodos));
        } catch (error) {
            console.error('Error saving todos to AsyncStorage:', error);
        }
    }

    useEffect(() => {
        const loadTodos = async () => {
            try {
                const storedTodos = await AsyncStorage.getItem('todos');
                if (storedTodos) {
                    setTodos(JSON.parse(storedTodos));
                }
            } catch (error) {
                console.error('Error loading todos from AsyncStorage:', error);
            }
        };

        loadTodos();
    }, []);

    const toggleDone = (id: string) => {
        const updatedTodos = todos.map((item) =>
            item.id === id ? { ...item, done: !item.done } : item
        );
        setTodos(updatedTodos);

        AsyncStorage.setItem('todos', JSON.stringify(updatedTodos));
    };

    const deleteItem = (id: string) => {
        const updatedTodos = todos.filter((item) => item.id !== id);
        setTodos(updatedTodos);

        AsyncStorage.setItem('todos', JSON.stringify(updatedTodos));
    };

    const renderTodo = ({ item }: { item: Todo }) => (
        <View style={styles.todoContainer}>
            <TouchableOpacity onPress={() => toggleDone(item.id)} style={styles.todo}>
                {item.done && <IonIcons name="checkmark-circle" size={32} color="green" />}
                {!item.done && <Entypo name="circle" size={32} color="black" />}
                <Text style={styles.todoText}>{item.title}</Text>
            </TouchableOpacity>
            <IonIcons
                name="trash-bin-outline"
                size={24}
                color="red"
                onPress={() => deleteItem(item.id)}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Add new todo"
                    onChangeText={(text: string) => setTodo(text)}
                    value={todo}
                />
                <Button onPress={addTodo} title="Add" disabled={todo === ''} />
            </View>
            {todos.length > 0 && (
                <View>
                    <FlatList data={todos} renderItem={renderTodo} keyExtractor={(todo) => todo.id} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20
    },
    form: {
        marginVertical: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff'
    },
    todo: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center'
    },
    todoText: {
        flex: 1,
        paddingHorizontal: 4
    },
    todoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        marginVertical: 4
    }
});

export default List;
