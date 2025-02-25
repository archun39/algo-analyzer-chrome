// contentScript.ts

// 문제 ID를 추출하는 함수
function getProblemId(): string | null {
  const url = window.location.href;
  const match = url.match(/\/problem\/(\d+)/);
  return match ? match[1] : null;
}

// 페이지에 버튼 추가
function addAnalyzeButton(problemId: string) {
  console.log("버튼 시작");
  const existingButton = document.getElementById('analyzeButton');
  if (existingButton) return; // 이미 버튼이 존재하면 중복 추가 방지

  const button = document.createElement('button');
  button.id = 'analyzeButton';
  button.innerText = '문제 분석하기';
  button.style.position = 'fixed';
  button.style.bottom = '20px';
  button.style.right = '20px';
  button.style.padding = '10px 20px';
  button.style.backgroundColor = '#4CAF50';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '5px';
  button.style.cursor = 'pointer';
  button.style.zIndex = '1000';

  button.addEventListener('click', () => {
    console.log("문제 분석 시작");
    
    // 버튼 클릭 후 중복 클릭 방지를 위해 버튼 상태 변경
    button.disabled = true;
    button.style.backgroundColor = 'yellow'; // 노란색
    button.style.color = 'black'; // 검은색
    button.innerText = "문제 분석중입니다.";
    
    chrome.runtime.sendMessage({ action: "analyzeProblem", problemId }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("문제 분석 실패:", chrome.runtime.lastError);
        // 오류 발생 시 원래 상태로 복구
        button.disabled = false;
        button.style.backgroundColor = 'red';
        button.style.color = 'black';
        button.innerText = "문제 분석 불가";
        return;
      }
      console.log("문제 분석 진행중");
      if (response.success) {
        displayAnalysisResult(response.data);
        console.log("문제 분석 완료");
      } else {
        console.log(`문제 분석 실패:\n${response.error}`);
      }
      // 분석 결과 창이 뜨면 버튼 상태를 원래 상태로 복구
      button.disabled = false;
      button.style.backgroundColor = "#4CAF50";
      button.style.color = 'white';
      button.innerText = "문제 분석하기";
    });
  });

  document.body.appendChild(button);
}

// 분석 결과를 표시할 요소 추가 (화면을 우측 분할하여 사이드 패널 형태로 생성)
function displayAnalysisResult(data: any) {
  console.log("분석 결과 표시 시작");
  const panel = createAnalysisPanel();
  // 분석 응답 데이터 중 analysisResponse 항목만 추출 (없다면 전체 데이터 사용)
  const analysis = data.analysisResponse ? data.analysisResponse : data;
  // HTML 템플릿 생성 (정의 목록 사용)
  let htmlStr = generateAnalysisHTML(analysis);
  // 패널 내 컨텐츠 영역 업데이트
  const contentContainer = panel.querySelector("#analysisPanelContent");
  if (contentContainer) {
    contentContainer.innerHTML = htmlStr;
  }
}

// 초기화 함수
function init() {
  const problemId = getProblemId();
  if (problemId) {
    addAnalyzeButton(problemId);
  }
}

// 페이지 로드 시 초기화
window.addEventListener('load', init);

// 헬퍼 함수: 사이드 패널 생성 (이미 있으면 재사용)
function createAnalysisPanel(): HTMLElement {
  let panel = document.getElementById("analysisPanel");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "analysisPanel";
    panel.style.position = "fixed";
    panel.style.top = "0";
    panel.style.right = "0";
    panel.style.width = "40%";
    panel.style.height = "100%";
    panel.style.backgroundColor = "#fff";
    panel.style.borderLeft = "2px solid #ccc";
    panel.style.zIndex = "9999";
    panel.style.overflowY = "auto";

    // 패널 상단 헤더 생성 (제목 및 닫기 버튼)
    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";
    header.style.padding = "10px";
    header.style.backgroundColor = "#f5f5f5";
    header.style.borderBottom = "1px solid #ccc";

    const title = document.createElement("h2");
    title.innerText = "문제 분석 결과";
    title.style.fontSize = "16px";
    title.style.margin = "0";

    const closeBtn = document.createElement("button");
    closeBtn.innerText = "닫기";
    closeBtn.style.cursor = "pointer";
    closeBtn.addEventListener("click", () => {
      panel?.remove();
      document.body.style.marginRight = "0";
    });

    header.appendChild(title);
    header.appendChild(closeBtn);
    panel.appendChild(header);

    // 패널 컨텐츠 영역 생성
    const contentContainer = document.createElement("div");
    contentContainer.id = "analysisPanelContent";
    contentContainer.style.padding = "10px";
    panel.appendChild(contentContainer);

    // 패널을 문서에 추가
    document.body.appendChild(panel);
    document.body.style.marginRight = "40%";
  }
  return panel;
}

// 헬퍼 함수: 분석 데이터로 HTML 템플릿 생성
function generateAnalysisHTML(analysis: any): string {
  let htmlStr = "<dl style='margin:0; padding: 0 10px;'>";
  if (analysis.problemId) {
    htmlStr += `<dt style="font-weight:bold;">문제번호:</dt><dd>${analysis.problemId}</dd>`;
  }
  if (analysis.algorithmType) {
    htmlStr += `<dt style="font-weight:bold;">알고리즘 유형:</dt><dd>${analysis.algorithmType}</dd>`;
  }
  if (analysis.algorithmTypeReasoning) {
    htmlStr += `<dt style="font-weight:bold;">알고리즘 유형 근거:</dt><dd>${analysis.algorithmTypeReasoning}</dd>`;
  }
  if (analysis.dataStructures) {
    htmlStr += `<dt style="font-weight:bold;">사용된 자료구조:</dt><dd>${analysis.dataStructures}</dd>`;
  }
  if (analysis.dataStructuresReasoning) {
    htmlStr += `<dt style="font-weight:bold;">자료구조 근거:</dt><dd>${analysis.dataStructuresReasoning}</dd>`;
  }
  if (analysis.solutionImplementation) {
    htmlStr += `<dt style="font-weight:bold;">해결 방법:</dt><dd>${analysis.solutionImplementation}</dd>`;
  }
  if (analysis.solutionImplementationReasoning) {
    htmlStr += `<dt style="font-weight:bold;">해결 방법 근거:</dt><dd>${analysis.solutionImplementationReasoning}</dd>`;
  }
  if (analysis.spaceComplexity) {
    htmlStr += `<dt style="font-weight:bold;">공간 복잡도:</dt><dd>${analysis.spaceComplexity}</dd>`;
  }
  if (analysis.spaceComplexityReasoning) {
    htmlStr += `<dt style="font-weight:bold;">공간 복잡도 근거:</dt><dd>${analysis.spaceComplexityReasoning}</dd>`;
  }
  if (analysis.timeComplexity !== undefined && analysis.timeComplexity !== null) {
    htmlStr += `<dt style="font-weight:bold;">시간 복잡도:</dt><dd>${analysis.timeComplexity}</dd>`;
  } else {
    htmlStr += `<dt style="font-weight:bold;">시간 복잡도:</dt><dd>N/A</dd>`;
  }
  if (analysis.timeComplexityReasoning) {
    htmlStr += `<dt style="font-weight:bold;">시간 복잡도 근거:</dt><dd>${analysis.timeComplexityReasoning}</dd>`;
  }
  htmlStr += "</dl>";
  return htmlStr;
} 