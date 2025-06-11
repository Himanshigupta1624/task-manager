import  React,{useState,useEffect} from 'react';
import { View,StyleSheet,Text,ScrollView,TouchableOpacity,RefreshControl } from 'react-native';
import { Task,TaskStats } from '../types';
import { taskAPI } from '@/services/api';
import { colors } from '@/styles/colors';
import { globalStyles } from '@/styles/globalStyles';

interface HomeScreenProps{
    navigation :any;
}
export const HomeScreen:React.FC<HomeScreenProps> =({navigation})=>{
    const[recentTasks,setRecentTasks]=useState<Task[]>([]);
    const [stats,setStats]=useState<TaskStats |null>(null);
    const[refreshing,setRefreshing]=useState(false);

    useEffect(()=>{
        loadData();
    },[]);
    const loadData=async ()=>{
        try{
            const[tasks,taskStats]=await Promise.all([
                taskAPI.getTasks(),
                taskAPI.getStats(),
            ]);
            setRecentTasks(tasks.slice(0,5));
            setStats(taskStats);
        }catch(error){
            console.error('Failed to load Data:',error);
        }finally{
            setRefreshing(false);
        }
    };
    const onRefresh=()=>{
        setRefreshing(true);
        loadData();
    };
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning! ☀️';
        if (hour < 17) return 'Good afternoon! 🌤️';
        return 'Good evening! 🌙';
  };
  return(
    <ScrollView
      style={globalStyles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={globalStyles.header}>
        <Text style={globalStyles.headerTitle}>Tasks</Text>
        <Text style={globalStyles.headerSubtitle}>
          Stay Organized, Stay Ahead ✨
        </Text>
      </View>

      <View style={globalStyles.card}>
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <Text style={styles.welcomeText}>
          Ready to tackle your tasks today?
        </Text>
      </View>

      {stats && (
        <View style={styles.quickStats}>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatNumber}>{stats.total_tasks}</Text>
            <Text style={styles.quickStatLabel}>Total Tasks</Text>
          </View>
          <View style={styles.quickStatItem}>
            <Text style={[styles.quickStatNumber, { color: colors.success }]}>
              {stats.completed_tasks}
            </Text>
            <Text style={styles.quickStatLabel}>Completed</Text>
          </View>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatPercentage}>
              {Math.round(stats.completion_rate)}%
            </Text>
            <Text style={styles.quickStatLabel}>Progress</Text>
          </View>
        </View>
      )}

      <View style={globalStyles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Tasks</Text>
          <TouchableOpacity onPress={() => navigation.navigate('TaskManager')}>
            <Text style={styles.viewAllButton}>View All</Text>
          </TouchableOpacity>
        </View>

        {recentTasks.length > 0 ? (
          recentTasks.map((task) => (
            <View key={task.id} style={styles.taskPreview}>
              <View style={styles.taskPreviewContent}>
                <Text style={[
                  styles.taskPreviewTitle,
                  task.is_completed && styles.completedTask
                ]}>
                  {task.title}
                </Text>
                <View style={styles.taskPreviewMeta}>
                  <Text style={[
                    styles.taskPreviewPriority,
                    { color: colors[task.priority as keyof typeof colors] || colors.medium }
                  ]}>
                    {task.priority.toUpperCase()}
                  </Text>
                  <Text style={styles.taskPreviewStatus}>
                    {task.status.replace('_', ' ').toUpperCase()}
                  </Text>
                </View>
              </View>
              <View style={[
                styles.taskPreviewIndicator,
                { backgroundColor: task.is_completed ? colors.success : colors.error }
              ]} />
            </View>
          ))
        ) : (
          <Text style={styles.noTasksText}>
            No tasks yet. Create your first task to get started!
          </Text>
        )}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[globalStyles.button, styles.actionButton]}
          onPress={() => navigation.navigate('TaskManager')}
        >
          <Text style={globalStyles.buttonText}>📝 Manage Tasks</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[globalStyles.button, styles.actionButton]}
          onPress={() => navigation.navigate('TaskSummary')}
        >
          <Text style={globalStyles.buttonText}>📊 View Summary</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>

  );
};
const styles = StyleSheet.create({
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  
  welcomeText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 8,
  },
  
  quickStatItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  quickStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  
  quickStatPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.warning,
  },
  
  quickStatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  
  viewAllButton: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  
  taskPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  
  taskPreviewContent: {
    flex: 1,
  },
  
  taskPreviewTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  
  completedTask: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  
  taskPreviewMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  
  taskPreviewPriority: {
    fontSize: 12,
    fontWeight: '600',
  },
  
  taskPreviewStatus: {
    fontSize: 12,
    color: colors.textLight,
  },
  
  taskPreviewIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 12,
  },
  
  noTasksText: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 16,
    gap: 12,
  },
  
  actionButton: {
    flex: 1,
  },
});