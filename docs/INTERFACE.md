# INTERFACE.md — 공용 API 계약 (js/app.js, lead만 수정)

워커는 이 계약만 신뢰한다. app.js 코드를 직접 읽을 필요 없음.
변경이 필요하면 STATUS.md에 `[요청→lead]` 로 남긴다.

## 기능 등록

각 feature 파일은 로드 시점에 자신을 등록한다 (스텁에 이미 작성돼 있음):

```js
Relay.register('kanban', {
  title: '칸반',          // 사이드바·상단바 표시명
  icon: '📋',             // 사이드바 아이콘 (이모지 또는 인라인 SVG 문자열)
  render(el) { ... },     // el(main#view)에 화면을 그린다
});
```

- `render(el)`는 **멱등**해야 한다: 호출될 때마다 el을 처음부터 다시 그린다.
  (다른 접속자가 상태를 바꾸면 서버 push로 render가 다시 호출됨)
- 사이드바 순서 = index.html의 script 순서 (lead 소유)

## 상태 (작업공간 공유 데이터 — 접속자 전원에게 실시간 동기화됨)

```js
Relay.store.s              // 현재 상태 객체 (읽기 전용으로 취급)
Relay.store.update(s => {  // 쓰기: 콜백 안에서 직접 변형
  (s.memos ||= []).push({ id: Relay.uid(), ... });
});                        // → 자동으로 서버 전송 + 재렌더
```

- **키가 없을 수 있다.** 읽을 때 `s.memos || []`, 쓸 때 `s.memos ||= []` 필수.
- update() 밖에서 상태를 변형하지 말 것 (동기화 안 됨).
- update()는 250ms 디바운스로 서버에 전송된다. 드래그 중 연타 호출해도 안전.

## 상태 데이터 모델 (기존 앱과 동일 — 이 형태를 유지할 것)

| 키 | 형태 | 사용 기능 |
|---|---|---|
| columns | `[{id, title, color}]` | 칸반 |
| cards | `[{id, title, desc, col, assignees[], start, due, tags[], comments[], order}]` | 칸반, 대시보드, 캘린더 |
| todos | `[{id, owner, text, done}]` | 대시보드 |
| posts | `[{id, author, title, text, ts, likes[], poll, pinned, views}]` | 게시판, 대시보드 |
| chats | `{ "이름A|이름B": [{from, text, ts}] }` (키는 두 이름을 정렬해 `\|`로 연결) | 메시지 |
| notifications | `[{to, text, ts, read}]` | 셸(추후) |
| members | `[{name, color}]` | 프로필, 메시지, 칸반 담당자 |
| meetings | `[{id, title, date, start, end, room, attendees[], desc, by, color}]` | 미팅, 캘린더 |
| statuses | `{ 이름: 상태문자열 }` | 프로필 |
| locations | `{ 이름: 위치 }` | 위치 |
| memos | `[{id, title, text, color, author, ts}]` | 메모 |

- 날짜는 `YYYY-MM-DD` 문자열, 시간은 `HH:MM`, ts는 `Date.now()` 숫자.
- id 생성은 `Relay.uid()` 사용.

## 세션/유틸

```js
Relay.me            // 로그인한 내 이름 (string, 로그인 전 null)
Relay.session       // { token, name, company, dept }
Relay.uid()         // 고유 id 문자열 생성
Relay.navigate(id)  // 다른 뷰로 이동 (예: 대시보드 위젯 → 칸반)
```

## 기능별 CSS 주입 패턴

```js
document.head.insertAdjacentHTML('beforeend',
  `<style data-feature="kanban"> .kb-col { background: var(--surface2); } </style>`);
```

파일 최상단에서 1회만 실행. 클래스명은 기능 접두어(kb-, cal-, memo- 등)로 충돌 방지.
