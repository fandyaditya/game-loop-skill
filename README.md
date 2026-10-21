# game-loop

A light game-dev skill for **Claude Code** and **Codex**.

One playable change at a time, a real playtest before "done", and generated art and audio instead of placeholders. It is the useful part of a heavy AI game studio, without the desktop app, so it stays usable on an 8 GB machine.

The instructions are one `SKILL.md`. Claude loads it as a plugin. Codex loads the same file from `.agents/skills`.

## Claude Code

```
/plugin marketplace add fandyaditya/game-loop-skill
/plugin install game-loop@game-loop
```

Or, without the marketplace, copy [skills/game-loop](skills/game-loop) to `.claude/skills/game-loop` in the game project (or `~/.claude/skills/game-loop` for every project).

## Codex

Copy [skills/game-loop](skills/game-loop) into the game project:

```
mkdir -p .agents/skills
cp -R skills/game-loop .agents/skills/game-loop
```

Use `~/.agents/skills/game-loop` if you want it in every project. Older Codex builds also read `.codex/skills`; the same folder works there.

In a Codex session you can call it with `$game-loop`.

This repo also keeps a copy at `.agents/skills/game-loop` so opening the repo itself in Codex discovers the skill. In a game project, copy the folder across. Do not point Codex at this repo and expect it to build your game here.

## Both at once

If you use the skills CLI:

```
npx skills add fandyaditya/game-loop-skill
```

## Assets

This skill does not bundle a generator. When a slice needs models, textures, or audio, it tells the agent to use the Genex skill if you have already installed it:

```
set up https://genex.games/SKILL.md
```

## License

MIT. See [LICENSE](LICENSE).
