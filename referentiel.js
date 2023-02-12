// contient le référentiel des mots clés,
// et les fonctions pour rechercher les mots clés dans le message rentré par l'utilisateur

module.exports.mapKeywordTag = function () {
  return [
    { keyword: "js", tag: "js" },
    { keyword: "javascript", tag: "js" },
    { keyword: "python", tag: "python" },
    { keyword: "http", tag: "link" },
    { keyword: "www", tag: "link" },
    { keyword: "youtube", tag: "vidéo" },
    { keyword: "smile", tag: "smile" },
    { keyword: "php", tag: "php" },
    { keyword: "vidéo", tag: "vidéo" },
    { keyword: "tuto", tag: "tuto" },
    { keyword: "node", tag: "node" },
    { keyword: "ada", tag: "ada" },
    { keyword: "lien", tag: "link" },
    { keyword: "site", tag: "link" },
    { keyword: "algo", tag: "algorithme" },
    { keyword: "algorithme", tag: "algorithme" },
    { keyword: "regex", tag: "regex" },
    { keyword: "regexp", tag: "regex" },
  ];
};

module.exports.getMapKeywordTag = function () {
  return this.mapKeywordTag;
};
//------------------

module.exports.getKeywordsSet = function () {
  let keywordsList = this.mapKeywordTag().map((e) => e.keyword);
  return [...new Set(keywordsList)];
};

module.exports.getKeywordsSetTrie = function () {
  let keywordsSet = this.getKeywordsSet().sort();
};

//
module.exports.getTagsSet = function () {
  let tagList = this.mapKeywordTag().map((e) => e.tag);
  return [...new Set(tagList)];
};

module.exports.getMatchedKeywordsWithTag = function (text) {
  //this.text = text;
  let mapKeywordTagTrie = this.mapKeywordTag().sort(function compare(a, b) {
    return a.keyword.localeCompare(b.keyword);
  });
  let matchedKeywordsWithTag = mapKeywordTagTrie.filter((keyword) => {
    return text.match(keyword.keyword) !== null;
  });

  return matchedKeywordsWithTag;
};

module.exports.getNoMatchedKeywordsWithTag = function (text) {
  let mapKeywordTagTrie = this.mapKeywordTag().sort(function compare(a, b) {
    return a.keyword.localeCompare(b.keyword);
  });
  let noMmatchedKeywordsWithTag = mapKeywordTagTrie.filter((keyword) => {
    return !text.match(keyword.keyword);
  });
  return noMmatchedKeywordsWithTag;
};

//
module.exports.getMatchedKeywordsSet = function (text) {
  let matchedKeywordsList = this.getMatchedKeywordsWithTag(text).map(
    (e) => e.keyword
  );
  return [...new Set(matchedKeywordsList)];
};

//
module.exports.getNoMatchedKeywordsSet = function (text) {
  let matchedKeywordsList = this.getNoMatchedKeywordsWithTag(text).map(
    (e) => e.keyword
  );
  return [...new Set(matchedKeywordsList)];
};

module.exports.getMatchedKeywordTagsSet = function (text) {
  let matchedKeywordTagsList = this.getMatchedKeywordsWithTag(text).map(
    (e) => e.tag
  );
  return [...new Set(matchedKeywordTagsList)];
};

//
module.exports.getMatchedKeywordTagsSet = function (text) {
  let matchedKeywordTagsList = this.getMatchedKeywordsWithTag(text).map(
    (e) => e.tag
  );
  return [...new Set(matchedKeywordTagsList)];
};

//
module.exports.getNoMatchedKeywordTagsSet = function (text) {
  let noMatchedKeywordTagsList = this.getNoMatchedKeywordsWithTag(text).map(
    (e) => e.tag
  );
  return [...new Set(noMatchedKeywordTagsList)];
};

//
module.exports.getMatchedTagsSet = function (text) {
  let matchedKeywordsList = this.getMatchedKeywordsWithTag(text).map(
    (e) => e.tag
  );
  return [...new Set(matchedKeywordsList)];
};
