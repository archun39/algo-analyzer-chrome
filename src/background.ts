chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "analyzeProblem") {
      fetch('https://your-backend-api.com/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ problemId: request.problemId })
      })
      .then(response => response.json())
      .then(data => sendResponse({ success: true, data }))
      .catch(error => sendResponse({ success: false, error }));
      return true; // 비동기 응답을 위해 true 반환
    }
  });