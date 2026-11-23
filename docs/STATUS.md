# STATUS.md — 상태 로그 (맨 아래에 한 줄씩 append만 할 것, 수정·삭제 금지)
형식 예시:
  [kanban] done: 카드 드래그 / next: 컬럼 필터
  [dash] [판단] 캘린더 주 시작은 일요일로 결정
  [board] [blocked→lead] posts에 첨부파일 필드가 스펙에 없음, 확인 필요
  [lead] → board: 첨부는 이번 범위에서 제외. 계속 진행

---
[lead] Phase 0 완료: 스캐폴드(셸+로그인+동기화) 및 문서 작성, 초기 커밋. 워커 시작 가능
[lead] 빠른 완성 모드로 재편: 워커 6개(기능당 1~2개), 병렬 부팅, 지속 통합 검증
[lead] [판단] server.js defaultState()에 데이터모델(INTERFACE.md) 전체 시드 추가: members5/cards5/todos3/posts2/meetings2/memos2/statuses3/locations3/chats1. 날짜는 서버 기동 시각 기준 상대계산(오늘±). 로그인 시 실데이터로 즉시 렌더됨 → 각자 뷰를 빈화면 아닌 실데이터로 테스트할 것. 서버 재기동 완료(포트3000).
[chat] done: 1:1 메시지(멤버목록/대화창/전송/안읽음 강조) 구현+jsdom으로 렌더·전송·XSS이스케이프·안읽음 로직 검증 완료 / next: 없음(체크리스트 완료)
[meet] done: 미팅 목록(날짜·시간순, 색 표시)/생성·수정·삭제 모달/같은 회의실·시간대 겹침 경고 구현, playwright로 실데이터 렌더·겹침경고 확인 / next: location.js
[meet] [알림→lead] calendar.js와 chat.js가 둘 다 전역 스코프에 esc를 선언(IIFE 미사용)해 동시 로드 시 "Identifier 'esc' has already been declared"로 스크립트 순서상 나중인 chat.js 전체가 실행 안 됨(콘솔 확인). 두 파일은 소유자가 아니라 직접 안 고침 — worker-cal/worker-kanban이 IIFE로 감싸거나 이름 접두어(cal-/chat- 등) 붙이면 해결.
[meet] done: 위치 현황 그리드(프리셋 4종+동적 커스텀 그룹+미설정) / 내 위치 설정(프리셋 클릭·직접입력) 구현, playwright로 실데이터 렌더·프리셋 전환·직접입력 확인(테스트 후 원상복구 완료) / next: 없음(체크리스트 완료, meet.md 항목 전부 완료)
