import * as THREE from "three"
import Camera from "./Camera"
import Debug from "./utils/Debug"
import Sizes from "./utils/Sizes"
import Time from "./utils/Time"
import Renderer from "./Renderer"
import World from "./world/World"

let instance = null
export default class Experience {
    constructor(canvas) {
        if (instance) {
            return instance
        }

        instance = this


        // Global access
        window.experience = this

        // Options
        this.canvas = canvas
        this.options = {
            widthRoad: 18,
            lengthRoad: 400,
            countPairCar: 100,
            roadSection: 2,
            roadXAmplitude: 12,
            roadXFrequency: 0.01,
            roadYAmplitude: 17,
            roadYFrequency: 0.03,
            baseSpeed: 0.06,
            amountIncreaseSpeed: 0.2,
            amountIncreaseBaseSpeed: 0.1,
        }

        // Setup
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.world = new World()
        this.camera = new Camera()
        this.renderer = new Renderer()


        // axes helper
        // const axesHelper = new THREE.AxesHelper(20)
        // this.scene.add(axesHelper)
        // Resize event
        this.sizes.on('resize', () => {
            this.resize()
        })

        // Time tick event
        this.time.on('tick', () => {
            this.update()
        })


        document.addEventListener("mousedown", () => {
            this.mouseDown()
        })

        document.addEventListener("touchstart", () => {
            this.mouseDown()
        })

        document.addEventListener("mouseup", () => {
            this.mouseUp()
        })
        document.addEventListener("touchend", () => {
            this.mouseUp()
        })
    }

    resize() {
        this.camera.resize()
        this.renderer.resize()
    }

    update() {
        this.camera.update()
        this.world.update()
        this.renderer.update()
    }

    mouseDown() {
        this.world.SpeedDown()
        this.camera.increaseFov()
    }

    mouseUp() {
        this.world.SpeedUp()
        this.camera.decreseFov()
    }

    destroy() {
        this.sizes.off('resize')
        this.time.off('tick')

        // Traverse the whole scene
        this.scene.traverse((child) => {
            // Test if it's a mesh
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose()

                // Loop through the material properties
                for (const key in child.material) {
                    const value = child.material[key]

                    // Test if there is a dispose function
                    if (value && typeof value.dispose === 'function') {
                        value.dispose()
                    }
                }
            }
        })

        this.camera.controls.dispose()
        this.renderer.instance.dispose()

        if (this.debug.active)
            this.debug.ui.destroy()
    }
}