module.exports.getModalBlockOptions = async function (
  body,
  options,
  modalType
) {
  let modalBlock = {
    trigger_id: body.trigger_id,
    dispatch_action: true,
    view: {
      type: "modal",
      callback_id: "modal-identifier",
      title: {
        type: "plain_text",
        text: "Options",
      },
      //-----------------------------
      blocks: [
        {
          type: "section",
          block_id: "radio_buttons-group",
          text: {
            type: "mrkdwn",
            text: "Choisir une options",
          },

          accessory: {
            type: "radio_buttons",
            action_id: "radio_buttons_action_id",
            options: options.map((option) => {
              return {
                text: { type: "plain_text", text: option, emoji: true },
                value: option,
              };
            }),
            initial_option: {
              text: { type: "plain_text", text: modalType, emoji: true },
              value: modalType,
            },
            action_id: "radio-buttons-action",
          },
        }
      ],
      //-----------------------------
    },
  };
  return  modalBlock ;
};
