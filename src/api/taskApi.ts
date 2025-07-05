import { supabase } from '../supabaseClient';
import type { Task } from '../types/Task';

// Supabase tasks 表字段：id, user_id, text, completed, created_at

export async function getTasks(userId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (
    data?.map(row => ({
      id: row.id,
      text: row.text,
      completed: row.completed,
      createdAt: new Date(row.created_at).getTime(),
    })) || []
  );
}

export async function addTask(userId: string, text: string): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .insert([{ user_id: userId, text, completed: false }])
    .select()
    .single();
  if (error) throw error;
  return {
    id: data.id,
    text: data.text,
    completed: data.completed,
    createdAt: new Date(data.created_at).getTime(),
  };
}

export async function toggleTask(userId: string, id: string): Promise<void> {
  // 先查当前状态
  const { data, error } = await supabase
    .from('tasks')
    .select('completed')
    .eq('id', id)
    .eq('user_id', userId)
    .single();
  if (error) throw error;
  const newCompleted = !data.completed;
  const { error: updateError } = await supabase
    .from('tasks')
    .update({ completed: newCompleted })
    .eq('id', id)
    .eq('user_id', userId);
  if (updateError) throw updateError;
}

export async function deleteTask(userId: string, id: string): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
}

export async function clearCompleted(userId: string): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('user_id', userId)
    .eq('completed', true);
  if (error) throw error;
} 