---
name: game-3d
description: >-
  Use for a 3D game: a perspective or chase camera, meshes, and materials.
  Use instead of game-2d. Skip if the project is sprites or tiles on a plane.
---

# 3D

Stay in a scene.

- Camera is perspective. A chase camera sits behind the player. A first-person camera sits at the eyes. Do not flatten the game into sprites unless the user asked for that.
- Under a chase camera, A turns left and D turns right. Left and right match the camera, not the world X axis if that axis points the other way.
- Art is meshes and materials the engine already has, or files already in the repo. Compose simple shapes into something readable. Do not add a 3D generator, Blender, or a model download.
- One directional light is enough. Do not add a post-processing stack, extra shadow cascades, or a second renderer.
- Reuse the existing scene, player, and camera. Do not spawn a second world.
- Keep the frame light. No per-frame allocation and no unbounded raycasts.

When you judge: the player is in frame within a few seconds, the new action is reachable, A turns left, and the scene is not a flat sprite pretending to be 3D.
