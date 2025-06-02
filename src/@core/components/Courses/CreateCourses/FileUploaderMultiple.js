// ** React Imports
import { useState, Fragment } from 'react'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Button, ListGroup, ListGroupItem } from 'reactstrap'

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'
import { FileText, X, DownloadCloud } from 'react-feather'
import { useMutation, useQueryClient } from 'react-query'
import { CreateCourse } from '../../../../services/api/Create-Course/CreateCourse'
import toast from 'react-hot-toast'
import useCourseStore from '../../../../zustand/useCourseStore '

const FileUploaderMultiple = () => {
    const {
    tumbImageAddress,
    setTumbImageAddress,
  } = useCourseStore()
  // ** State
  const client = useQueryClient();

  const [img, setimg] = useState([])

  
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => {
      setTumbImageAddress([...tumbImageAddress, ...acceptedFiles.map(file => Object.assign(file))])
    }
  })

  const renderFilePreview = file => {
    if (file.type.startsWith('image')) {
      return <img className='rounded' alt={file.name} src={URL.createObjectURL(file)} height='28' width='28' />
    } else {
      return <FileText size='28' />
    }
  }



    const handleUploadImage = (tumbImageAddress) => {
    if (!tumbImageAddress) return;
    const reader = new FileReader();
    reader.onload = () => {
      const imgURL = reader.result?.toString() || "";
      const imgElement = new Image();
      imgElement.src = imgURL;
      imgElement.onload = (e) => {
        const { naturalWidth, naturalHeight } = e.currentTarget;
        if (naturalHeight < 0 && naturalWidth < 0) {
          toast.error("عکس شما نباید کمتر از ۲۵۰ پیکسل باشد");
          return setTumbImageAddress("");
        }
        setTumbImageAddress(imgURL);
      };
    };
    reader.readAsDataURL(tumbImageAddress);
  };

  const handleRemoveFile = file => {
    const uploadedFiles = tumbImageAddress
    const filtered = uploadedFiles.filter(i => i.name !== file.name)
    setTumbImageAddress([...filtered])
  }

  const renderFileSize = size => {
    if (Math.round(size / 100) / 10 > 1000) {
      return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`
    } else {
      return `${(Math.round(size / 100) / 10).toFixed(1)} kb`
    }
  }

  const fileList = tumbImageAddress.map((file, index) => (
    <ListGroupItem key={`${file.name}-${index}`} className='d-flex align-items-center justify-content-between'>
      <div className='file-details d-flex align-items-center'>
        <div className='file-preview me-1'>{renderFilePreview(file)}</div>
        <div>
          <p className='file-name mb-0'>{file.name}</p>
          <p className='file-size mb-0'>{renderFileSize(file.size)}</p>
        </div>
      </div>
      <Button color='danger' outline size='sm' className='btn-icon' onClick={() => handleRemoveFile(file)}>
        <X size={14} />
      </Button>
    </ListGroupItem>
  ))

  const handleRemoveAllFiles = () => {
    setTumbImageAddress([])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>تصویر دوره را وارد کنید</CardTitle>
      </CardHeader>
      <CardBody>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <div className='d-flex align-items-center justify-content-center flex-column'>
            <DownloadCloud size={64} />
            <h5>تصویر دوره را وارد کنید</h5>
            <p className='text-secondary'>
              <a href='/' onClick={e => e.preventDefault()}>
                فایل را به اینجا بکشید{' '}              </a>{' '}
            </p>
          </div>
        </div>
        {tumbImageAddress.length ? (
          <Fragment>
            <ListGroup className='my-2'>{fileList}</ListGroup>
            <div className='d-flex justify-content-end'>
              <Button className='me-1' color='danger' outline onClick={handleRemoveAllFiles}>
                Remove
              </Button>
              <Button color='primary' onClick={handleUploadImage}>Upload Files</Button>
            </div>
          </Fragment>
        ) : null}
      </CardBody>
    </Card>
  )
}

export default FileUploaderMultiple
