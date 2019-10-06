<template>
  <div class="markdown-it-preview" v-html="HTML"></div>
</template>

<script>
import mkIt from "markdown-it";
import hljs from "highlight.js";
import mkItContainer from "markdown-it-container";
import mkItSub from "markdown-it-sub";
import mkItSup from "markdown-it-sup";
import mkItIns from "markdown-it-ins";
import mkItToc from "./md-toc.js";
import "highlight.js/styles/monokai-sublime.css";

export default {
  name: "v-markdown-it",
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  data() {
    let md = new mkIt({
      linkify: true,
      html: true,
      typographer: true,
      highlight(str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return (
              `<pre class="hljs"><code>` +
              hljs.highlight(lang, str, true).value +
              "</code></pre>"
            );
          } catch (__) {} // eslint-disable-line
        }

        // eslint-disable-next-line
        return (
          '<pre class="hljs"><code>' +
          md.utils.escapeHtml(str) +
          "</code></pre>"
        );
      }
    })
      .use(mkItContainer, "warning", {
        validate(params) {
          return params.trim() === "warning";
        },
        render(tokens, idx) {
          if (tokens[idx].nesting === 1) {
            return `<div class="vbook-warning-box">`;
          }
          return `</div>`;
        }
      })
      .use(mkItContainer, "error", {
        validate(params) {
          return params.trim() === "error";
        },
        render(tokens, idx) {
          if (tokens[idx].nesting === 1) {
            return `<div class="vbook-error-box">`;
          }
          return `</div>`;
        }
      })
      .use(mkItToc, {
        anchorLinkSymbol: ""
      })
      .use(mkItSub)
      .use(mkItSup)
      .use(mkItIns);

    return {
      md,
      htmlInner: ""
    };
  },
  computed: {
    HTML() {
      return `<div class="markdown-it-com">${this.md.render(this.value)}</div>`;
    }
  }
};
</script>

<style lang="scss">
.markdown-it-preview {
  margin: 2em;
  color: #333;

  @media (prefers-color-scheme: dark) {
    & {
      --titleColor: #fff;
    }
  }

  img {
    max-width: 100%;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  strong {
    margin-top: 1em;
    color: var(--mainColor);
    font-weight: 600;
    transition: 
      color .5s ease-in-out,
      border-color .5s ease-in-out;
  }

  h1, h2, h3, h4, h5, h6 {
    &:target {
      color: #e91e63;
    }
  }

  .markdown-it-com {
    max-width: 900px;

    & > h1 {
      margin-block-end: 15px;
      padding-block-end: 10px;
      font-size: 32px;
      border-bottom: 2px solid var(--mainLineColor);
    }
    & > h2 {
      margin-block-end: 15px;
      padding-block-end: 8px;
      font-size: 28px;
      border-bottom: 1px solid var(--mainLineColor);
    }
    & > h3 {
      font-size: 24px;
      margin-block-end: 10px;
    }
    & > h4 {
      font-size: 18px;
      margin-block-end: 10px;
    }
    & > h5 {
      font-size: 16px;
    }
    & > h6 {
      font-size: 14px;
    }

    hr {
      margin: 20px 0;
      border: none;
      border-bottom: 1px solid var(--mainLineColor);
    }

    p, summary {
      font-size: 14px;
      line-height: 28px;
      color: var(--mainColor);
      transition: color .5s ease-in-out;
    }

    & > ul {
      padding: 0 0 0 20px;
      margin-bottom: 10px;
      font-size: 14px;
      list-style-type: disc;

      li {
        color: var(--mainColor);
        transition: color .5s ease-in-out;
      }

      ul {
        list-style-type: circle;
        margin: 0 0 0 1em;

        ul {
          list-style-type: square;
        }
      }
    }

    ol {
      font-size: 14px;
      padding: 0 0 0 3em;
      margin-bottom: 10px;
    }

    a {
      color: #42b983;
    }

    & > table {
      margin-bottom: 20px;
      width: 100%;
      max-width: 100%;
      color: var(--mainColor);

      thead {
        tr {
          th {
            padding: 8px;
            font-size: 16px;
            text-align: left;
            vertical-align: bottom;
            border-bottom: 2px solid var(--mainLineColor);
            transition: border-color .5s ease-in-out;
          }
        }
      }
      tbody {
        tr {
          td {
            padding: 8px;
            font-size: 14px;
            line-height: 1.4;
            vertical-align: top;
            border-bottom: 1px solid var(--mainLineColor);
            transition: 
              color .5s ease-in-out,
              border-color .5s ease-in-out,
              background-color .5s ease-in-out;
          }
          &:nth-child(2n) {
            td {
              background-color: var(--mainLineColor);
            }
          }
        }
      }
    }

    // Emphasis
    em {
      font-style: italic;
    }

    .vbook-warning-box,
    .vbook-error-box,
    blockquote {
      margin: 1em 0;
      padding: 0.5em 0 0.5em 1em;
      border-left: 3px solid #42b983;
      background-color: rgba(66, 185, 130, 0.1);
    }

    .vbook-warning-box {
      border-color: #f90;
      background-color: rgba(255, 229, 100, 0.3);
    }
    .vbook-error-box {
      border-color: #f44336;
      background-color: rgba(244, 67, 54, 0.1);
    }

    pre {
      display: block;
      padding: 9.5px;
      margin: 0 0 10px;
      font-size: 13px;
      line-height: 1.42857143;
      word-break: break-all;
      word-wrap: break-word;
      border-radius: 4px;

      code {
        padding: 0;
        font-size: inherit;
        white-space: pre-wrap;
      }
    }
  }

  kdb {
    display: inline-block;
    padding: 3px 5px;
    line-height: 10px;
    color: #444d56;
    vertical-align: middle;
    background-color: #fafbfc;
    border: 1px solid #d1d5da;
    border-bottom-color: #c6cbd1;
    border-radius: 3px;
    box-shadow: inset 0 -1px 0 #c6cbd1;
  }
}
</style>