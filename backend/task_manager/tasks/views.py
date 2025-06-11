from django.shortcuts import render
from rest_framework.decorators import action
from rest_framework import viewsets,status
from rest_framework.response import Response
from django.db.models import Count,Q
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset=Task.objects.all()
    serializer_class=TaskSerializer
    
    @action(detail=False,methods=['get'])
    def stats(self,request):
        total_tasks=Task.objects.count()
        completed_tasks=Task.objects.filter(is_completed=True).count()
        incompele_tasks=total_tasks - completed_tasks
        
        priority_stats=Task.objects.values('priority').annotate(count=Count('id'))
        status_stats=Task.objects.values('status').annotate(count=Count('id'))
        
        return Response({
            'total_tasks' :total_tasks,
            'completed_tasks':completed_tasks,
            'imcomplete_tasks':incompele_tasks,
            'completion_rate': (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0,
            'priority_breakdown': list(priority_stats),
            'status_breakdown': list(status_stats),
            
        })
    @action(detail=True,methods=['patch'])
    def toggle_complete(self,request,pk=None):
        task=self.get_object()
        task.is_completed= not task.is_completed
        task.status='completed' if task.is_completed  else 'todo'
        task.save()
        serializer=self.get_serializer(task)
        return Response(serializer.data)   