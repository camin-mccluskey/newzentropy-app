'use client'

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

interface MiniMapProps {
  userVector: number[]
  storyVector: number[]
}

const MiniMap: React.FC<MiniMapProps> = ({ userVector, storyVector }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Setup scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf0f0f0)
    sceneRef.current = scene

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    )
    camera.position.set(2, 2, 2)

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controlsRef.current = controls

    // Add coordinate grid
    const gridHelper = new THREE.GridHelper(10, 10, 0x888888, 0x444444)
    scene.add(gridHelper)

    // Add coordinate axes
    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)

    const threeUserVector = new THREE.Vector3(...userVector.map((v) => v * 10))
    const userVectorObj = new THREE.ArrowHelper(
      threeUserVector.clone().normalize(),
      undefined,
      threeUserVector.clone().length(),
      THREE.Color.NAMES.blue,
    )
    scene.add(userVectorObj)

    const threeStoryVector = new THREE.Vector3(...storyVector.map((v) => v * 10))
    const storyVectorObj = new THREE.ArrowHelper(
      threeStoryVector.clone().normalize(),
      undefined,
      threeStoryVector.clone().length(),
      THREE.Color.NAMES.red,
    )
    scene.add(storyVectorObj)

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(2, 4, 2)
    scene.add(directionalLight)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      if (controlsRef.current) {
        controlsRef.current.update()
      }
      if (rendererRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, camera)
      }
    }
    animate()

    // Handle resize
    const handleResize = () => {
      const container = containerRef.current
      const renderer = rendererRef.current
      if (!container || !renderer) return

      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      const container = containerRef.current
      const renderer = rendererRef.current
      if (container && renderer) {
        container.removeChild(renderer.domElement)
        renderer.dispose()
      }
      if (sceneRef.current) {
        sceneRef.current.clear()
      }
    }
  }, [storyVector, userVector])

  return <div ref={containerRef} style={{ width: '100%', height: '300px', position: 'relative' }} />
}

export { MiniMap }
