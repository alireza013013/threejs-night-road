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
        this.speed = this.options.baseSpeed
        this.speedTarget = this.options.baseSpeed

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
        this.scene.add(this.roadMesh)
    }


    SpeedDown() {
        this.speedTarget = this.options.baseSpeed + this.options.amountIncreaseBaseSpeed
    }

    SpeedUp() {
        this.speedTarget = this.options.baseSpeed
    }

    lerp(current, target, speed = 0.1, limit = 0.001) {
        let change = (target - current) * speed;
        if (Math.abs(change) < limit) {
            change = target - current;
        }
        return change;
    }

    update() {
        this.speed += this.lerp(this.speed, this.speedTarget, 0.01);
        this.progress = (this.progress || 0) + this.speed * this.time.delta;

        this.roadMaterial.uniforms.uBaseSpeed.value = this.speed;
        this.roadMaterial.uniforms.uTime.value = this.progress;
    }

    setDebug() {
        const RoadFolder = this.debug.ui.addFolder("Road")
        RoadFolder.addColor(this, "roadColor").name("raod Color").onChange((value) => {
            this.roadMaterial.uniforms.uColor.value = new THREE.Color(value)
        })
    }
}