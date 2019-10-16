module.exports = function(markdown, markup, includeBody) {
  return `content : List ( List String, { extension: String, frontMatter : String, body : Maybe String, staticData : Maybe String } )
content =
    [ ${markdown.concat(markup).map(entry => toEntry(entry, includeBody))}
    ]`;
};

function toEntry(entry, includeBody) {
  let fullPath = entry.path
    .replace(/(index)?\.[^/.]+$/, "")
    .split("/")
    .filter(item => item !== "")
    .map(fragment => `"${fragment}"`);
  fullPath.splice(0, 1);

  return `
  ( [${fullPath.join(", ")}]
    , { frontMatter = """${entry.metadata}
""" , body = ${body(entry, includeBody)}
    , staticData = ${staticData(entry, includeBody)}
    , extension = "${entry.extension}"
    } )
  `;
}

function body(entry, includeBody) {
  if (includeBody) {
    return `Just """${entry.body.replace(/\\/g, "\\\\")}
"""
`;
  } else {
    return `Nothing`;
  }
}

function staticData(entry, includeBody) {
  if (includeBody) {
    return `Just """${entry.staticData.replace(/\\/g, "\\\\")}
"""
`;
  } else {
    return `Nothing`;
  }
}
