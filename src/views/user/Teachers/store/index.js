import { createSlice } from '@reduxjs/toolkit'
import { getUserList } from '../../../../services/api/userList/getUserList'
import http from '@src/services/interceptor'
import  toast  from 'react-hot-toast'

const initialState = {
  data: [],
  total: 0
}

const dataTablesSlice = createSlice({
  name: 'dataTables',
  initialState,
  reducers: {
    setData: (state, action) => {
      state.data = action.payload.data
      state.total = action.payload.total
    }
  }
})

export const { setData } = dataTablesSlice.actions

export const fetchData = ({ page, perPage, q }) => async dispatch => {
  const { users, total } = await getUserList(page, perPage, q)
  dispatch(setData({ data: users, total }))
}

export const deleteUser = (id) => async (dispatch, getState) => {
  try {
    const response = await http.delete(`/User/DeleteUser/${id}`)
    if (response.status === 200 || response.status === 204) {
      const { page, perPage, q } = getState().dataTables
      dispatch(fetchData({ page, perPage, q }))
      toast.success('کاربر با موفقیت حذف شد!')
    } else {
      toast.error('حذف کاربر با خطا مواجه شد!')
    }
  } catch (err) {
    toast.error('حذف کاربر با خطا مواجه شد!')
  }
}

export default dataTablesSlice.reducer