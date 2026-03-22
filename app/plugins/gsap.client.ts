import { gsap } from 'gsap'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'

gsap.registerPlugin(MorphSVGPlugin, ScrambleTextPlugin)

export default defineNuxtPlugin(() => {
  return {
    provide: {
      gsap,
    },
  }
})
