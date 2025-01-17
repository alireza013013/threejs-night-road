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
                uDistortionX: { value: new THREE.Vector2(10, 10) },
                uDistortionY: { value: new THREE.Vector2(12, 5) },
                uTravelLength: { value: this.options.lengthRoad }
            }
        })

        this.roadMesh = new THREE.Mesh(this.roadGeometry, this.roadMaterial)
        this.roadMesh.rotation.x = -Math.PI / 2
        this.roadMesh.position.z = this.options.lengthRoad / 2;
        this.scene.add(this.roadMesh)
    }

    setDebug() {
        const RoadFolder = this.debug.ui.addFolder("Road")
        RoadFolder.addColor(this, "roadColor").name("raod Color").onChange((value) => {
            this.roadMaterial.uniforms.uColor.value = new THREE.Color(value)
        })
    }
}