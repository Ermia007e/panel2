// ** React Imports
import { useState } from 'react'

// ** Third Party Components
import Flatpickr from 'react-flatpickr'
import { User, Briefcase, Mail, Calendar, DollarSign, X, Check } from 'react-feather'
import Select from 'react-select'
// ** Utils
import { selectThemeColors } from '@utils'

// ** Reactstrap Imports
import { Modal, Input, Label, Button, ModalHeader, ModalBody, InputGroup, InputGroupText, Row, Col } from 'reactstrap'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
// import { Creategroup, CreateSocialGroupgroup } from '../../../services/api/Create-group/CreateNewGroup'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
// import { formDataModifire } from '../../../utility/formDataModifire'
import { AddSchedual } from '../../../../services/api/Add-Schedual/AddSchedual'
import { getgroupList } from '../../../../services/api/Blogs'
import useCourseStore from '../../../../zustand/CourseSlice'

const AddNewSchedual = ({ open, handleModal,groupListid }) => {
  const client = useQueryClient();
  const [startDate, setstartDate] = useState('');
  const [startTime, setstartTime] = useState('');
  const [endTime, setendTime] = useState('');
  const [weekNumber, setweekNumber] = useState('');
  const [getgroupName, setgetGroupName] = useState([]);

  const {
    PageNumber,
    SortingCol,
    SortingType,
    SearchInput
  } = useCourseStore()
  // ** Custom close btn
  const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleModal} />
  const { courseId } = useParams()
  

  console.log(groupListid, "groupListid")

  const getGroupName = groupListid?.map((e) => ({
    value: e?.groupId,
    label: e?.groupName	,
  }));




  const mutation = useMutation({
    mutationFn: (data) => {
      return AddSchedual(data,courseId);
    },
    onSuccess: () => {
      toast.success("زمان‌بندی  شما با موفقیت اضافه شد");
      client.invalidateQueries({ queryKey: ["adminScheduals"] });
    },
    onError: () => {
    },
  });
  const addNewSchedual = async () => {
    const obj = {
      courseGroupId: getgroupName,
      startDate: startDate,
      startTime: startTime,
      endTime: endTime,
      weekNumber: weekNumber,
      rowEffect: 1,
    };
    mutation.mutate(obj);

  };



  return (
    <Modal
      isOpen={open}
      toggle={handleModal}
      className='sidebar-sm'
      modalClassName='modal-slide-in'
      contentClassName='pt-0'
    >
      <ModalHeader className='mb-1' toggle={handleModal} close={CloseBtn} tag='div'>
        <h5 className='modal-title'>افزودن زمان‌بندی  جدید</h5>
      </ModalHeader>
      <ModalBody className='flex-grow-1'>

        <div className='mb-1'>
          <Label className='form-label' >نام گروه</Label>
          <Select
            theme={selectThemeColors}
            isClearable={false}
            className='react-select'
            classNamePrefix='select'
            placeholder='نحوه برگزاری را انتخاب کنید'
            options={getGroupName}
          onChange={(selected) => setgetGroupName(selected?.value)} 
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='full-name'>
            تاریخ شروع
          </Label>
          <InputGroup>
            <InputGroupText>
              <User size={15} />
            </InputGroupText>
            <Input id='full-name' type="date" name='startDate' value={startDate} onChange={(value) => { setstartDate(value.target.value) }} placeholder='تاریخ شروع را وارد کنید' />
            {/* <Flatpickr className='form-control' value={startDate} onChange={date => setstartDate(date)} id='default-picker' /> */}

          </InputGroup>
        </div>

        <div className='mb-1'>
          <Label className='form-label' for='full-name'>
            زمان شروع
          </Label>
          <InputGroup>
            <InputGroupText>
              <User size={15} />
            </InputGroupText>
            <Input id='full-name' name='startTime' value={startTime} onChange={(value) => { setstartTime(value.target.value) }} placeholder='زمان شروع را وارد کنید' />
            {/* <Flatpickr
              className='form-control'
              value={startTime}
              id='timepicker'
              options={{
                enableTime: true,
                noCalendar: true,
                dateFormat: 'H:i',
                time_24hr: true
              }}
              onChange={date => setstartTime(date)}
            /> */}
          </InputGroup>
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='post'>
            زمان پایان
          </Label>
          <InputGroup>
            <InputGroupText>
              <Briefcase size={15} />
            </InputGroupText>
            <Input id='post' name='endTime' value={endTime} onChange={(value) => { setendTime(value.target.value) }} placeholder='زمان پایان را وارد کنید' />
            {/* <Flatpickr
              className='form-control'
              value={endTime}
              id='timepicker'
              options={{
                enableTime: true,
                noCalendar: true,
                dateFormat: 'H:i',
                time_24hr: true
              }}
              onChange={date => setendTime(date)}
            /> */}
          </InputGroup>
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='post'>
            عدد هفته
          </Label>
          <InputGroup>
            <InputGroupText>
              <Briefcase size={15} />
            </InputGroupText>
            <Input id='post' type="week" name='weekNumber' value={weekNumber} onChange={(value) => { setweekNumber(value.target.value) }} placeholder='عدد هفته را وارد کنید' />
          </InputGroup>
        </div>


        <Button className='me-1' color='primary' onClick={
          addNewSchedual
        }>
          ثبت
        </Button>
        <Button color='secondary' onClick={handleModal} outline>
          لغو
        </Button>
      </ModalBody>
    </Modal>
  )
}

export default AddNewSchedual
