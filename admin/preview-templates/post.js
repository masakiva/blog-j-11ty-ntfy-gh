import htm from "https://unpkg.com/htm?module";
import format from "https://unpkg.com/date-fns@2.0.0-alpha.2/esm/format/index.js?module";

const html = htm.bind(h);

// Preview component for a Post
const Post = createClass({
  render() {
    const entry = this.props.entry;

    return html`
      <main>
        <article class="un-article">
          <h1 class="le-titre">${entry.getIn(["data", "title"], null)}</h1>
          <p>
            <time>${format(entry.getIn(["data", "date"], new Date()), "YYYY年M月D日")}</time>
          </p>

          <p>${entry.getIn(["data", "debut"], "")}</p>

          ${this.props.widgetFor("body")}
          <p>
            ${
              entry.getIn(["data", "tags"], []).map(
                tag =>
                  html`
                    <a href="#" rel="tag">${tag}</a>
                  `
              )
            }
          </p>
        </article>
      </main>
    `;
  }
});

export default Post;
