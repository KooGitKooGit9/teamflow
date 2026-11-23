# worker-chat 작업지시서 (빠른 완성 모드)
소유 파일: js/features/chat.js (이 1개만 수정)
읽을 것: 이 파일 → docs/SPEC.md의 chat 섹션 → docs/DESIGN.md → docs/INTERFACE.md
원칙: 체크리스트 순서대로, 동작 우선 · 폴리시 후순위. 완료 즉시 커밋+STATUS 기록.

## 체크리스트 — chat.js
- [ ] 좌측 members 목록(본인 제외) + 우측 대화창 2단 레이아웃
- [ ] chats 키 규칙: 두 이름을 정렬해 'A|B' (INTERFACE.md)
- [ ] 메시지 전송(Enter), 내/상대 말풍선 구분, ts 시간 표시
- [ ] 안 읽은 상대 강조 (본 시점은 localStorage — 공유 상태 오염 금지)

## 참고
- 별도 서버 API 불필요 — chats도 공유 상태라 자동 동기화됨.
  서버 변경이 필요해 보이면 구현하지 말고 [요청→lead].

## lead 추가 지시 (아래에 append 됨)
