# worker-kanban 작업지시서 (빠른 완성 모드)
소유 파일: js/features/kanban.js (이 1개만 수정)
읽을 것: 이 파일 → docs/SPEC.md의 kanban 섹션 → docs/DESIGN.md → docs/INTERFACE.md
원칙: 가장 무거운 기능이라 전체 일정의 병목이다. 체크리스트 순서대로 동작 우선,
hover 연출 등 폴리시는 전부 후순위. 항목 단위로 즉시 커밋+STATUS 기록.

## 시각 기준
- ~/teamflow/redesign-preview/AFTER-kanban-light.png, AFTER-cardmodal.png

## 체크리스트 — kanban.js
- [ ] columns 렌더 (컬럼 색, 카드 수 뱃지)
- [ ] 카드 생성 모달 (제목, 설명, 담당자=members, 시작/마감일, 태그)
- [ ] 카드 드래그앤드롭: 컬럼 간 이동 + 같은 컬럼 내 순서(order)
- [ ] 카드 상세 모달 (수정/삭제 + comments)
- [ ] 컬럼 추가/이름변경/삭제
- [ ] 마감 임박(3일)·초과 표시 (--warn / --danger)

## 참고
- 드래그 중 store.update 연타는 안전 (250ms 디바운스, INTERFACE.md)

## lead 추가 지시 (아래에 append 됨)
