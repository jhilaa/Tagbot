const referentiel = require("../referentiel.js");

// asynchrone pour être sûr d'avoir les données de getMatchedKeywordsSet(text) (keyword qu'on retrouve dasn le texte saisi)
module.exports.getEphemeralBlock = async function (message) {
  let text = message.text;
  let matchedKeywordsSet = referentiel.getMatchedKeywordsSet(text);
  let matchedKeywordsWithTag = referentiel.getMatchedKeywordsWithTag(text);
  let mapKeywordTag = await referentiel.mapKeywordTag();
  let matchedKeywordTagsSet = referentiel.getMatchedKeywordTagsSet(text);
  let tagsSet = referentiel.getTagsSet();

  if (matchedKeywordsSet.length > 0 || text == "") {
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
          block_id: "multiSelect-group",
          text: {
            type: "mrkdwn",
            text: "Un tag et ça repart!",
          },
          accessory: {
            type: "multi_static_select",
            action_id: "static-select-action",
            options: tagsSet.map((e) => {
              return {
                text: { type: "plain_text", text: e, emoji: true },
                value: e,
              };
            }),
          },
        },
        //--------------
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
              action_id: "validateMultiSelect",
            },
          ],
        },
        //--------------
      ],
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
