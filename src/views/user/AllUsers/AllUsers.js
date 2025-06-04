import { useState } from "react"
import Tabs from "./Tabs"


export function AllUsers(){
  const [active, setActive] = useState('1')

  const toggleTab = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }

return(
  <>
    <Tabs active={active} toggleTab={toggleTab} />
    </>
)
     
}