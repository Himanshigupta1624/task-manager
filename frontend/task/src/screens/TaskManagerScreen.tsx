import React, { useEffect,useState } from "react";
import { View,Text,FlatList,TouchableOpacity,StyleSheet,Alert,Modal,TextInput,ScrollView } from "react-native";
import { TaskItem } from "@/components/TaskItem";
import {Task,CreateTaskRequest} from '../types';
import { taskAPI } from "@/services/api";
import { colors } from "@/styles/colors";
import { globalStyles } from "@/styles/globalStyles";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; // Only for web

export const TaskManagerScreen: React.FC= () =>{
    const [tasks,setTasks]=useState<Task[]>([]);
    const [loading,setLoading]=useState(true);
    const[modalVisible,setModalVisible]=useState(false);
    const[editingTask,setEditingTask]=useState<Task |null>(null);
    const [formData,setFormData]=useState({
        title:'',
        description:'',
        priority:'medium' as 'low' | 'medium' |'high',
        due_date:'' as string | undefined
    });
    useEffect(()=>{
        loadTasks();
    },[]);
    const loadTasks=async ()=> {
        try{
            const fetechedTasks=await taskAPI.getTasks();
            setTasks(fetechedTasks);
        }catch(error){
            Alert.alert('Error',"Failed to load tasks");
        }finally{
            setLoading(false);
        }
    };
    const handleCreateTask=async()=>{
        if(!formData.title.trim()){
            Alert.alert('Error','Please enter a task title');
            return;
        }
        
        try {
            // Create a copy of the form data to modify
            const taskData = {...formData};
            
            // Convert empty string due_date to undefined
            if (taskData.due_date === '') {
                taskData.due_date = undefined;
            }
            
            console.log('Sending task data:', taskData); // Debug what's being sent
            const newTask = await taskAPI.createTask(taskData);
            setTasks([newTask, ...tasks]);
            setModalVisible(false);
            resetForm();
        } catch (error) {
            console.error('Create task error:', error); // Log full error
            Alert.alert('Error', 'Failed to create a task');
        }
    };
    const handleUpdateTask=async ()=>{
        if(!editingTask|| !formData.title.trim()){
            Alert.alert('Error','Please enter a task title');
            return;
        }
        try{
            const updatedTask=await taskAPI.updateTask(editingTask.id,formData);
            setTasks(tasks.map(task=>task.id===editingTask.id ?updatedTask :task));
            setModalVisible(false);
            resetForm();
            setEditingTask(null);
        }catch(error){
            Alert.alert('Error','Failed to update task');
        }
    };
    const handleDeleteTask = async (id: number) => {
        try {
          console.log("Deleting task with ID:", id); // Debug
          await taskAPI.deleteTask(id);
          setTasks(tasks.filter(task => task.id !== id));
        } catch (error) {
          console.error("Delete error:", error); // Log the full error
          Alert.alert('Error', 'Failed to delete task. Check console for details.');
        }
      };
    const handleToggleComplete = async (id: number) => {
        try {
        const updatedTask = await taskAPI.toggleComplete(id);
        setTasks(tasks.map(task => task.id === id ? updatedTask : task));
        } catch (error) {
        Alert.alert('Error', 'Failed to update task');
        }
    };
    const handleEditTask=(task:Task)=>{
        setEditingTask(task);
        setFormData({
            title:task.title,
            description:task.description,
            priority : task.priority,
            due_date:task.due_date|| ''

        });
        setModalVisible(true);
    };
    const resetForm=()=>{
        setFormData({
            title:'',
            description:'',
            priority:'medium',
            due_date: ''
        });
    };
    const openCreateModal=()=>{
        resetForm();
        setEditingTask(null);
        setModalVisible(true);
    };
    return(
        <View style={globalStyles.container}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.headerTitle}>TASK MANAGER</Text>
        <Text style={globalStyles.headerSubtitle}>
          Organize your tasks efficiently 📋
        </Text>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTask}
            onEdit={handleEditTask}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <TextInput
                style={globalStyles.input}
                placeholder="Task title"
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
              />

              <TextInput
                style={[globalStyles.input, styles.textArea]}
                placeholder="Description (optional)"
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                multiline
                numberOfLines={3}
              />

              <Text style={styles.sectionTitle}>Priority</Text>
              <View style={styles.priorityContainer}>
                {(['low', 'medium', 'high'] as const).map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityButton,
                      formData.priority === priority && styles.priorityButtonActive,
                      { borderColor: colors[priority] }
                    ]}
                    onPress={() => setFormData({ ...formData, priority })}
                  >
                    <Text style={[
                      styles.priorityButtonText,
                      formData.priority === priority && { color: colors[priority] }
                    ]}>
                      {priority.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.sectionTitle}>Due Date</Text>
              <DatePicker
                selected={formData.due_date ? new Date(formData.due_date) : null}
                onChange={(date) => setFormData({ 
                  ...formData, 
                  due_date: date ? date.toISOString() : undefined 
                })}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select due date (optional)"
                className="date-picker"
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[globalStyles.button, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={[globalStyles.buttonText, { color: colors.text }]}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={globalStyles.button}
                  onPress={editingTask ? handleUpdateTask : handleCreateTask}
                >
                  <Text style={globalStyles.buttonText}>
                    {editingTask ? 'Update' : 'Create'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>

    );
    
};
const styles = StyleSheet.create({
  addButton: {
    backgroundColor: colors.primary,
    marginHorizontal: 20,
    marginVertical: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  
  listContainer: {
    paddingBottom: 20,
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: colors.text,
  },
  
  textArea: {
    marginTop: 12,
    height: 80,
    textAlignVertical: 'top',
  },
  
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 12,
    color: colors.text,
  },
  
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
  
  priorityButtonActive: {
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
  },
  
  priorityButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  
  cancelButton: {
    backgroundColor: colors.borderLight,
    flex: 1,
  },

});