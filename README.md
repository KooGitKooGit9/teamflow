# TeamFlow

A framework in which **seven Claude Code agents work together on one goal**. The agents are seven Claude Code CLI sessions, one lead and six workers, each in its own tmux pane. They follow a small set of instruction files that say how the work is split, which files each agent may edit, and how problems are reported.

My team of four made it in a summer workshop on multi-agent software development (July 2026), aiming for a one-shot build: one prompt, then no human input. Our prompt asked for a team collaboration workspace as a web app (dashboard, kanban, calendar, board, messenger, meetings). The build ran to completion, and the team placed 2nd in the workshop competition.

## What is in this repository

| Path | What it is |
|---|---|
| `docs/CLAUDE.md` | The rules every agent follows, including the file-ownership table |
| `docs/SPEC.md` | What to build, one section per feature |
| `docs/DESIGN.md` | Design rules shared by all workers |
| `docs/INTERFACE.md` | The shared API contract; workers rely on it instead of reading each other's code |
| `docs/STATUS.md` | The append-only log the agents wrote during the build |
| `docs/dash.md`, `cal.md`, `kanban.md`, `chat.md`, `board.md`, `meet.md` | One task file per worker |

These are the framework's instruction files, edited for publication (run-specific paths and notes removed), and the status log from the build. They are in Korean. The code the agents wrote stayed on the Windows machine used in the workshop, so it is not included here.

## How the framework works

- **Team**: one lead and six workers (dash, cal, kanban, chat, board, meet), each a Claude Code CLI session in its own tmux pane on WSL2.
- **Tasks go out from the lead**: each worker starts from its own task file.
- **File ownership**: every agent edits only the files it owns. Workers never open another worker's code.
- **Shared contract**: workers rely only on `INTERFACE.md`; a change to a shared file is a request to the lead.
- **Small contexts**: each worker reads only its task file, its section of `SPEC.md`, and `DESIGN.md`.
- **Append-only log**: after each unit of work, an agent commits and appends one line to `STATUS.md` (done/next, a decision, or blocked). Notes and requests to the lead go through the same log.
- **Self-verification**: workers checked their own features with jsdom and Playwright.

A line from `STATUS.md`:

> **[meet] [notify→lead]** calendar.js and chat.js both declare `esc` in the global scope (no IIFE). When both load, "Identifier 'esc' has already been declared" stops chat.js from running (checked in the console). I don't own these files, so I didn't fix them; wrapping them in an IIFE or prefixing the names would solve it.

**My part**: I led the team of four and set the rules the agents work by (the ownership table, what each worker may read, and the log format), then ran the one-shot build and followed the status log.

---

**한국어 요약** — Claude Code 에이전트 7개(리더 1, 작업자 6)가 tmux에서 한 목표를 향해 함께 일하게 만든 프레임워크예요. 프롬프트 하나만 주고 그 뒤로는 사람이 끼어들지 않는 원샷 빌드를 목표로 했고, 우리가 준 프롬프트는 팀 협업 워크스페이스를 웹앱으로 만들라는 것이었어요. `docs/`에 에이전트들이 따른 규칙(파일 소유권), 공유 API 계약, 상태 로그가 들어 있어요(지시문은 공개용으로 다듬었고, 상태 로그는 그대로예요). 에이전트가 만든 코드는 특강 때 쓴 윈도우 PC에 남아 있어 이 저장소에는 없어요.
