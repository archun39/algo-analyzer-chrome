# algo-analyzer-chrome

Chrome Extension for Baekjoon Problem Analysis

## 프로젝트 소개

이 Chrome Extension은 백준 온라인 저지 웹사이트의 문제 상세 페이지에 접속하면, 해당 페이지에 '문제 분석하기' 버튼을 추가하여 AI 분석 서버와 연동한 알고리즘 문제 분석 결과를 제공합니다. 사용자는 버튼 클릭을 통해 문제의 시간 복잡도, 공간 복잡도, 알고리즘 유형 등 다양한 분석 정보를 직관적으로 확인할 수 있습니다.

## 기능

- **문제 페이지에 버튼 삽입**
  - 백준 문제 상세 페이지에 '문제 분석하기' 버튼을 추가하여, 사용자가 쉽게 문제 분석을 요청할 수 있도록 합니다.

- **백그라운드 스크립트 처리**
  - background.ts를 통해 확장 프로그램이 설치될 때 초기화 작업을 수행하며, 메시지 통신을 관리합니다.

- **분석 결과 표시**
  - contentScript.ts를 이용하여 분석 결과를 받아와 페이지 내 사이드 패널 또는 팝업에 표시합니다.

- **팝업 제공**
  - 확장 프로그램 아이콘을 클릭하면 추가 정보를 확인할 수 있는 팝업 페이지가 제공됩니다.

## 기술 스택

- **언어**: TypeScript, JavaScript
- **개발 도구**: Webpack, ts-loader
- **Chrome Extension API**: Manifest V3 기반
- **기타**: HTML, CSS (동적 스타일 적용)

## 폴더 구조

```
algo-analyzer-chrome/
├── src/
│   ├── background.ts         // 백그라운드 스크립트
│   ├── contentScript.ts      // 콘텐츠 스크립트 (문제 페이지에 버튼 및 결과 표시)
│   └── popup/                // 확장 프로그램 팝업 관련 파일
├── dist/
│   ├── background.js         // 컴파일된 백그라운드 스크립트
│   ├── contentScript.js      // 컴파일된 콘텐츠 스크립트
│   ├── popup.html            // 팝업 페이지 HTML
│   └── assets/               // 이미지 및 기타 정적 자원
├── manifest.json             // 크롬 확장 매니페스트 파일
├── webpack.config.js         // Webpack 설정 파일
└── README.md                 // 이 파일
```

## 설치 및 사용 방법

1. **빌드**
   - 의존성을 설치한 후, 아래 명령어로 프로젝트를 빌드합니다:
     ```bash
     npm install
     npm run build
     ```
   - 빌드 결과물은 **dist** 폴더에 생성됩니다.

2. **크롬 확장 프로그램 설치**
   - 크롬 브라우저를 열고, `chrome://extensions` 페이지로 이동합니다.
   - 우측 상단의 "개발자 모드"를 활성화합니다.
   - "압축해제된 확장 프로그램 로드" 버튼을 클릭한 후, 프로젝트의 **dist** 폴더를 선택합니다.

3. **확장 프로그램 사용**
   - 백준 문제 페이지(예: https://www.acmicpc.net/problem/XXXX)를 방문합니다.
   - 페이지 하단 우측에 '문제 분석하기' 버튼이 표시되며, 이를 클릭하면 AI 분석 서버로 분석 요청이 전송되고, 결과가 사이드 패널 또는 팝업으로 표시됩니다.

## 개발 및 디버깅

- **코드 수정 후 빌드**: 소스 코드 수정 후, 반드시 `npm run build` 명령어로 빌드 결과물을 갱신합니다.
- **디버깅**:
  - 백그라운드 스크립트 관련 로그는 크롬 확장 프로그램 콘솔에서 확인 가능합니다.
  - 콘텐츠 스크립트 오류는 해당 페이지의 콘솔에서 확인할 수 있습니다.
- **Webpack 설정**: 필요에 따라 webpack.config.js 파일을 수정하여 빌드 설정을 변경할 수 있습니다.

## 기타

- 이 확장 프로그램은 AI 분석 서버와 연동되어 실시간으로 문제 분석 요청을 처리합니다.
- 아이디어나 개선 사항은 GitHub 저장소를 통해 제안해주시기 바랍니다.
