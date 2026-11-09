# worker-meet 작업지시서 (빠른 완성 모드)
소유 파일: js/features/meeting.js, location.js (이 2개만 수정)
읽을 것: 이 파일 → docs/SPEC.md의 meeting/location 섹션 → docs/DESIGN.md → docs/INTERFACE.md
원칙: 체크리스트 순서대로, 동작 우선 · 폴리시 후순위. 기능 하나 끝날 때마다 즉시 커밋+STATUS 기록.

## 시각 기준
- ~/teamflow/redesign-preview/AFTER-meeting-colorpicker.png, AFTER-location.png

## 체크리스트 — meeting.js
- [ ] 미팅 목록 (날짜·시간순, 색 표시)
- [ ] 생성/수정/삭제 모달 (제목, 날짜, 시작/종료, 회의실, 참석자 다중선택, 설명, 색)
- [ ] 같은 회의실·시간대 겹침 경고

## 체크리스트 — location.js
- [ ] 팀원 위치 현황 그리드 (locations)
- [ ] 내 위치 설정: 프리셋(사무실/재택/외근/휴가) + 직접 입력

## lead 추가 지시 (아래에 append 됨)
