import { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { observer } from '@legendapp/state/react';
import { addTodo, clearCompletedTodos, deleteTodo, todos$ as _todos$, toggleDone } from './utils/SupaLegend';
import { Tables } from './utils/database.types';

// Emojis to decorate each todo.
const NOT_DONE_ICON = String.fromCodePoint(0x1f7e0);
const DONE_ICON = String.fromCodePoint(0x2705);

// The text input component to add a new todo.
const NewTodo = () => {
  const [text, setText] = useState('');
  const handleSubmitEditing = ({ nativeEvent: { text } }) => {
    setText('');
    addTodo(text);
  };
  return (
    <TextInput
      value={text}
      onChangeText={(text) => setText(text)}
      onSubmitEditing={handleSubmitEditing}
      placeholder="What do you want to do today?"
      style={styles.input}
    />
  );
};

// A single todo component, either 'not done' or 'done': press to toggle.
const Todo = ({ todo }: { todo: Tables<'todos'> }) => {
  const handlePress = () => {
    toggleDone(todo.id);
  };
  const handleDelete = () => {
    deleteTodo(todo.id)
  }
  return (
    <View key={todo.id} style={styles.todoWrapper}>
      <TouchableOpacity
        onPress={handlePress}
        style={[styles.todo, todo.done ? styles.done : null]}
      >
        <Text style={styles.todoText}>
          {todo.done ? DONE_ICON : NOT_DONE_ICON} {todo.text}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleDelete} style={styles.delete}>
        <Text style={styles.deleteIcon}>❌</Text>
      </TouchableOpacity>
    </View>
  );
};

// A list component to show all the todos.
const Todos = observer(({ todos$ }: { todos$: typeof _todos$ }) => {
  // Get the todos from the state and subscribe to updates
  const todos = todos$.get();
  const renderItem = ({ item: todo }: { item: Tables<'todos'> }) => (
    <Todo todo={todo} />
  );
  if (todos)
    return (
      <FlatList
        data={Object.values(todos)}
        renderItem={renderItem}
        style={styles.todos}
      />
    );

  return <></>;
});

// A button component to delete all completed todos, only shows when there are some.
const ClearTodos = observer(({ todos$ }: { todos$: typeof _todos$ }) => {
  return todos$ && Object.values(todos$).length >= 1 ? (
    <TouchableOpacity onPress={clearCompletedTodos}>
      <Text style={styles.clearTodos}>Clear completed todos</Text>
    </TouchableOpacity>
  ) : null;
});

// The main app.
const App = observer(() => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.heading}>Legend-State Example</Text>
        <NewTodo />
        <Todos todos$={_todos$} />
        <ClearTodos todos$={_todos$} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
});

// Styles for the app.
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    margin: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderColor: '#999',
    borderRadius: 8,
    borderWidth: 2,
    flex: 0,
    height: 64,
    marginTop: 16,
    padding: 16,
    fontSize: 20,
  },
  todos: {
    flex: 1,
    marginTop: 16,
  },
  todo: {
    borderRadius: 8,
    flex: 1,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#ffd',
  },
  todoWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  done: {
    backgroundColor: '#dfd',
  },
  todoText: {
    fontSize: 20,
  },
  deleteIcon: {
    fontSize: 20,
  },
  delete: {
    padding: 16,
  },
  clearTodos: {
    margin: 16,
    flex: 0,
    textAlign: 'center',
    fontSize: 16,
  },
});

export default App;
