"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var image_1 = require("next/image");
var page_module_css_1 = require("./page.module.css");
function Home() {
    return (<main className={page_module_css_1.default.main}>
      <div className={page_module_css_1.default.description}>
        <p>
          Get started by editing&nbsp;
          <code className={page_module_css_1.default.code}>src/app/page.tsx</code>
        </p>
        <div>
          <a href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer">
            By{' '}
            <image_1.default src="/vercel.svg" alt="Vercel Logo" className={page_module_css_1.default.vercelLogo} width={100} height={24} priority/>
          </a>
        </div>
      </div>

      <div className={page_module_css_1.default.center}>
        <image_1.default className={page_module_css_1.default.logo} src="/next.svg" alt="Next.js Logo" width={180} height={37} priority/>
      </div>

      <div className={page_module_css_1.default.grid}>
        <a href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app" className={page_module_css_1.default.card} target="_blank" rel="noopener noreferrer">
          <h2>
            Docs <span>-&gt;</span>
          </h2>
          <p>Find in-depth information about Next.js features and API.</p>
        </a>

        <a href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app" className={page_module_css_1.default.card} target="_blank" rel="noopener noreferrer">
          <h2>
            Learn <span>-&gt;</span>
          </h2>
          <p>Learn about Next.js in an interactive course with&nbsp;quizzes!</p>
        </a>

        <a href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app" className={page_module_css_1.default.card} target="_blank" rel="noopener noreferrer">
          <h2>
            Templates <span>-&gt;</span>
          </h2>
          <p>Explore the Next.js 13 playground.</p>
        </a>

        <a href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app" className={page_module_css_1.default.card} target="_blank" rel="noopener noreferrer">
          <h2>
            Deploy <span>-&gt;</span>
          </h2>
          <p>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
    </main>);
}
exports.default = Home;
