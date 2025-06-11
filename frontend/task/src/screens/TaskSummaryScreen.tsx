import  React,{useState,useEffect} from 'react';
import {View,Text,StyleSheet,ScrollView,RefreshControl,} from 'react-native';
import {ProgressChart} from '../components/ProgressChart';
import { TaskStats } from '@/types';
import { taskAPI } from '@/services/api';
import { colors } from '@/styles/colors';
import { globalStyles } from '@/styles/globalStyles';

export const TaskSummaryScreen:React.FC=()=>{
    const[stats,setStats]=useState<TaskStats |null>(null);
    const[loading,setLoading]=useState(true);
    const[refreshing,setrefreshing]=useState(false);

    useEffect(()=>{
        loadStates();
    },[]);
    const loadStates=async ()=>{
        try{
            const fetchedStats=await taskAPI.getStats();
            setStats(fetchedStats);
        }catch(error){
            console.error('Failed to load stats',error);
        }finally{
            setLoading(true);
            setrefreshing(false);
        }
    };
    const onRefresh=()=>{
        setrefreshing(true);
        loadStates();
    };
    if(!stats){
        return(
            <View style={[globalStyles.container, { justifyContent: 'center' }]}>
            <Text style={styles.loadingText}>Loading statistics...</Text>
            </View>

        );
    }
    return(
        <ScrollView
      style={globalStyles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={globalStyles.header}>
        <Text style={globalStyles.headerTitle}>TASK SUMMARY</Text>
        <Text style={globalStyles.headerSubtitle}>
          View your progress at a glance 📊
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.total_tasks}</Text>
          <Text style={styles.statLabel}>Tasks</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: colors.success }]}>
            {stats.completed_tasks}
          </Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: colors.error }]}>
            {stats.incomplete_tasks}
          </Text>
          <Text style={styles.statLabel}>Incomplete</Text>
        </View>
      </View>

      <View style={globalStyles.card}>
        <Text style={styles.chartTitle}>Completion Status</Text>
        <ProgressChart stats={stats} />
        <Text style={styles.completionRate}>
          {Math.round(stats.completion_rate)}% Complete
        </Text>
      </View>

      <View style={globalStyles.card}>
        <Text style={styles.sectionTitle}>Priority Breakdown</Text>
        {stats.priority_breakdown.map((item, index) => (
          <View key={index} style={styles.breakdownItem}>
            <View style={styles.breakdownLabel}>
              <View style={[
                styles.priorityDot,
                { backgroundColor: colors[item.priority as keyof typeof colors] || colors.medium }
              ]} />
              <Text style={styles.breakdownText}>
                {item.priority.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.breakdownCount}>{item.count}</Text>
          </View>
        ))}
      </View>

      <View style={globalStyles.card}>
        <Text style={styles.sectionTitle}>Status Breakdown</Text>
        {stats.status_breakdown.map((item, index) => (
          <View key={index} style={styles.breakdownItem}>
            <Text style={styles.breakdownText}>
              {item.status.replace('_', ' ').toUpperCase()}
            </Text>
            <Text style={styles.breakdownCount}>{item.count}</Text>
          </View>
        ))}
      </View>
    </ScrollView>

    );
};
const styles = StyleSheet.create({
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: colors.textSecondary,
  },
  
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 16,
  },
  
  statCard: {
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
  
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
  },
  
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  
  completionRate: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginTop: 16,
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  
  breakdownLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  
  breakdownText: {
    fontSize: 16,
    color: colors.text,
  },
  
  breakdownCount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});