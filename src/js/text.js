import * as THREE from "three";
import gsap from "gsap";

import fragment from "./shaders/fragment.glsl";
import vertex from "./shaders/vertex.glsl";

export default class Text {
  constructor(options) {
    this.scene = options.scene;

    this.loader = new THREE.FontLoader();
    this.textureLoader = new THREE.TextureLoader();
    this.strengthValue = 1;

    this.scrollValue = 0;

    this.textMaterial = null;
  }

  init() {
    this.addText();
    this.getScroll();
  }

  getScroll() {
    window.addEventListener("scroll", (e) => {
      this.scrollValue = window.scrollY / document.body.scrollHeight;
      console.log(this.scrollValue);
      this.animText();
    });
  }

  animText() {
    const steps = [0.04, 0.1];
    if (this.scrollValue > steps[0]) {
      gsap.to(this.textMaterial1.uniforms.opacity, {
        value: 0,
        duration: 1,
      });
      gsap.to(this.textMaterial2.uniforms.opacity, {
        value: 1,
        duration: 1,
      });
    }
    if (this.scrollValue > steps[1]) {
      gsap.to(this.textMaterial2.uniforms.opacity, {
        value: 0,
        duration: 1,
      });
    }
    this.tl = gsap.timeline();
    this.tl.to(this.textMaterial1.uniforms.activeLines, {
      value: this.scrollValue,
      duration: 1,
    });
  }

  addText() {
    const texts = ["HOW DO I FORGIVE MYSELF FOR MY OWN MISTAKES ?", "COULD YOU POSSIBLY HELP ME UNDERSTAND ?"];

    const materials = [
      (this.textMaterial1 = new THREE.ShaderMaterial({
        uniforms: {
          uStrength: { value: 0 },
          time: { value: 0 },
          index: { value: 1 },
          activeLines: { value: 0 },
          scroll: { value: 0 },
          opacity: { value: 1 },
        },
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
      })),
      (this.textMaterial2 = new THREE.ShaderMaterial({
        uniforms: {
          uStrength: { value: 0 },
          time: { value: 0 },
          index: { value: 4 },
          opacity: { value: 0 },
        },
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
      })),
    ];

    texts.forEach((text, i) => {
      this.createText(text, materials[i]);
    });
  }

  createText(text, material) {
    this.loader.load("/fonts/Moniqa-Display_Bold.json", (font) => {
      this.textDanceGeometry = new THREE.TextGeometry(text, {
        font: font,
        size: 0.5,
        height: 0,
        curveSegments: 10,
        bevelEnabled: false,
      });

      this.textDance = new THREE.Mesh(this.textDanceGeometry, material);

      this.textDanceGeometry.center();

      this.scene.add(this.textDance);
    });
  }

  anim(time) {
    this.textMaterial1.uniforms.time.value = time;
    this.textMaterial1.uniforms.scroll.value = this.scrollValue;
    this.textMaterial2.uniforms.time.value = time;
  }
}
