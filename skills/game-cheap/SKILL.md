---
name: game-cheap
description: >-
  Use when a 3D mesh needs to be split into parts, given a skeleton, and given
  one motion. Spends at most $1 of Tripo credits for the whole project. Do not
  use for 2D, and do not generate a new mesh.
---

# Cheap 3D pass

One existing GLB. Three calls. Then stop.

| Step | What | Credits | Dollars |
| --- | --- | --- | --- |
| Split | default mesh segment, not the smart one | 40 | $0.40 |
| Check | can this mesh take a skeleton | 0 | $0 |
| Skeleton | one auto-rig | 25 | $0.25 |
| Motion | one in-place preset clip | 10 | $0.10 |
| | | 75 | $0.75 |

The cap is 100 credits, one dollar. The script refuses the next call when the ledger plus that call would pass 100.

Run it with the game folder as the working directory, so the GLB and the ledger stay in the game. Point `node` at this plugin's `scripts/cheap.mjs`.

```
TRIPO_API_KEY=... node scripts/cheap.mjs run path/to/mesh.glb
```

Put no more than $1 of credits on the Tripo account. Split runs before the rig, because a split deletes any skeleton already on the mesh. The free check runs before the rig, and a mesh that fails it is not rigged.

Do not generate a mesh. Do not pass a v2 segment model. Do not batch clips. Do not buy a second dollar. Do not put the key in the repo. If the script says the cap is hit, stop and tell the user.

GLBs land in `assets/cheap/`. The ledger is `.game-loop-spend.json` in the game folder.
