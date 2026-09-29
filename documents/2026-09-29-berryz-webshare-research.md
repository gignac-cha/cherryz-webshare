# Berryz WebShare 조사

- 조사일: 2026-09-29
- 목적: cherryz-webshare 프로토타입의 참고 대상인 옛 프로그램 Berryz WebShare(베리즈 웹쉐어)의 정체, 기능, 구조, 역사를 정리한다.
- 주의: 공식 홈페이지(`berryz.upnl.org`)는 사라졌고 Wayback Machine은 이번 조사 환경에서 접근할 수 없었다. 아래 내용은 나무위키, 개인 블로그, GitHub에 남은 서드파티 스킨·도구 소스를 교차 확인해 정리했다. 출처끼리 어긋나는 부분은 따로 표시했다.

---

## 1. 개요

| 항목 | 내용 |
|---|---|
| 정식 명칭 | Berryz WebShare (베리즈 웹쉐어) |
| 별칭 | "딸기밭" |
| 개발 | UPnL(유피넬), 서울대학교 컴퓨터공학부 동아리 |
| 이름 유래 | 공식 설명은 "**Very Easy**"의 줄임말. 실제로는 일본 아이돌 그룹 Berryz工房(Berryz Kobo)에서 따왔다는 설이 널리 퍼져 있다 |
| 종류 | Windows용 개인 웹 서버 겸 파일 공유 프로그램 |
| 배포 형태 | 설치가 필요 없는 ZIP. 압축을 풀고 실행 파일 하나만 실행하면 된다 |
| 마지막 버전 | 출처마다 다름. 0.953 (rev.1068, 나무위키), 0.952 Rev1157 (2010-02 블로그), 0.952 Rev1187 ("최종 배포판", Responsive_Berryz_Skin README) |
| 배포 중지 | 2011-03-06 (저작권 문제) |

### 핵심 아이디어

자기 PC의 파일/폴더를 골라 "공유"에 추가하면 PC가 곧바로 HTTP 서버가 된다. 받는 사람은 **웹 주소만 있으면 되고 클라이언트 설치가 필요 없다**. BitTorrent보다 기능은 약하지만 훨씬 쉽고, FTP보다도 간단하다는 점이 인기 요인이었다. 대신 공유하는 쪽은 포트포워딩이나 DMZ 같은 기본 네트워크 설정을 할 줄 알아야 했다.

당시 NateOn 파일 전송처럼 느리고 자주 끊기는 방식의 대안으로 쓰였다.

---

## 2. 기능

### 2.1 서버(호스트) 프로그램: Windows GUI

- **서버 켜기/끄기** 토글이 있는 메인 화면
- **환경 설정**
  - 포트 번호 지정
  - 표시할 IP 주소 선택 (여러 NIC/공인·사설 IP 중 무엇을 링크에 쓸지)
  - **포트 체크**: 외부에서 해당 포트로 접속되는지 확인하는 기능. 공유기 뒤에 있으면 포트포워딩/DMZ 설정을 안내한다
- **공유 추가**
  - 파일/폴더를 창에 drag-and-drop하거나 "공유 추가" 버튼으로 추가
  - 추가된 항목마다 URL이 표시되고, 그 주소를 복사해 상대에게 전달하는 방식
- **실시간 전송 현황** 창
- **계정·권한**
  - 기본 `anonymous` 계정 (삭제 불가). 익명 접근 허용 여부 설정 가능
  - ID/비밀번호로 사용자 계정 추가
  - 공유 항목별로 우클릭 메뉴에서 계정별 권한 지정
  - 권한 종류: 목록 보기, 다운로드, 업로드, 관리자 권한 등
- **스킨** 선택 (웹 화면 교체)
- **플러그인** (기본 플러그인 번들 제공)

### 2.2 웹(클라이언트) 화면: 브라우저

접속자는 브라우저로 다음을 할 수 있었다 (스킨·플러그인 구성에 따라 다름).

- 폴더 탐색, 파일 목록(유형/이름/크기/날짜) 정렬
- 파일 다운로드
- 로그인/로그아웃
- 업로드 (권한이 있을 때, 팝업 창 + 진행률 표시)
- 새 폴더 만들기
- 체크박스로 여러 파일 선택 → 플러그인 실행
  - 기본 플러그인 예: 이름 변경(Rename), 삭제(Delete), ZIP/RAR로 묶어 받기, `playlist.asx` 생성(미디어 스트리밍용)
