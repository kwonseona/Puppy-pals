# Puppy-Pals [개인 프로젝트]

## 🔧 Installation

1. Clone this repo by running `git clone https://github.com/kwonseona/Puppy-pals`
2. `cd Puppy-pals`
3. `npm install`
4. `npm run dev`

## ⚡️ Built With

| package name                    | version |
| ------------------------------- | ------- |
| @firebase/firestore             | ^3.11.0 |
| @types/firebase                 | ^3.2.1  |
| firebase                        | ^9.21.0 |
| react                           | ^18.2.0 |
| react-dom                       | ^18.2.0 |
| react-firebase-hooks            | ^3.0.4  |
| react-helmet                    | ^6.1.0  |
| react-icons                     | ^4.8.0  |
| react-infinite-scroll-component | ^6.1.0  |
| react-router-dom                | ^6.10.0 |

_자세한 개발 스택은 package.json 참고_

### 📄 Pages

1. `pages/Content.tsx` : 게시글 콘텐츠
2. `pages/Community.tsx` : 커뮤니티 페이지
3. `pages/Join.tsx` : 회원가입 페이지
4. `pages/Login.tsx` : 로그인 페이지
5. `pages/mainPage.tsx` : 메인 페이지
6. `pages/MyPage.tsx` : 마이페이지
7. `pages/MyPagePet.tsx` : 마이페이지 - 반려동물 정보 페이지
8. `pages/Post.tsx` : 게시글 작성 페이지
9. `pages/QnA.tsx` : QnA 페이지
10. `pages/SearchResiltPage.tsx` : 검색 결과 페이지

## 💁🏻‍♀️ Information

- [Project Notion](https://www.notion.so/2-4-980ec0107e1548fd9e50e6e61b931909?pvs=4)
- 제로베이스 - 개인 프로젝트

### 📝 기획 배경

- 반려동물 커뮤니티인 |Puppy Pals|는 반려동물을 키우는 사람들이 함께 모여 서로 배울수 있는 전용 공간에 대한 필요성이 커지면서 시작되었습니다.
- 반려동물을 키우는 사람들의 수가 증가함에 따라, 반려동물과 주인을 위해 기획된 커뮤니티가 필수적이라고 생각이 들었습니다.
- 대부분의 반려동물 커뮤니티는 제품의 홍보성이 강해 그 점을 분리 시켜, 진정성 있게 반려 동물에 대해 이야기를 할 수 있는 공간으로 사용하고 싶어 기획하게 되었습니다.

### 👀 기술 스택

> 기능 영상은 [유튜브](https://www.youtube.com/playlist?list=PLvtDFkreZZvxQ5lJrYEh6mUSK52qCL3Ki) 에서 고화질로 볼 수 있습니다.

- Home

  - 베스트 게시물 - 무한 스크롤 (infinite scroll)

- 로그인 페이지

  - HTML form
  - 비밀번호 체크 및 이메일 양식 확인

![로그인](https://github.com/kwonseona/Puppy-pals/assets/119383369/beba8f30-976b-4673-af39-149994e41285)
![구글_로그인](https://github.com/kwonseona/Puppy-pals/assets/119383369/197dbee7-b1a4-486a-b76d-993d4abb81af)
![회원가입](https://github.com/kwonseona/Puppy-pals/assets/119383369/c5bd2651-1ca7-4b21-8aed-7f020e3f0901)

- 커뮤니티/QnA

  - 페이지네이션
  - 로그인한 사용자만 게시물 작성 가능
  - 로그인하지 않은 사용자의 경우 로그인 페이지로 리디렉션
  - 좋아요 버튼과 댓글 작성
  - 글 작성
  - 첨부파일 등록 지원 (img 파일만 가능)
  - HTML form

![글쓰기_기능](https://github.com/kwonseona/Puppy-pals/assets/119383369/8065eb66-5d9a-4310-b653-58a8569d76dc)

- 마이페이지

  - 사용자 정보 편집
  - 프로필 이미지 등록

![마이페이지_기능](https://github.com/kwonseona/Puppy-pals/assets/119383369/a2925e9a-1d95-4374-ab0f-2c66567d849d)

- 검색
  - 제목 검색

![검색](https://github.com/kwonseona/Puppy-pals/assets/119383369/b9bdd3f1-1527-4b58-9a84-d9d34d28f203)

- 댓글/좋아요

  - 로그인한 사용자만 좋아요 및 댓글 작성 가능

![댓글](https://github.com/kwonseona/Puppy-pals/assets/119383369/5bd5299d-2a5e-498c-8c25-5703adde61e6)

> 댓글 작성

![댓글_수정](https://github.com/kwonseona/Puppy-pals/assets/119383369/a92cca40-14a0-4af6-81b9-229619c95f5e)

> 댓글 수정

![좋아요](https://github.com/kwonseona/Puppy-pals/assets/119383369/1e48bb50-8775-4fa3-96ad-33baf1d5cf08)

> 좋아요

### ⌚️ 개발 기간

2023-04-29 ~ 2023-05-15 (총 17일 소요)

### 📈 기여도

개인프로젝트 (100%)

## 🙍🏻‍♀️ Author

- [seona Kwon(권선아)](https://github.com/kwonseona)
