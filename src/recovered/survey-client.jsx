// 从公开脚本 AST 恢复；不是官方仓库原文件。原声明行号见 docs/source-index.json。
let SURVEY_ENDPOINTS = {
  econSurvey: "/api/econ-index/scenario-explorer/response",
};
function prepareSurveySubmission() {
  return Promise.resolve(undefined);
}
async function submitSurvey(endpoint, preparation, answers) {
  await preparation;
  try {
    localStorage.setItem(
      "econ-scenarios:last-response",
      JSON.stringify({
        answers,
        savedAt: new Date().toISOString(),
      }),
    );
  } catch (error) {
    console.warn("Cannot save the local scenario response:", error);
  }
}
Object.values(SURVEY_ENDPOINTS);
export { SURVEY_ENDPOINTS, prepareSurveySubmission, submitSurvey };
