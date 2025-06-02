// ** React Imports
import { useState } from 'react'

// ** Third Party Components
import Flatpickr from 'react-flatpickr'
import { User, Briefcase, Mail, Calendar, DollarSign, X } from 'react-feather'

// ** Reactstrap Imports
import { Modal, Input, Label, Button, ModalHeader, ModalBody, InputGroup, InputGroupText } from 'reactstrap'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { Creategroup, CreateSocialGroupgroup } from '../../../services/api/Create-group/CreateNewGroup'
import { useMutation, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { formDataModifire } from '../../../utility/formDataModifire'

const AddNewSocialGroup = ({ open, handleModal }) => {
  const client = useQueryClient();
  const [groupName, setgroupName] = useState('');
  const [groupLink, setgroupLink] = useState('');


  // ** State
  const [Picker, setPicker] = useState(new Date())

  // ** Custom close btn
  const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleModal} />
  const { courseId } = useParams()

  const mutation = useMutation({
    mutationFn: (data) => {
      return CreateSocialGroupgroup(data);
    },
    onSuccess: () => {
      toast.success("گروه شما با موفقیت اضافه شد");
      client.invalidateQueries({ queryKey: ["groupList"] });
    },
    onError: () => {
    },
  });
  const addGroup = async () => {
    const obj = {
      groupName: groupName,
      courseId: courseId,
      groupLink: groupLink,
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
        <h5 className='modal-title'>افزودن گروه اجتماعی جدید</h5>
      </ModalHeader>
      <ModalBody className='flex-grow-1'>
        <div className='mb-1'>
          <Label className='form-label' for='full-name'>
            نام گروه
          </Label>
          <InputGroup>
            <InputGroupText>
              <User size={15} />
            </InputGroupText>
            <Input id='full-name' name='GroupName' value={groupName} onChange={(value) => { setgroupName(value.target.value) }} placeholder='نام گروه را وارد کنید' />
          </InputGroup>
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='post'>
            لینک گروه
          </Label>
          <InputGroup>
            <InputGroupText>
              <Briefcase size={15} />
            </InputGroupText>
            <Input id='post' name='GroupCapacity' value={groupLink} onChange={(value) => { setgroupLink(value.target.value) }} placeholder='لینک گروه را وارد کنید' />
          </InputGroup>
        </div>

        <Button className='me-1' color='primary' onClick={
          addGroup
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

export default AddNewSocialGroup
