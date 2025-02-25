// contentScript.ts

// 문제 ID를 추출하는 함수
function getProblemId(): string | null {
  const url = window.location.href;
  const match = url.match(/\/problem\/(\d+)/);
  return match ? match[1] : null;
}

// 페이지에 버튼 추가
function addAnalyzeButton(problemId: string) {
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
    chrome.runtime.sendMessage({ action: "analyzeProblem", problemId }, (response) => {
      if (response.success) {
        displayAnalysisResult(response.data);
      } else {
        alert(`문제 분석 실패:\n${response.error}`);
      }
    });
  });

  document.body.appendChild(button);
}

// 분석 결과를 표시할 요소 추가
function displayAnalysisResult(data: any) {
  let resultDiv = document.getElementById('analysisResult');
  if (!resultDiv) {
    resultDiv = document.createElement('div');
    resultDiv.id = 'analysisResult';
    resultDiv.style.position = 'fixed';
    resultDiv.style.bottom = '60px';
    resultDiv.style.right = '20px';
    resultDiv.style.padding = '10px';
    resultDiv.style.backgroundColor = '#f9f9f9';
    resultDiv.style.border = '1px solid #ccc';
    resultDiv.style.borderRadius = '5px';
    resultDiv.style.zIndex = '1000';
    document.body.appendChild(resultDiv);
  }
  resultDiv.innerHTML = `<strong>분석 결과:</strong><pre>${JSON.stringify(data, null, 2)}</pre>`;
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