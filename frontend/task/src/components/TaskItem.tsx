import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Task } from '../types';
import { colors } from '../styles/colors';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onDelete,
  onEdit,
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return colors.high;
      case 'medium': return colors.medium;
      case 'low': return colors.low;
      default: return colors.medium;
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(task.id) },
      ]
    );
  };

  return (
    <View style={[styles.container, task.is_completed && styles.completedContainer]}>
      <View style={[styles.priorityBar, { backgroundColor: getPriorityColor(task.priority) }]} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, task.is_completed && styles.completedText]}>
            {task.title}
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() => onEdit(task)}
            >
              <Text style={styles.actionButtonText}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleDelete}
            >
              <Text style={styles.actionButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {task.description ? (
          <Text style={[styles.description, task.is_completed && styles.completedText]}>
            {task.description}
          </Text>
        ) : null}

        <View style={styles.footer}>
          <View style={styles.statusContainer}>
            <Text style={[styles.priority, { color: getPriorityColor(task.priority) }]}>
              {task.priority.toUpperCase()}
            </Text>
            <Text style={styles.status}>
              {task.status.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
          
          <TouchableOpacity
            style={[
              styles.completeButton,
              task.is_completed ? styles.completedButton : styles.incompleteButton
            ]}
            onPress={() => onToggleComplete(task.id)}
          >
            <Text style={styles.completeButtonText}>
              {task.is_completed ? '✓' : '○'}
            </Text>
          </TouchableOpacity>
        </View>

        {task.due_date && (
          <Text style={styles.dueDate}>
            Due: {new Date(task.due_date).toLocaleDateString()}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  
  completedContainer: {
    opacity: 0.7,
  },
  
  priorityBar: {
    width: 4,
  },
  
  content: {
    flex: 1,
    padding: 16,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 12,
  },
  
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  
  priority: {
    fontSize: 12,
    fontWeight: '700',
  },
  
  status: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '500',
  },
  
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  editButton: {
    backgroundColor: colors.warning,
  },
  
  deleteButton: {
    backgroundColor: colors.error,
  },
  
  actionButtonText: {
    fontSize: 14,
  },
  
  completeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  completedButton: {
    backgroundColor: colors.success,
  },
  
  incompleteButton: {
    backgroundColor: colors.borderLight,
  },
  
  completeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  
  dueDate: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 8,
    fontStyle: 'italic',
  },
});