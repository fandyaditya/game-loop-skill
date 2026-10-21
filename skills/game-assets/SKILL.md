---
name: game-assets
description: >-
  Use when a game needs art, a model, a texture, sound, music, or a character
  the player will see or hear. Uses files already in the project, or simple
  files you create there. Skip for code-only fixes. Do not call an external
  asset API.
---

# Game assets

Do not ship a colored box, a missing texture, or silence when the slice is supposed to look or sound like something.

1. Reuse a file already in the project if it fits.
2. If it does not, add a file you create in the repo: SVG, a small image, a short generated tone, or a mesh the engine already knows how to load.
3. Put it in the project's asset folder and reference that path. Name the file after what it is.

Do not call an external asset service. Do not ask the user for an API key. Do not add a generator dependency.

You may add files and edit files you created. Do not delete or overwrite anything you did not create.
