# Relay
팀 협업 SPA — 대시보드·칸반·캘린더·게시판·미팅·메시지·메모·위치·프로필.
실행: `node server.js` → http://localhost:3000 (데이터는 서버가 teamflow-data.json에 자동 저장)

## 전역 지침과의 우선순위
전역 CLAUDE.md와 충돌하면 이 파일이 우선한다.
특히: 불확실할 때 사용자에게 질문하고 멈추지 말 것.
- 사소한 불확실성(변수명, 기본값, 동급 선택지)은 합리적으로 결정해 진행하고,
  docs/STATUS.md에 `[판단] ...` 한 줄로 기록한다.
- 진짜 막힌 경우만 `[blocked→lead] ...` 를 남기고, 멈추지 말고 task 파일의
  다른 항목을 먼저 진행한다. 답변은 lead가 task 파일에 append 해준다.

## 에이전트와 파일 소유권 (위반 금지)
| 에이전트 | 소유 파일 |
|---|---|
| lead | index.html, css/, js/app.js, server.js, docs/ |
| worker-dash | js/features/dashboard.js, memo.js |
| worker-cal | js/features/calendar.js |
| worker-kanban | js/features/kanban.js |
| worker-chat | js/features/chat.js |
| worker-board | js/features/board.js, profile.js |
| worker-meet | js/features/meeting.js, location.js |

## 공통 규칙
1. 자기 소유 파일만 수정한다. 다른 워커의 코드는 열지 않는다 —
   공용 기능은 docs/INTERFACE.md의 계약만 신뢰하고 호출한다.
2. 세션 시작 시 읽는 파일: 자기 docs/tasks/*.md → docs/SPEC.md의 자기 섹션
   → docs/DESIGN.md 순서. 그 외 문서·코드는 필요할 때만 읽는다.
   기존 ~/teamflow/index.html 원본(118KB)은 절대 통째로 읽지 않는다 —
   필요한 발췌는 task 파일에 이미 포함돼 있다.
3. 작업 단위 완료 시: 커밋 → docs/STATUS.md 맨 아래 한 줄 append.
   형식: `[kanban] done: 카드 드래그 / next: 컬럼 필터`
4. 공용 API(app.js)·공용 CSS·index.html 변경이 필요하면 직접 고치지 말고
   STATUS.md에 `[요청→lead] ...` 로 남긴다.
5. 스타일: css/tokens.css의 CSS 변수만 사용한다. 색상·그림자 하드코딩 금지.
   기능별 CSS는 자기 feature 파일 안에서 `<style data-feature="이름">` 으로 주입한다.
6. API 키·시크릿은 환경변수로만 다룬다. 파일에 쓰지 않는다
   (server.js가 디렉터리 전체를 서빙하므로 파일에 쓰면 외부 노출).
7. 요청받지 않은 기능·리팩터링 금지. 모든 변경은 task 파일 항목으로 추적
   가능해야 한다.
8. 커밋 메시지 형식: `[에이전트명] 요약` (예: `[worker-kanban] 카드 드래그앤드롭 구현`)
