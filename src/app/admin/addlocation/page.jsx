import React from "react"
import Navbar from "@/components/Navbar/Navbar"
import LocationForm from "@/components/LocationForm/LocationForm"
import LocationManager from "@/components/LocationManager/LocationManager"

export default function addlocation(){
    return(
        <div>
            <LocationForm/>
            <LocationManager/>
        </div>
    )
}