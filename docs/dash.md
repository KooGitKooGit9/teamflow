# worker-dash 작업지시서 (빠른 완성 모드)
소유 파일: js/features/dashboard.js, memo.js (이 2개만 수정)
읽을 것: 이 파일 → docs/SPEC.md의 dashboard/memo 섹션 → docs/DESIGN.md → docs/INTERFACE.md
원칙: 체크리스트 순서대로, 동작 우선 · 시각 폴리시 후순위. 기능 하나 끝날 때마다 즉시 커밋+STATUS 기록.

## 시각 기준
- ~/teamflow/redesign-preview/AFTER-dashboard-light.png, AFTER-dashboard-dark.png

## 체크리스트 — dashboard.js
- [ ] 인사말 + 오늘 날짜 헤더
- [ ] 내 할 일 위젯 (todos: owner==Relay.me 필터, 추가/체크/삭제)
- [ ] 칸반 요약 위젯 (컬럼별 카드 수, 내 담당 카드, 클릭 → Relay.navigate('kanban'))
- [ ] 다가오는 미팅 3건 / 최근 게시글 3건 위젯 (클릭 → 해당 뷰로 navigate)
- [ ] 반응형 그리드 (2열 → 860px 이하 1열)

## 체크리스트 — memo.js
- [ ] memos 그리드 렌더 (포스트잇 스타일, color 반영)
- [ ] 새 메모 추가 (제목/내용/색), 수정/삭제
- [ ] 작성자(Relay.me)·작성일 표시

## 참고
- 데이터 형태는 INTERFACE.md 표가 전부. 원본 ~/teamflow/index.html 읽기 금지.

## lead 추가 지시 (아래에 append 됨)
