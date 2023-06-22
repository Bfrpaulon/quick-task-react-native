import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import tw from 'tailwind-react-native-classnames';
import { Transition, Transitioning } from 'react-native-reanimated';

const App = () => {
  // Estado para armazenar o texto da tarefa
  const [taskText, setTaskText] = useState('');
  // Estado para armazenar a lista de tarefas
  const [taskList, setTaskList] = useState([]);
  // Estado para armazenar a lista de tarefas filtrada
  const [filteredTaskList, setFilteredTaskList] = useState([]);
  // Estado para armazenar o filtro selecionado
  const [selectedFilter, setSelectedFilter] = useState('all');
  // Referência para o componente de transição
  const transitionRef = useRef();

  useEffect(() => {
    // Filtra as tarefas sempre que a lista de tarefas ou o filtro selecionado mudar
    filterTasks(selectedFilter);
  }, [taskList, selectedFilter]);

  const addTask = () => {
    if (taskText.trim() !== '') {
      const newTask = {
        id: Date.now().toString(),
        text: taskText,
        completed: false,
      };

      // Adiciona a nova tarefa à lista de tarefas
      setTaskList((prevTaskList) => [...prevTaskList, newTask]);
      // Limpa o texto da tarefa
      setTaskText('');
    }
  };

  const toggleComplete = (taskId) => {
    // Altera o estado de completude da tarefa com base no ID da tarefa
    setTaskList((prevTaskList) =>
      prevTaskList.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const editTask = (taskId, text) => {
    // Altera o texto da tarefa com base no ID da tarefa
    setTaskList((prevTaskList) =>
      prevTaskList.map((task) =>
        task.id === taskId ? { ...task, text, editing: true } : task
      )
    );
  };

  const saveTask = (taskId) => {
    // Salva a tarefa editada com base no ID da tarefa
    setTaskList((prevTaskList) =>
      prevTaskList.map((task) =>
        task.id === taskId ? { ...task, editing: false } : task
      )
    );
  };

  const deleteTask = (taskId) => {
    // Remove a tarefa com base no ID da tarefa
    setTaskList((prevTaskList) =>
      prevTaskList.filter((task) => task.id !== taskId)
    );
  };

  const filterTasks = (filter) => {
    // Define o filtro selecionado
    setSelectedFilter(filter);

    if (filter === 'completed') {
      // Filtra as tarefas concluídas
      setFilteredTaskList(taskList.filter((task) => task.completed));
    } else if (filter === 'all') {
      // Mostra todas as tarefas
      setFilteredTaskList(taskList);
    } else {
      // Filtra as tarefas não concluídas
      setFilteredTaskList(taskList.filter((task) => !task.completed));
    }
  };

  const renderTask = ({ item }) => {
    return (
      <Transitioning.View
        ref={transitionRef}
        transition={transition}
        style={tw`p-4 mb-4 bg-white rounded-lg flex-row justify-between items-center`}
      >
        <TouchableOpacity onPress={() => toggleComplete(item.id)}>
          <Ionicons
            name={item.completed ? 'md-checkbox-outline' : 'md-square-outline'}
            size={24}
            color={item.completed ? '#4CAF50' : '#333333'}
          />
        </TouchableOpacity>
        <TextInput
          style={tw`flex-1 ml-2 text-gray-800`}
          value={item.text}
          editable={item.editing}
          onChangeText={(text) => editTask(item.id, text)}
          onSubmitEditing={() => saveTask(item.id)}
        />
        <TouchableOpacity onPress={() => deleteTask(item.id)}>
          <Ionicons name="md-trash" size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </Transitioning.View>
    );
  };

  const transition = (
    <Transition.Sequence>
      <Transition.Out type="fade" durationMs={200} interpolation="easeIn" />
      <Transition.Change />
      <Transition.In type="fade" durationMs={200} interpolation="easeOut" />
    </Transition.Sequence>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <StatusBar style="auto" />
      <View style={tw`bg-indigo-500 p-4 flex-row justify-between items-center`}>
        <Text style={tw`text-white font-bold text-xl`}>Quick Task</Text>
      </View>
      <View style={tw`p-4 bg-white`}>
        <TextInput
          style={tw`bg-gray-200 py-2 px-4 rounded-full text-gray-800`}
          placeholder="Add Task..."
          value={taskText}
          onChangeText={(text) => setTaskText(text)}
          onSubmitEditing={addTask}
        />
        <TouchableOpacity style={tw`absolute right-4 top-2`} onPress={addTask}>
          <Ionicons name="md-add-circle" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>
      <View style={tw`flex-1 p-4`}>
        <Transitioning.View transition={transition} ref={transitionRef} style={tw`flex-1`}>
          <FlatList
            data={filteredTaskList}
            renderItem={renderTask}
            keyExtractor={(item) => item.id}
            contentContainerStyle={tw`pb-4`}
          />
        </Transitioning.View>
      </View>
      <View style={tw`p-4 bg-white border-t border-gray-200 flex-row items-center justify-between`}>
        <TouchableOpacity onPress={() => filterTasks('completed')}>
          <Text style={tw`text-gray-800 font-bold`}>Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => filterTasks('all')}>
          <Text style={tw`text-gray-800 font-bold`}>All</Text>
        </TouchableOpacity>
        <View style={tw`flex-row items-center`}>
          <Ionicons name="md-calendar" size={24} color="#333333" style={tw`mr-2`} />
          <Text style={tw`text-gray-800`}>Tasks for Today: {taskList.length}</Text>
        </View>
        <TouchableOpacity style={tw`bg-red-500 p-2 rounded`} onPress={() => setTaskList([])}>
          <Text style={tw`text-white font-bold`}>Clear All</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default App;
