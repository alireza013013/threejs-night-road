import Experience from './experience/Experience'

const experience = new Experience(document.getElementById("canvas"))


document.getElementById("button-speed").addEventListener("mousedown", () => {
    experience.mouseDown()
    document.getElementById("border-btn").style.animationDuration = "1.0s"

})

document.getElementById("button-speed").addEventListener("mouseup", () => {
    experience.mouseUp()
    document.getElementById("border-btn").style.animationDuration = "2.5s"
})


document.getElementById("button-speed").addEventListener("touchstart", () => {
    experience.mouseDown()
    document.getElementById("border-btn").style.animationDuration = "1.0s"
})

document.getElementById("button-speed").addEventListener("touchend", () => {
    experience.mouseUp()
    document.getElementById("border-btn").style.animationDuration = "2.5s"
})