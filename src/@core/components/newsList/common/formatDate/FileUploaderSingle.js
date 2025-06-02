// ** React Imports
import { useState, Fragment } from 'react'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Button, ListGroup, ListGroupItem } from 'reactstrap'

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'
import { FileText, X, DownloadCloud } from 'react-feather'

const FileUploaderSingle = () => {
  // ** State
  const [file, setFile] = useState(null)

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        setFile(Object.assign(acceptedFiles[0]))
      }
    }
  })

  const handleRemoveFile = () => {
    setFile(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>تصویر بلاگ</CardTitle>
      </CardHeader>
      <CardBody>
        {!file ? (
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <div className='d-flex align-items-center justify-content-center flex-column'>
              <DownloadCloud size={64} />
              <h5>برای وارد کردن عکس خبر کلیک کنید یا فایل را به اینجا بکشید</h5>
              <p className='text-secondary'>
                فایل را به اینجا بکشید یا کلیک کنید (فقط تصاویر)
              </p>
            </div>
          </div>
        ) : (
          <div className='d-flex flex-column align-items-center'>
            <img 
              className='rounded mb-2' 
              alt={file.name} 
              src={URL.createObjectURL(file)} 
              style={{ maxHeight: '200px', maxWidth: '100%' }} 
            />
            <div className='d-flex align-items-center'>
              <span className='me-2'>{file.name}</span>
              <Button 
                color='danger' 
                outline 
                size='sm' 
                className='btn-icon' 
                onClick={handleRemoveFile}
              >
                <X size={14} />
              </Button>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

export default FileUploaderSingle
