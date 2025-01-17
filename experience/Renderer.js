import * as THREE from 'three'
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js"
import Experience from './Experience.js'

export default class Renderer {
    constructor() {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        this.debug = this.experience.debug

        this.setInstance()
        this.setEffectComposer()
        this.setRenderPass()
        if (this.debug.active)
            this.setDebug()
    }

    setInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        })
        this.instance.setClearColor("#000000")
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
    }

    setEffectComposer() {
        this.effectComposer = new EffectComposer(this.instance)
        this.effectComposer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
        this.effectComposer.setSize(this.sizes.width, this.sizes.height)
    }

    setRenderPass() {
        this.renderPass = new RenderPass(this.scene, this.camera)
        this.effectComposer.addPass(this.renderPass)

        this.unrealBloomPass = new UnrealBloomPass()
        this.unrealBloomPass.strength = 0.16
        this.unrealBloomPass.radius = 0.41
        this.unrealBloomPass.threshold = 0.65
        this.effectComposer.addPass(this.unrealBloomPass)

    }

    setDebug() {
        const RendererFolder = this.debug.ui.addFolder("Renderer")
        RendererFolder.add(this.unrealBloomPass, "strength").min(-10).max(10).step(0.0001).name("strength")
        RendererFolder.add(this.unrealBloomPass, "radius").min(0).max(10).step(0.0001).name("radius")
        RendererFolder.add(this.unrealBloomPass, "threshold").min(-10).max(10).step(0.0001).name("threshold")
    }

    resize() {
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.effectComposer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
        this.effectComposer.setSize(this.sizes.width, this.sizes.height)
    }

    update() {
        this.effectComposer.render()
    }
}