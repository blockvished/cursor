import gsap from "gsap"
import { useEffect } from "react"

function Cursor() {

    const handleMouseMove = (event) => {
        const { clientX, clientY } = event
        gsap.to("#cursor", {
            x: clientX-20/2,
            y: clientY-20/2,
            duration:1,
            delay:0,
            ease: "power4.out"
        })
    }

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove)
        return () => { window.removeEventListener("mousemove", handleMouseMove) }
    })

    return (
        <div id="cursor" className='absolute top-0 left-0 h-[20px] w-[20px] bg-white rounded-full z-10' />
    )
}

export default Cursor