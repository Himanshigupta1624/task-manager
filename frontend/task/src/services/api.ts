import axios from 'axios';
import { Task, TaskStats, CreateTaskRequest, UpdateTaskRequest } from '../types';

// Detect environment and use appropriate URL
const isWeb = typeof window !== 'undefined' && window.navigator.product !== 'ReactNative';
const API_BASE_URL = isWeb 
  ? 'http://localhost:8000/api'  // Use localhost for web
  : 'http://192.168.1.9:8000/api'; // Use IP for mobile

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': "application/json",
    },
    withCredentials:false
});

export const taskAPI={
    getTasks:async (): Promise<Task[]> =>{
        const response =await api.get('/tasks/');
        return response.data;
    },

    getTask:async (id:number): Promise<Task>=>{
        const response =await api.get(`/tasks/${id}/`);
        return response.data;
    } ,
    createTask :async(task: CreateTaskRequest) : Promise<Task> =>{
        const response =await api.post('/tasks/',task);
        return response.data;
    },
    updateTask: async(id:number,task:UpdateTaskRequest):Promise<Task>=>{
        const response =await api.put(`/tasks/${id}/`,task);
        return response.data;
    },
    deleteTask: async(id: number): Promise<void> => {
        try {
            console.log(`Attempting to delete task ${id}`);
            
            // Try fetch API first (better for some CORS scenarios)
            try {
                const response = await fetch(`${API_BASE_URL}/tasks/${id}/`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                
                if (response.ok) {
                    console.log('Delete successful via fetch');
                    return;
                }
                console.log(`Fetch delete failed with status: ${response.status}`);
            } catch (fetchError) {
                console.log('Fetch delete failed, trying axios', fetchError);
            }
            
            // Fall back to axios if fetch fails
            await api.delete(`/tasks/${id}/`);
            console.log('Delete successful via axios');
        } catch (error) {
            console.error('Delete operation failed:', error);
            throw error;
        }
    },

    toggleComplete :async (id:number) :Promise<Task>=>{
        const response =await api.patch(`/tasks/${id}/toggle_complete/`);
        return response.data;
    },
    getStats :async():Promise<TaskStats>=>{
        const response=await api.get('/tasks/stats/');
        return response.data;
    },
};