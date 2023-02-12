const { WebClient } = require("@slack/web-api");
const { App } = require("@slack/bolt");
const checkboxes = require("./blocks/checkboxes.js");
const multiselect = require("./blocks/multiselect.js");
const buttons = require("./blocks/button.js");
const options = require("./blocks/options.js");
const home = require("./blocks/home.js");
const superagent = require("superagent"); //const superagent = require('superagent');

const slack_bot_token = process.env.SLACK_BOT_TOKEN;
const slack_user_token = process.env.SLACK_USER_TOKEN;
const signing_secret = process.env.SLACK_SIGNING_SECRET;

const app = new App({
  token: slack_bot_token,
  signingSecret: signing_secret,
});
const webClient = new WebClient(slack_bot_token);

let message,
  blocks,
  channel,
  ts,
  user,
  modalType,
  optionsSet,
  ephemeralBlockOptionOk,
  modalBlock,
  ephemeralBlock;

optionsSet = ["multiselect", "checkbox", "button"];
modalType = "multiselect"; //option par défaut

//== ouverture du menu "home" de l'appli ==============
app.event("app_home_opened", async ({ event, client, context }) => {
  try {
    const result = await client.views.publish({
      user_id: event.user,
      view: {
        type: "home",
        callback_id: "home_view",
        blocks: await home.getHome(optionsSet, modalType),
      },
    });
  } catch (error) {
    console.error(error);
  }
});

//== slash command "tagbot" ===================
app.command("/tagbot", async ({ ack, body, respond }) => {
  await ack();
  console.log("test");
  console.log(body);
  // si l'utilisateur a choisi une option valide en appelant la slash commande,
  // TODO : on affiche le block signifiant que l'option a bien été prise en compte
  if (optionsSet.includes(body.text)) {
    modalType = body.text;
  }
  // sinon a affiche une fenêtre modale pour saisir l'option à appliquer
  else {
    modalBlock = await options.getModalBlockOptions(
      body,
      optionsSet,
      modalType
    );
    await webClient.views.open(modalBlock);
  }
});

//== choix des radio boutons dans la home page ============
app.action("radio-buttons-action", async ({ ack, respond, body }) => {
  await ack();
  modalType = body.actions[0].selected_option.value;
});

//== nouveau message utilisateur =======
app.event("message", async ({ message }) => {
  channel = message.channel;
  user = message.user;
  ts = message.ts;

  // selon le type de fenêtre défini en option
  if (modalType == "checkbox") {
    ephemeralBlock = await checkboxes.getEphemeralBlock(message);
  }
  if (modalType == "button") {
    ephemeralBlock = await buttons.getEphemeralBlock(message, toogleReaction);
  }
  if (modalType == "multiselect") {
    ephemeralBlock = await multiselect.getEphemeralBlock(message);
  }
  if (ephemeralBlock != undefined) {
    if (ephemeralBlock.blocks != undefined) {
      ephemeralBlock.channel = channel;
      ephemeralBlock.user = user;
      ephemeralBlock.ts = ts;
      ephemeralBlock.text = `👋 Hi <@${message.user}>`;

      webClient.chat.postEphemeral(ephemeralBlock);
    }
  }
});

//== fermeture du ephemeral message ============
let closeEphemeral = async function (respond, ack) {
  await ack;
  await respond({
    response_type: "ephemeral",
    text: "",
    replace_original: true,
    delete_original: true,
  });
};

//== quand on déclenche une action "cancel", on ferme l'ephemeral
app.action(/cancel/i, async ({ ack, respond }) => {
  await ack();
  closeEphemeral(respond);
});

//== validation du choix des checkboxe ============
app.action(/validateCheckbox/i, async ({ ack, respond, body }) => {
  await ack();
  // dans selectedOptions on récupère les choix faits avec les checkboxes
  let selectedOptions =
    body.state.values["checkboxes-group"]["checkboxes-action"].selected_options;
  // on met les réactions au message à partir de là
  selectedOptions.forEach((tag) => toogleReaction(tag.value));
  closeEphemeral(respond);
});

//== validation du multiselect
app.action(/validateMultiSelect/i, async ({ ack, respond, body }) => {
  await ack();
  // dans selectedOptions on récupère les choix faits avec les multigroup
  let selectedOptions =
    body.state.values["multiSelect-group"]["static-select-action"]
      .selected_options;
  selectedOptions.forEach((tag) => toogleReaction(tag.value));
  closeEphemeral(respond);
});

//== ajout ou suppression d'un tag
app.action(/toggleTagButton/, async ({ ack, body, respond }) => {
  await ack();
  let tag = body.actions[0].action_id.split("|")[1];
  let ts = body.actions[0].action_id.split("|")[2];
  let channel = body.container.channel_id;
  toogleReaction(tag);
});

//== ajout ou suppression d'un tag
let toogleReaction = async function (tag) {
  console.log("toogleReaction");
  let reactions;
  reactions = await webClient.reactions.get({
    token: slack_bot_token,
    channel: channel,
    timestamp: ts,
  });
  //
  let tagsList = [];
  if (reactions.message.reactions != undefined) {
    tagsList = await reactions.message.reactions.map(
      (reaction) => reaction.name
    );
  }
  //
  if (
    (tagsList.length = 0 || !tagsList.includes(tag) || tagsList == undefined)
  ) {
    console.log("add");
    await webClient.reactions.add({
      token: slack_bot_token,
      channel: channel,
      timestamp: ts,
      name: tag,
    });
  } else {
    console.log("remove");
    await webClient.reactions.remove({
      token: slack_bot_token,
      channel: channel,
      timestamp: ts,
      name: tag,
    });
  }
};

app.action("modal-identifier", async ({ ack, body, respond }) => {
  await ack();
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("⚡️ Bolt app is running");
})();
