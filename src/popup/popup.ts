// popup.ts

document.getElementById('analyzeButton')?.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      const url = new URL(tab.url || '');
      const problemId = url.pathname.split('/').pop();
  
      if (problemId) {
        chrome.runtime.sendMessage({ action: "analyzeProblem", problemId }, (response) => {
          if (response.success) {
            // 결과 처리
            console.log(response.data);
          } else {
            // 에러 처리
            console.error(response.error);
          }
        });
      }
    });
  });