- 하위 폴더 트리를 AJAX로 펼쳐 보기
- 커뮤니티 스킨이 추가한 기능: 이미지 뷰어, MP3/MP4 플레이어, 만화 뷰어(album 플러그인), 반응형/모바일 레이아웃

---

## 3. 내부 구조 (서드파티 스킨 소스로 역추적)

공식 기술 문서는 남아 있지 않다. 아래는 GitHub에 남은 스킨(`Codejune/berryz-bang-skin`)과 다운로더(`mirusu400/berryz-dl`) 코드에서 확인한 사실이다.

### 3.1 URL / HTTP 인터페이스

모든 기능이 **경로 + `?action=` 쿼리 파라미터** 한 가지 패턴으로 처리된다.

| 요청 | 의미 |
|---|---|
| `GET /<공유경로>/` | 해당 폴더 목록 페이지 (스킨으로 렌더링된 HTML) |
| `GET /<공유경로>/<파일>` | 파일 다운로드 |
| `GET .?action=Login` / `.?action=Logout` | 로그인 / 로그아웃 |
| `GET .?action=MakeDirectory&name=<이름>` | 현재 폴더에 새 폴더 생성 |
| `POST <경로>?action=Upload&key=<uniqueKey>` | `multipart/form-data` 업로드. 필드명 `uploadfile`, 여러 개 가능 |
| `GET ./?action=UploadStatus&key=<uniqueKey>` | 업로드 진행 상황 스트림. iframe에 로드하면 서버가 부모 창의 `onUpdateUpload(text, %)`와 `onUpdateProgress(%)`를 호출하는 스크립트를 흘려보내는 방식(당시의 Comet/iframe streaming) |
| `POST ?action=Plugin&type=<pluginId>` | 플러그인 실행. `selectedFiles` 폼 필드에 선택한 파일 링크를 줄바꿈으로 이어 붙여 전달 |
| `GET <경로>/?action=Subdir` | 하위 폴더 목록 (AJAX 트리용) |
| `GET /<skin>/<파일>?action=SkinFile` | 스킨 정적 자원 (CSS/JS/이미지) 제공 |

- 업로드 `uniqueKey`는 클라이언트가 `'[' + Math.random() + ']'`로 만든다. 서버는 이 키로 업로드와 진행 상황 요청을 짝짓는다.
- 폴더 목록 HTML 구조(기본/대부분 스킨): `<table class="sortable">` → `tbody > tr`마다 `td` 5개 (체크박스, 아이콘, 이름 링크, 크기, 날짜). 아이콘 `img`의 `alt="D"`이면 폴더. `berryz-dl`은 이 구조를 BeautifulSoup으로 파싱해 재귀적으로 전부 받는다.

### 3.2 스킨 시스템

스킨은 `Skin/<스킨이름>/` 폴더에 둔다. 플러그인은 `plugin/<이름>/`에 둔다.

**`setting.ini`**: 스킨 메타데이터와 서버가 노출할 파일 whitelist.

```ini
skin=skin.html
mimeType=text/html

files+=assets/css/style.css
files+=assets/js/common.js
files+=upload_frame.html
files+=upload_form.html
...
```

- `skin=`: 메인 템플릿 파일
- `files+=`: `?action=SkinFile`로 외부에 제공해도 되는 파일을 한 줄씩 등록. 목록에 없는 파일은 서빙하지 않는 방식으로 보인다

**템플릿 문법**: Velocity와 비슷한 `$변수` + `#if / #else / #end / #foreach` 지시어.

```html
#if( $current_login_id )
  $current_login_id 님 | <a href=".?action=Logout">로그아웃</a>
  #if( $upload_path ) ...업로드/폴더 생성 UI... #end
#else
  <a href=".?action=Login">로그인</a>
#end

#if( $show_files )
  <h4>$address</h4>
  #if( $display_upper ) ...상위 폴더 행... #end
  #foreach( $files )
    <tr id="tr#$link">
      #if ( $is_folder ) <a href="$link">$name</a>
      #else <a href="$link">$name</a> <span>$size</span>
      #end
    </tr>
  #end
#end
```

