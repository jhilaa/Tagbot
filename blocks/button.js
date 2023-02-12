const referentiel = require("../referentiel.js");

module.exports.getEphemeralBlock = function (message, toogleReaction) {
  let text = message.text;
  let ts = message.ts;
  let matchedKeywordsSet = referentiel.getMatchedKeywordsSet(text);
  let matchedKeywordTagsSet = referentiel.getMatchedKeywordTagsSet(text);
  let noMatchedKeywordTagsSet = referentiel.getNoMatchedKeywordTagsSet(text);

  let matchedTagButtonList = [];
  let noMatchedTagButtonList = [];

  if (matchedKeywordsSet.length > 0 || text == "") {
    if ((text = "")) {
      //pas de texte , donc on pose la question des mots-clé à ajouter
      noMatchedKeywordTagsSet = referentiel.getTagsSet();
    }
    // on construit le tableau des boutons pour les mots clé qu'on retrouve dans le texte
    else if (matchedKeywordsSet.length > 0) {
      // on a trouvé des mot-cles dans le message
      matchedKeywordTagsSet.forEach((tag) => {
        toogleReaction(tag);
        let button = {
          type: "button",
          text: {
            type: "plain_text", // type : "mrkdwn" produit un block invalide :(
            text: tag, // du coup on ne peut pas formater le texte
            emoji: true,
          },
          style: "primary",
          value: tag,
          action_id: "toggleTagButton" + "|" + tag + "|" + ts,
        };
        matchedTagButtonList.push(button);
      });
    }

    console.log("noMatchedKeywordTagsSet");
    console.log(noMatchedKeywordTagsSet);
    // on construit le tableau des boutons pour les mots clé qu'on ne retrouve pas dans le texte
    if (noMatchedKeywordTagsSet.length > 0) {
      noMatchedKeywordTagsSet.forEach((tag) => {
        let button = {
          type: "button",
          text: {
            type: "plain_text", // type : "mrkdwn" produit un block invalide :(
            text: tag, // du coup on ne peut pas formater le texte
            emoji: true,
          },
          value: tag,
          action_id: "toggleTagButton" + "|" + tag, // + "|" + ts,
        };
        noMatchedTagButtonList.push(button);
      });
    }

    //-----------------
    // on construit le bloc à renvoyer
    let ephemeralBlock = {};
    (ephemeralBlock.type = "modal"),
      (ephemeralBlock.channel = ""),
      (ephemeralBlock.user = ""),
      (ephemeralBlock.text = "👋 Hi there"),
      (ephemeralBlock.ts = ""),
      //------------
      (ephemeralBlock.title = {
        type: "plain_text",
        text: "TagBot",
        emoji: true,
      });
    ephemeralBlock.blocks = [];
    ephemeralBlock.blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Click to add ore remove tag",
      },
    });
    if (matchedTagButtonList.length > 0) {
      ephemeralBlock.blocks.push({
        type: "actions",
        block_id: "matchButtonBlock",
        elements: matchedTagButtonList,
      });
    }
    if (noMatchedTagButtonList.length > 0) {
      ephemeralBlock.blocks.push({
        type: "actions",
        block_id: "noMatchButtonBlock",
        elements: noMatchedTagButtonList,
      });
    }
    ephemeralBlock.blocks.push({
      type: "actions",
      block_id: "action_block",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Terminer",
          },
          style: "primary",
          value: "annuler",
          action_id: "cancel",
        },
      ],
    });
    return ephemeralBlock;
  }
};
