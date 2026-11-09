# SPEC.md — 기능 명세 (워커는 자기 섹션만 읽는다)

공통: 모든 화면은 라이트/다크 모두 지원(tokens.css 변수만 쓰면 자동),
반응형(860px 이하에서 무너지지 않게), 데이터는 INTERFACE.md의 상태 모델 사용.
시각 기준은 `~/teamflow/redesign-preview/` 스크린샷 (task 파일에 경로 명시).

## dashboard  ← worker-dash
- 위젯 그리드: ① 내 할 일(todos 중 owner==Relay.me, 체크로 done 토글, 추가/삭제)
  ② 칸반 요약(컬럼별 카드 수 + 내가 담당자인 카드 목록, 클릭 시 navigate('kanban'))
  ③ 다가오는 미팅(오늘 이후 meetings 3건) ④ 최근 게시글(posts 최신 3건, 클릭 시 navigate('board'))
- 상단 인사말: "안녕하세요, {이름}님" + 오늘 날짜

## calendar  ← worker-dash
- 월간 그리드 캘린더. 이전/다음 달 이동, 오늘 표시
- 표시 데이터: meetings(색상 점+제목) + 카드 마감일(cards.due)
- 날짜 클릭 → 해당 일자 일정 목록 패널

## memo  ← worker-dash
- 그리드형 포스트잇 보드: memos CRUD
- 카드 필드: 제목, 내용, 색(4~6개 파스텔 팔레트), 작성자, 작성일
- 새 메모 추가 버튼, 카드 hover 시 수정/삭제

## kanban  ← worker-kanban
- columns 렌더 (기본: 할 일/진행 중/완료), 컬럼 추가·이름변경·삭제
- cards CRUD: 제목, 설명, 담당자(members에서 선택), 시작/마감일, 태그
- 카드 드래그앤드롭으로 컬럼 간 이동 + 같은 컬럼 내 순서 변경(order)
- 카드 클릭 → 상세 모달(댓글 comments 포함)

## chat  ← worker-kanban
- 1:1 메시지. 좌측: members 목록(본인 제외), 우측: 선택한 상대와 대화
- chats 키는 두 이름을 정렬해 `A|B` 형태 (INTERFACE.md 참조)
- 전송 시 chats에 push → 상대 화면에는 서버 동기화로 자동 반영
- 새 메시지 온 상대는 목록에서 강조

## board  ← worker-board
- 게시글 목록(최신순, 고정글 pinned 상단) + 작성/수정/삭제
- 글 필드: 제목, 내용, 작성자, 작성일, 좋아요(likes 토글), 조회수
- 상세 보기 모달 또는 인라인 확장

## meeting  ← worker-board
- 미팅 목록(날짜순) + 생성/수정/삭제 모달
- 필드: 제목, 날짜, 시작/종료 시간, 회의실, 참석자(members 다중 선택), 설명, 색
- 같은 회의실·시간 겹침 시 경고 표시

## location  ← worker-board
- 팀원 근무 위치 보드: locations { 이름: 위치 }
- 내 위치 설정(사무실/재택/외근/휴가 등 프리셋 + 직접 입력)
- 팀원 전체 현황을 카드/그리드로 표시

## profile  ← worker-board
- 내 프로필: 이름, 상태 메시지(statuses), 아바타 색(members의 color)
- 팀원 목록 보기 (이름, 색, 상태 메시지)

## 셸/로그인 (구현 완료)  ← lead
- 로그인(회사/부서/이름/코드), 사이드바 내비, 테마 토글, 접속자 수 표시
