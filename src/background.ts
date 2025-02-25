/// <reference types="chrome" />

chrome.runtime.onInstalled.addListener(() => {
  console.log('백준 분석기가 실행되었습니다');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // 분석 요청
    if (request.action === "analyzeProblem") {
      console.log(`Received request to analyze problem ID: ${request.problemId}`);
      fetch(`http://localhost:8080/api/problems/${request.problemId}`)
      .then(response => response.json())
      .then(data => {
        console.log('Analysis data received:', data);
        sendResponse({ success: true, data });
      })
      .catch(error => {
        console.error('Error during analysis:', error);
        sendResponse({ success: false, error: error.message });
      });
      return true;
    }
});