# DESIGN.md — 디자인 규칙 (Craft/Notion 스타일)

## 원칙
- **토큰만 사용**: 색·그림자·라운드는 전부 css/tokens.css 변수. 하드코딩 금지.
- 라이트가 기본, 다크는 `html[data-theme="dark"]`에서 토큰이 자동 전환됨 —
  변수만 썼다면 다크모드 대응 코드가 따로 필요 없다.
- 시각 기준: `~/teamflow/redesign-preview/AFTER-*.png` 스크린샷 (자기 기능 것만 볼 것)

## 자주 쓰는 토큰
| 용도 | 변수 |
|---|---|
| 배경 / 패널(카드) | `--bg` / `--panel` |
| 본문 / 보조 텍스트 | `--ink` / `--muted` |
| 테두리 / 옅은 배경 | `--line` / `--surface2` |
| 포인트 / 포인트 옅게 | `--brand` / `--brand-weak` |
| 성공·완료 / 경고 / 위험 | `--done` / `--warn` / `--danger` |
| 라운드 (일반/큰) | `--radius`(12px) / `--radius-lg`(16px) |
| 그림자 (약/중/강) | `--shadow-sm` / `--shadow-md` / `--shadow-lg` |

## 공용 컴포넌트 (base.css에 있음 — 재정의하지 말 것)
- `.card` 패널 카드 / `.btn` `.btn.primary` `.btn.danger` 버튼
- `.input` 입력 필드 / `.modal-back` + `.modal` 모달
- 투명도 섞기: `color-mix(in srgb, var(--brand) 16%, transparent)` 패턴 사용

## 스타일 감각
- 여백 넉넉하게, 14px 본문, 제목은 font-weight 700~800에 letter-spacing 살짝 음수
- hover는 `--surface2` 배경 전환, active 상태는 `--brand` 채움
- 모서리는 둥글게, 그림자는 은은하게 — 화려한 그라데이션·네온 금지
- 이모지 아이콘으로 시작하고, 필요 시 인라인 SVG(19~20px)로 교체 가능