확인된 템플릿 변수:

| 변수 | 의미 |
|---|---|
| `$skin` | 현재 스킨 이름 (정적 자원 경로에 사용: `/$skin/...?action=SkinFile`) |
| `$current_login_id` | 로그인한 사용자 ID (없으면 미로그인) |
| `$upload_path` | 업로드 가능한 경로 (업로드 권한 있을 때만 값 있음) |
| `$content` | 목록 대신 표시할 본문 (로그인 폼, 메시지 등) |
| `$content_hide_back_button` | 본문 표시 시 뒤로 가기 버튼 숨김 여부 |
| `$show_files` | 파일 목록을 표시할지 |
| `$address` | 현재 경로 |
| `$display_upper` | 상위 폴더 링크 표시 여부 |
| `$files` (foreach) | 목록 항목. 항목마다 `$link`, `$name`, `$size`, `$is_folder` 등 |

**업로드 UI 구성** (스킨이 제공):

- `upload_frame.html`: 팝업 창. URL fragment로 `#<업로드경로>*<스킨이름>`을 받아 업로드 폼 iframe을 띄우고 진행률 표시
- `upload_form.html`: 실제 `<form enctype="multipart/form-data">`. "Add File"로 파일 입력칸을 늘릴 수 있음

주의: 스킨과 프로그램 버전이 맞지 않으면 페이지가 깨지거나 플러그인이 오작동하는 사례가 있었다.

---

## 4. 사용 문화

주로 DC인사이드 갤러리와 블로그에서 대용량 자료 배포용으로 쓰였다.

- 오덕 갤러리: 비주얼 노벨, 동인지, 애니메이션 등
- 컴퓨터 본체 갤러리: 유틸리티, 음악, TV 프로그램
- 만화 갤러리 등: 대량 파일 배포
- 고전 게임 갤러리: 레트로 게임
- PSP 갤러리: 스틱큐브와 함께 공유 수단을 양분
- 철도 갤러리: 다큐멘터리, 안내 방송, 철도 음향, 게임
- 리듬 게임 갤러리: OST
- 티스토리 블로그: 직접 업로드보다 안정적인 자료 제공 수단
- Source 엔진 게임 서버: 커스텀 맵·텍스처 배포 서버

링크 한 줄로 여러 명이 동시에 받아 가는 "딸기밭 열었다"류의 배포 문화가 있었다. 이런 성격 때문에 저작물 불법 공유 통로로도 쓰였다.

---

## 5. 배포 중지 (2011)

- **날짜**: 2011-03-06 (나무위키 등). 관련 블로그 글은 2011-05-25에 올라옴
- **경위**: 제이제이미디어웍스(JJ Media Works, 애니플러스의 대주주. 앞서 티비플을 상대로 소송을 낸 곳) 저작권 관리팀이 "베리즈 웹쉐어를 통해 불법 동영상이 공유되고 있으니 중단하라"는 메일을 Berryz 팀에 보냄
- **법적 배경**: 저작권법 제104조, 특수한 유형의 온라인서비스제공자는 권리자 요청 시 불법 전송을 차단하는 기술적 조치를 해야 함
- **팀의 판단**: 웹쉐어 구조상 개발자가 사용자가 무엇을 공유하는지 알 수도 통제할 수도 없으므로 차단 조치가 불가능 → 법적 위험을 줄이려고 배포를 중지
- **당시 반응**: "Apache나 IIS에 사용자 콘텐츠 책임을 묻는 것과 같다"는 비판이 있었음

이후 공식 사이트가 사라졌고, 개인 블로그·드라이브를 통한 재배포본만 돌아다닌다.

---

## 6. 이후와 대안

