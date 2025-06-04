import { configureStore } from "@reduxjs/toolkit";
import dataTablesReducer from "../views/user/AllUsers/store";
import layoutReducer from "./layout"; // این خط را اضافه کن

const store = configureStore({
  reducer: {
    dataTables: dataTablesReducer,
    layout: layoutReducer // این خط را اضافه کن
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});

export { store };