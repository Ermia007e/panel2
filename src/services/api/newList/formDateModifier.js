export const formDataModifire = (object) => {
    const formData = new FormData()
    Object.entries(object).map(([key, value])=>{
        formData.append(key, value)
    })
    return formData
}