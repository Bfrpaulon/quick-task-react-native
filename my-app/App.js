// Importa os componentes necessários do React Native e outras bibliotecas
import React , { useState, useEffect, useRef } from 'react' ;
import { View , Text , TextInput , TouchableOpacity , FlatList , SafeAreaView } from 'react-native' ;
import { StatusBar } from 'expo-status-bar' ;
import { Ionicons } from '@expo/vector-icons' ;
import tw from 'tailwind-react-native-classnames' ;
import { Transition , Transitioning } from 'react-native-reanimated' ;

// Define o componente principal da aplicação
const App = ( ) => {
  // Estado para armazenar o texto da tarefa
  const [taskText, setTaskText] = useState ( '' );
  // Estado para armazenar a lista de tarefas
  const [taskList, setTaskList] = useState ([]);
  // Estado para armazenar a lista de tarefas filtrada
  const [filteredTaskList, setFilteredTaskList] = useState ([]);
  // Estado para armazenar o filtro selecionado
  const [selectedFilter, setSelectedFilter] = useState ( 'all' );
  // Referência para o componente de transição
  const transitionRef = useRef ();

  useEffect ( () => {
    // Filtra as tarefas sempre que a lista de tarefas ou o filtro selecionado mudar
    filterTasks (selectedFilter);
  }, [taskList, selectedFilter]);

  // Função para adicionar uma nova tarefa à lista de tarefas
  const addTask = ( ) => {
    if (taskText. trim () !== '' ) {
      const newTask = {
        id : Date . now (). toString (),
        text : taskText,
        completed : false ,
      };

      // Adiciona a nova tarefa à lista de tarefas
      setTaskList ( ( prevTaskList ) => [...prevTaskList, newTask]);
      // Limpa o texto da tarefa
      setTaskText ( '' );
    }
  };

  // Função para alterar o estado de completude de uma tarefa com base no ID da tarefa
  const toggleComplete = ( taskId ) => {
    setTaskList ( ( prevTaskList ) =>
      prevTaskList. map ( ( task ) =>
        task. id === taskId ? { ...task, completed : !task. completed } : task
      )
    );
  };

  // Função para alterar o texto de uma tarefa com base no ID da tarefa
  const editTask = ( taskId, text ) => {
    setTaskList ( ( prevTaskList ) =>
      prevTaskList. map ( ( task ) =>
        task. id === taskId ? { ...task, text, editing : true } : task
      )
    );
  };

  // Função para salvar a edição de uma tarefa com base no ID da tarefa
  const saveTask = ( taskId ) => {
    setTaskList ( ( prevTaskList ) =>
      prevTaskList. map ( ( task ) =>
        task. id === taskId ? { ...task, editing : false } : task
      )
    );
  };

  // Função para remover uma tarefa com base no ID da tarefa
  const deleteTask = ( taskId ) => {
    setTaskList ( ( prevTaskList ) =>
      prevTaskList. filter ( ( task ) => task. id !== taskId)
    );
  };

  // Função para filtrar as tarefas com base no filtro selecionado
  const filterTasks = ( filter ) => {
    setSelectedFilter (filter);

    if (filter === 'completed' ) {
      // Filtra as tarefas concluídas
      setFilteredTaskList (taskList. filter ( ( task ) => task. completed ));
    } else if (filter === 'all' ) {
      // Mostra todas as tarefas
      setFilteredTaskList (taskList);
    } else {
      // Filtra as tarefas não concluídas
      setFilteredTaskList (taskList. filter ( ( task ) => !task. completed ));
    }
  };

  // Função para renderizar cada item da lista de tarefas
  const renderTask = ( { item } ) => {
    return (
      < Transitioning.View
        ref = {transitionRef}
        transition = {transition}
        style = {tw ` p-4 mb-4 bg-white rounded-lg flex-row justify-between items-center `}
        key = {item.id}
      >
        <TouchableOpacity onPress = {() => toggleComplete(item.id)}>
          <Ionicons name = {item.completed ? 'checkbox-outline' : 'square-outline'} size = {24} color = "black" />
        </TouchableOpacity>
        <View style = {tw ` flex-1 ml-4 `}>
          {item.editing ? (
            <TextInput
              value = {item.text}
              onChangeText = {(text) => editTask(item.id, text)}
              onSubmitEditing = {() => saveTask(item.id)}
              autoFocus = {true}
              blurOnSubmit = {false}
            />
          ) : (
            <Text style = {[tw ` text-lg `, item.completed && tw ` line-through `]}>{item.text}</Text>
          )}
        </View>
        <TouchableOpacity onPress = {() => deleteTask(item.id)}>
          <Ionicons name = "trash-outline" size = {24} color = "black" />
        </TouchableOpacity>
      </Transitioning.View>
    );
  };

  return (
    <View style = {tw ` flex-1 bg-gray-100 `}>
      <StatusBar style = "auto" />
      <SafeAreaView style = {tw ` flex-1 `}>
        <View style = {tw ` p-4 `}>
          <Text style = {tw ` text-2xl font-bold text-center text-gray-800 mb-8 `}>To Do List</Text>
          <View style = {tw ` flex-row items-center mb-4 `}>
            <TextInput
              value = {taskText}
              onChangeText = {(text) => setTaskText(text)}
              placeholder = "Digite uma nova tarefa"
              style = {tw ` flex-1 mr-4 p-2 bg-white rounded-lg shadow-md `}
            />
            <TouchableOpacity onPress = {addTask}>
              <Ionicons name = "add-outline" size = {24} color = "black" />
            </TouchableOpacity>
          </View>
          <View style = {tw ` flex-row items-center justify-between `}>
            <TouchableOpacity onPress = {() => filterTasks('all')}>
              <Text style = {[tw ` text-lg `, selectedFilter === 'all' && tw ` font-bold text-blue-500 `]}>Todas</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress = {() => filterTasks('active')}>
              <Text style = {[tw ` text-lg `, selectedFilter === 'active' && tw ` font-bold text-blue-500 `]}>Ativas</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress = {() => filterTasks('completed')}>
              <Text style = {[tw ` text-lg `, selectedFilter === 'completed' && tw ` font-bold text-blue-500 `]}>Concluídas</Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          data = {filteredTaskList}
          renderItem = {renderTask}
          keyExtractor = {(item) => item.id}
          contentContainerStyle = {[tw ` p-4 `]}
        />
      </SafeAreaView>
    </View>
  );
};

export default App;