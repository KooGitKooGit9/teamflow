# worker-board 작업지시서 (빠른 완성 모드)
소유 파일: js/features/board.js, profile.js (이 2개만 수정)
읽을 것: 이 파일 → docs/SPEC.md의 board/profile 섹션 → docs/DESIGN.md → docs/INTERFACE.md
원칙: 체크리스트 순서대로, 동작 우선 · 폴리시 후순위. 기능 하나 끝날 때마다 즉시 커밋+STATUS 기록.

## 시각 기준
- ~/teamflow/redesign-preview/AFTER-board.png, AFTER-profile-status-location.png

## 체크리스트 — board.js
- [ ] 게시글 목록 (최신순, pinned 상단)
- [ ] 작성/수정/삭제 (제목, 내용)
- [ ] 좋아요 토글(likes에 내 이름 add/remove), 조회수 증가, 상세 보기

## 체크리스트 — profile.js
- [ ] 내 프로필: 이름, 상태 메시지(statuses) 편집, 아바타 색(members[].color) 변경
- [ ] 팀원 목록 (이름, 색, 상태 메시지)
- [ ] members에 내가 없으면 첫 렌더 때 추가 — 중복 방지 확인

## lead 추가 지시 (아래에 append 됨)
