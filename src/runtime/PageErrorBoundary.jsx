import { Component } from "react";

// 恢复源码保留复杂 SVG 与模型交互。发生渲染异常时，明确报告，不留下空白页。
export class PageErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Economic scenarios rendering failed:", error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <section className="study-error" role="alert">
        <h1>页面加载失败</h1>
        <p>请查看控制台错误；刷新页面可重新初始化图表。</p>
        <pre>{this.state.error.message}</pre>
        <button type="button" onClick={() => window.location.reload()}>
          重新加载
        </button>
      </section>
    );
  }
}
