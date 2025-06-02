const dateModifier = (date) => {
    const option={
        year:"numeric",
        month:"long",
        day:"2-digit",
    }
    const modifiedDate = new Date(date).toLocaleString("fa-IR",option)
    
    return modifiedDate
}

export default dateModifier
