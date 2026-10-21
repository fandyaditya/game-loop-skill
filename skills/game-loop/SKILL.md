---
name: game-loop
description: >-
  Entry for the game-loop plugin. Use when building or changing a game in
  Codex or Claude Code. Routes the turn to one slice, then assets, a
  playtest judge, and rollback. Not for a desktop studio app.
---

# Game loop

This plugin replaces the heavy part of an AI game studio. Do the work with the four skills below. Do not invent a fifth process, a local model, or a preview app.

Order for a normal turn:

1. `$game-slice` decides the one playable change and edits only that.
2. `$game-assets` if the player will see or hear something new.
3. `$game-judge` on the running game. This is required before you say it works.
4. `$game-rollback` only if the judge says the slice got worse.

Stay on one agent. On an 8 GB machine, do not spawn a planner, a worker, and a reviewer together.

A big idea is a list of slices. Finish one, report it, and wait.
