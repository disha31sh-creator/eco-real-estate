import { Vector3 } from 'three'

// Mutable values shared between 3D components every frame.
// (Kept outside React state on purpose: changing these must not re-render anything.)
export const rig = {
  /** smoothed journey progress, 0 to 1 */
  t: 0,
  /** a point in front of the camera, used to aim the sun and its shadows */
  focus: new Vector3(0, 0, 20),
}
