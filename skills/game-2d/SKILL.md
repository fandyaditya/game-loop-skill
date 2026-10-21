---
name: game-2d
description: >-
  Use for a 2D game: side-on or top-down, sprites and tiles, no perspective
  camera. Use instead of game-3d. Skip if the project is already a 3D scene.
---

# 2D

Stay on a plane.

- Camera is orthographic, side-on or top-down. No orbit, no perspective, no chase cam in 3D space.
- Art is sprites, tiles, and SVG or PNG files in the project. Do not add a mesh, a model loader, or a 3D scene graph for a flat game.
- Use the 2D engine already in the repo. If there is none, a canvas or the engine's 2D nodes are enough. Do not install a 3D library.
- Input is on the plane. Left goes left. If the game jumps, the jump is one action, not a second controller.
- Collision is 2D. The player stands on a floor or a tile, not on a 3D collider you approximated with a billboard.
- Pixel art stays on whole pixels. Do not rotate sprites in perspective.

When you judge: the new action is readable in the first screen, the sprite is not cropped, and nothing is drawn with a 3D camera.