- **HFS (HTTP File Server)**: 가장 많이 거론되는 대안. 나무위키는 "훨씬 낫다"고 평가하고, 업데이트가 끝난 지 오래된 베리즈는 보안 취약점 우려로 쓰지 말 것을 권한다
- 커뮤니티 유지보수: 2015–2022년에도 GitHub에 스킨과 도구가 계속 올라옴
  - `Codejune/berryz-material-theme` (2021, Bootstrap 3 Material 테마)
  - `Codejune/berryz-bang-skin` (2020, Bootstrap 4 기반 테스트 스킨)
  - `senakriel/Responsive_Berryz_Skin` (2018, 반응형. 이미지 뷰어·MP3/MP4 플레이어 포함, 0.952 Rev1187 대상)
  - `dnjstlr555/yonas` (Rica 플러그인, wallel 원본 스킨, Noah 개작(2015–2017)을 바탕으로 한 커스텀 스킨)
  - `mAKEkr/mAKEkr_Berryz` (스킨 + 만화 뷰어 `album` 플러그인)
  - `mirusu400/berryz-dl` (2022, Python 재귀 일괄 다운로더)

---

## 7. cherryz-webshare 관점 메모

프로토타입 설계 때 참고할 만한 점:

1. **받는 쪽 설치 없음**이 핵심 가치다. 링크 하나로 끝나야 한다
2. **가장 큰 진입 장벽은 네트워크 설정**(포트포워딩/DMZ)이었다. 포트 체크 기능으로 완화하려 했지만 근본적으로 해결하지는 못했다. 현대 구현이라면 relay/tunnel(예: Cloudflare Tunnel, WebRTC, UPnP) 등으로 없앨 수 있는 부분
3. **스킨 시스템**(템플릿 + 정적 자원 whitelist)이 커뮤니티 생태계를 만들었다. 프로그램 배포가 끝난 뒤에도 10년 넘게 스킨이 만들어졌다
4. **`?action=` 단일 패턴 API**는 단순하지만 인증/CSRF 측면에서 취약하다 (GET으로 폴더 생성 등)
5. **법적 리스크**: 중앙 서버 없이 P2P 성격이어도 배포자가 "특수한 유형의 OSP"로 몰려 배포가 중지됐다. 공개 배포 시 신고/차단 체계를 어떻게 둘지 미리 고민해야 한다

---

## 출처

- [베리즈 웹쉐어 - 나무위키](https://namu.wiki/w/%EB%B2%A0%EB%A6%AC%EC%A6%88%20%EC%9B%B9%EC%89%90%EC%96%B4)
- [더위키 :: 베리즈 웹쉐어](https://the1.wiki/w/%EB%B2%A0%EB%A6%AC%EC%A6%88%20%EC%9B%B9%EC%89%90%EC%96%B4)
- [Berryz WebShare 배포가 중지되었다니... (zooins, 2011-05-25)](http://zooins.blogspot.com/2011/05/berryz-webshare.html)
- [Berryz Webshare(베리즈 웹쉐어)를 통한 간단한 파일공유 (Synergy's Blog, 2010-02)](http://synergy-textcube.blogspot.com/2010/02/berryz-webshare베리즈-웹쉐어를-통한-간단한-파일공유.html)
- [Berryz WebShare (웹 파일 공유 프로그램) - KOROMOON (2018-06-27)](https://koromoon.blogspot.com/2018/06/berryz-webshare.html)
- [베리즈 웹쉐어 vs HFS - kyuseo (soonsin.com)](https://soonsin.com/523) (조사 시점에 접속 불가)
- [웹파일공유시(HFS, BerryZ WebShare) 업로드 방법이 있나요? - 클리앙](https://www.clien.net/service/board/kin/442519)
- [Berryz WebShare - Software Informer](https://berryz-webshare.software.informer.com/)
- [GitHub topic: berryz-webshare](https://github.com/topics/berryz-webshare)
- [Codejune/berryz-bang-skin](https://github.com/Codejune/berryz-bang-skin): `setting.ini`, `skin.html`, `upload_form.html`, `upload_frame.html`, `assets/js/common.js`
- [mirusu400/berryz-dl](https://github.com/mirusu400/berryz-dl): `main.py`
- [senakriel/Responsive_Berryz_Skin](https://github.com/senakriel/Responsive_Berryz_Skin)
- [dnjstlr555/yonas](https://github.com/dnjstlr555/yonas)
- [mAKEkr/mAKEkr_Berryz](https://github.com/mAKEkr/mAKEkr_Berryz)
