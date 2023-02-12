const referentiel = require("../referentiel.js");

module.exports.getEphemeralBlock = function (message) {
  let text = message.text;
  let tagsSet = referentiel.getTagsSet();
  let tagsSet10 = tagsSet.slice(0, 10); // on est limité à 10 checkbox....
  let matchedKeywordTagsSet = referentiel.getMatchedKeywordTagsSet(text);
  
  let matchedKeywordsSet = referentiel.getMatchedKeywordsSet(text);
  let noMatchedKeywordTagsSet = referentiel.getNoMatchedKeywordTagsSet(text);
  //
  if (referentiel.getMatchedKeywordsSet(text).length > 0 || text == "") {
    let ephemeralBlock = {
      type: "modal",
      channel: "",
      user: "",
      text: "👋 Hi there",
      ts: "",
      //------------
      title: {
        type: "plain_text",
        text: "TagBot",
        emoji: true,
      },
      blocks: [
        {
          type: "section",
          block_id: "checkboxes-group",
          text: {
            type: "mrkdwn",
            text: "Checkboxes",
          },
          accessory: {
            type: "checkboxes",
            //block_id : "checkboxes",
            options: tagsSet10.map((e) => {
              // max 10 cases à cocher
              return {
                text: { type: "plain_text", text: e, emoji: true },
                value: e,
              };
            }),
            action_id: "checkboxes-action",
          },
        },
        {
          type: "actions",
          block_id: "action_block",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Annuler",
              },
              style: "danger",
              value: "annuler",
              action_id: "cancel",
            },
            //***************
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Valider",
              },
              style: "primary",
              value: "valider",
              action_id: "validateCheckbox",
            },
          ],
        },
      ],
      //********************************************
    };
    
    // on coche les cases pour qui correspondent à un mot-clé
    if (matchedKeywordTagsSet.length > 0) {
      ephemeralBlock.blocks[0].accessory.initial_options =
        matchedKeywordTagsSet.map((e) => {
          return {
            text: { type: "plain_text", text: e, emoji: true },
            value: e,
          };
        });
    }

    return ephemeralBlock;
  }
};
