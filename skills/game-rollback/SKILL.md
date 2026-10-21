---
name: game-rollback
description: >-
  Use when game-judge fails and this slice made the game worse. Restores
  only files this turn created or edited. Never cleans the repo or deletes
  the user's existing files.
---

# Game rollback

Before a risky slice, remember the files you will touch. You already read the old contents when you edited them. That memory is the snapshot. Do not copy the whole project.

If the judge fails and the last version was better:

- Files you created this turn: remove only those files.
- Files that already existed: put back the exact contents from before your edit. Do not leave a half-applied change.
- Do not run `git clean`, `git reset --hard`, or anything that touches files you did not edit.
- Do not delete assets the user already had.

If you are not sure a file is yours, leave it and say which path you refused to touch.

After rollback, the game should match the last passing slice. Say that, and stop. Do not immediately retry a bigger idea.
