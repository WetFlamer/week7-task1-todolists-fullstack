import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  todos: [],
};

export const completeTodo = createAsyncThunk(
  "todos/completed/fetch",
  async (data, thunkAPI) => {
    try {
      const res = await fetch(`http://localhost:3000/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify({ completed: !data.completed }),
        headers: { "Content-type": "application/json" },
      });
      const todos = await res.json();
      if (todos.error) {
        return thunkAPI.rejectWithValue(todos.error);
      }
      return thunkAPI.fulfillWithValue(todos);
    } catch (error) {
      thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchTodos = createAsyncThunk(
  "todos/fetch",
  async (data, thunkAPI) => {
    try {
      const res = await fetch("http://localhost:3000/");
      const todos = await res.json();
      if (todos.error) {
        return thunkAPI.rejectWithValue(todos.error.message);
      }
      return thunkAPI.fulfillWithValue(todos);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addTodo = createAsyncThunk('todos/add/fetch', async (data, thunkAPI) => {
  try {
    const res = await fetch('http://localhost:3000/', {
      method: 'POST',
      headers: {'Content-type' : 'application/json'},
      body: JSON.stringify({title: data.text})
    })
    const todos = await res.json()

    if(todos.error) {
      return thunkAPI.rejectWithValue(todos.error)
    }

    return thunkAPI.fulfillWithValue(todos)
  } catch(error) { return thunkAPI.rejectWithValue(error.message);}
})

export const deleteTodo = createAsyncThunk(
  "todos/delete/fetch",
  async (data, thunkAPI) => {
    try {
      const res = await fetch(`http://localhost:3000/${data.id}`, {
        method: "DELETE",
        headers: { "Content-type": "application/json" },
      });
      const todos = await res.json();
      if (todos.error) {
        return thunkAPI.rejectWithValue(todos.error);
      }

      return thunkAPI.fulfillWithValue(todos);
    } catch (error) {
      thunkAPI.rejectWithValue(error.message);
    }
  }
);

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET ЗАПРОС
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.todos = action.payload;
        state.loading = false;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      //

      // PATCH ЗАПРОС
      .addCase(completeTodo.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(completeTodo.pending, (state, action) => {
        state.error = null;
        state.todos = state.todos.map((todo) => {
          if (todo._id === action.meta.arg.id) {
            todo.loading = true;
          }
          return todo;
        });
      })
      .addCase(completeTodo.fulfilled, (state, action) => {
        state.todos = state.todos.map((todo) => {
          if (todo._id === action.payload._id) {
            todo.completed = !todo.completed;
            todo.loading = false;
          }
          return todo;
        });
      })
      //

      // DELETE ЗАПРОС
      .addCase(deleteTodo.rejected, (state, action) => {
        state.error = action.payload;
        state.deleted = false;
        state.loading = false
      })
      .addCase(deleteTodo.pending, (state, action) => {
        state.error = null;
        state.todos = state.todos.map((todo) => {
          if (todo._id === action.meta.arg.id) {
            todo.deleted  = true;
          }
          return todo;
        });
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.todos = state.todos.filter((todo) => {
          if (todo._id === action.payload._id) {
            return todo
          }
          return todo
        });
      })

      // POST ЗАПРОС
      .addCase(addTodo.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(addTodo.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.loading = false
        state.todos.push(action.payload)
      })
  },
});

export default todosSlice.reducer;
