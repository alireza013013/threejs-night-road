import * as THREE from "three"
import roadVertex from "../../shaders/road/vertex.glsl"
import roadFagment from "../../shaders/road/fragment.glsl"
import Experience from '../Experience.js'

export default class Road {
    constructor() {

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.options = this.experience.options
        this.debug = this.experience.debug
        this.roadColor = "#100a09"
        this.time = this.experience.time
        this.speed = 160
        this.speedUpTarget = 0;
        this.speedUp = 0;
        this.timeOffset = 0;


        this.initialize()
        if (this.debug.active)
            this.setDebug()
    }

    initialize() {
        this.roadGeometry = new THREE.PlaneGeometry(this.options.widthRoad, this.options.lengthRoad, 20, 200)
        this.roadMaterial = new THREE.ShaderMaterial({
            vertexShader: roadVertex,
            fragmentShader: roadFagment,
            uniforms: {
                uColor: { value: new THREE.Color(this.roadColor) },
                uSpeed: { value: this.speed },
                uDistortionX: { value: new THREE.Vector2(this.options.roadXAmplitude, this.options.roadXFrequency) },
                uDistortionY: { value: new THREE.Vector2(this.options.roadYAmplitude, this.options.roadYFrequency) },
                uBaseSpeed: { value: this.options.baseSpeed },
                uTravelLength: { value: this.options.lengthRoad },
                uTime: { value: 0 },
            }
        })

        this.roadMesh = new THREE.Mesh(this.roadGeometry, this.roadMaterial)
        this.roadMesh.rotation.x = -Math.PI / 2
        this.roadMesh.position.z = this.options.lengthRoad / 2;
        // this.scene.add(this.roadMesh)
        // this.experience.world.groupWorld.add(this.roadMesh)
    }


    SpeedDown() {
        this.roadMaterial.uniforms.uBaseSpeed.value = this.options.baseSpeed + this.options.amountIncreaseBaseSpeed;
    }

    SpeedUp() {
        this.roadMaterial.uniforms.uBaseSpeed.value = this.options.baseSpeed;
    }

    update() {
        this.roadMaterial.uniforms.uTime.value = this.time.elapsedTime
    }

    setDebug() {
        const RoadFolder = this.debug.ui.addFolder("Road")
        RoadFolder.addColor(this, "roadColor").name("raod Color").onChange((value) => {
            this.roadMaterial.uniforms.uColor.value = new THREE.Color(value)
        })
    }
}