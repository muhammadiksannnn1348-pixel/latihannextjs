"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useNotification } from "@/component/NotificationComponent";

interface Todo {
    id: number;
    text: string;
    completed: boolean;
    createdAt: string;
}

export default function IndexDBPage() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodoText, setNewTodoText] = useState("");
    const [loading, setLoading] = useState(true);
    const [permissionRequested, setPermissionRequested] = useState(false);

    const { sendNotification, requestPermission, isPermissionGranted } = useNotification();

    //Request Permission notifikasi saat pertama kali load
    useEffect (() => {
        const askPermission = async () => {
            if (!permissionRequested && !isPermissionGranted()) {
                await requestPermission();
                setPermissionRequested(true);
            }
        };
        askPermission();
}, [permissionRequested, requestPermission, isPermissionGranted]);

    //inisialisasi Supabase
    useEffect(() => {
        loadTodos();

        //Subcribe ke perubahan realtime
        const channel = supabase
            .channel("todos-changes")
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'todos' },
                (payload) => {
                    console.log('Change received', payload);
                    loadTodos();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    //Load semua todo dari indexdb
    const loadTodos = async () => {
        try {
            const { data, error } = await supabase
                .from('todos')
                .select('*')
                .order('createdAt', { ascending: false });

            if (error) throw error;
            setTodos(data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error loading todos', error);
            setLoading(false);
        };
    };

    //Tambah todo baru
    const addTodo = async() => {
        try {
            const { error } = await supabase
                .from('todos')
                .insert({ text: newTodoText, completed: false });

            if (error) throw error;
            setNewTodoText("");
        } catch (error) {
            console.error('Error adding todo', error);
        }
    };

    //Toggle Completed Todo
    const toggleTodo = async(id: number, completed: boolean) => {
        try {
            const { error } = await supabase
                .from('todos')
                .update({ completed: !todos.find(todo => todo.id === id)?.completed })
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error toggling todo', error);
        }
    };

    //Hapus todo
    const deleteTodo = async(id: number) => {
        try {
            const { error } = await supabase
                .from('todos')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error deleting todo', error);
        }
    };

    //Hapus semua Todo
    const clearTodos = async () => {
        try {
            const { error } = await supabase
                .from('todos')
                .delete()
                .neq("id", 0);

            if (error) throw error;
            
            await sendNotification({
                title:' All Todos Cleared',
                body: 'All todos have been deleted',
                redirectUrl: '/realtime-db'
            })
        } catch (error) {
            console.error('Error clearing todos', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-6">
                <p className="text-gray-500 text-lg">Loading Todos...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl shadow-lg">
                    <h1 className="text-3xl font-bold">Todo List With Supabase dan Send Notification</h1>
                    <p className="text-sm mdLtext-base mt-2">
                        {isPermissionGranted()
                            ? "Notifikasi diizinkan"
                            : "Notifikasi tidak diizinkan. Silakan izinkan Notifikasi untuk menerima pembaruan"
                        }
                    </p>
                </div>

                {/* Input Form */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-xl font-bold mb-4">Tambah Todo</h2>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={newTodoText}
                            onChange={(e) => setNewTodoText(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addTodo()}
                            placeholder="Apa yang ingin anda lakukan"
                            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 outline-none"
                        />
                        <button
                            onClick={addTodo}
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                        >
                            Tambah
                        </button>
                    </div>
                </div>

                {/* Todo List */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Daftar Todo ({todos.length})</h2>
                        {todos.length > 0 && (
                            <button
                                onClick={clearTodos}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                            >
                                Hapus Semua
                            </button>
                        )}
                    </div>
                    {todos.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <p className="text-4xl mb-2">-</p>
                            <p>Tidak ada todo yang tersedia</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {todos.map((todo) => (
                                <div
                                    key={todo.id}
                                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                                >
                                    <input 
                                        type="checkbox"
                                        checked={todo.completed}
                                        onChange={() => toggleTodo(todo.id, todo.completed)}
                                        className="w-5 h-5 cursor-pointer" 
                                    />

                                    <span
                                        className={`flex-1 text-sm ${todo.completed ? "line-through text-gray-400" : ""}`}
                                    >
                                        {todo.text}
                                    </span>
                                    <button
                                        onClick={() => deleteTodo(todo.id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
function eq(arg0: string, arg1: string) {
    throw new Error("Function not implemented.");
}

function neq(arg0: string, arg1: number) {
    throw new Error("Function not implemented.");
}

