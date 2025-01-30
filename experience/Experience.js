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


        if (this.debug.active)
            this.setDebug()

        // Resize event
        this.sizes.on('resize', () => {
            this.resize()
        })

        // Time tick event
        this.time.on('tick', () => {
            this.update()
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

    setDebug() {
        const pathDolder = this.debug.ui.addFolder("Path Folder")
        pathDolder.add(this.options, "roadXAmplitude").min(-40).max(40).step(0.1).name("Path X Amplitude").onFinishChange(() => {
            this.world.road.roadMaterial.uniforms.uDistortionX.value.x = this.options.roadXAmplitude
            this.world.deviderRoad.deviderRoadMaterial.uniforms.uDistortionX.value.x = this.options.roadXAmplitude
            this.world.lightRoad.materialLightCar.uniforms.uDistortionX.value.x = this.options.roadXAmplitude
            this.world.cars.forEach((item) => {
                item.materialLightCar.uniforms.uDistortionX.value.x = this.options.roadXAmplitude
            })
        })
        pathDolder.add(this.options, "roadXFrequency").min(-0.3).max(0.3).step(0.001).name("Path X Frequency").onFinishChange(() => {
            this.world.road.roadMaterial.uniforms.uDistortionX.value.y = this.options.roadXFrequency
            this.world.deviderRoad.deviderRoadMaterial.uniforms.uDistortionX.value.y = this.options.roadXFrequency
            this.world.lightRoad.materialLightCar.uniforms.uDistortionX.value.y = this.options.roadXFrequency
            this.world.cars.forEach((item) => {
                item.materialLightCar.uniforms.uDistortionX.value.y = this.options.roadXFrequency
            })
        })

        pathDolder.add(this.options, "roadYAmplitude").min(-40).max(40).step(0.1).name("Path Y Amplitude").onFinishChange(() => {
            this.world.road.roadMaterial.uniforms.uDistortionY.value.x = this.options.roadYAmplitude
            this.world.deviderRoad.deviderRoadMaterial.uniforms.uDistortionY.value.x = this.options.roadYAmplitude
            this.world.lightRoad.materialLightCar.uniforms.uDistortionY.value.x = this.options.roadYAmplitude
            this.world.cars.forEach((item) => {
                item.materialLightCar.uniforms.uDistortionY.value.x = this.options.roadYAmplitude
            })
        })
        pathDolder.add(this.options, "roadYFrequency").min(-0.3).max(0.3).step(0.001).name("Path Y Frequency").onFinishChange(() => {
            this.world.road.roadMaterial.uniforms.uDistortionY.value.y = this.options.roadYFrequency
            this.world.deviderRoad.deviderRoadMaterial.uniforms.uDistortionY.value.y = this.options.roadYFrequency
            this.world.lightRoad.materialLightCar.uniforms.uDistortionY.value.y = this.options.roadYFrequency
            this.world.cars.forEach((item) => {
                item.materialLightCar.uniforms.uDistortionY.value.y = this.options.roadYFrequency
            })
        })
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