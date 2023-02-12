module.exports.getHome = async function (options, modalType) {
  let blocks = [
		{
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": "Choisir une option",
				"emoji": true
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Section block with radio buttons"
			},
			"accessory": {
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
			}
		},
    {
			"type": "divider"
		},
    {
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": "Multiselect",
				"emoji": true
			}
		},
		{
			"type": "image",
			"title": {
				"type": "plain_text",
				"text": " ",
				"emoji": true
			},
			"image_url": "https://zupimages.net/up/22/51/acwp.png",
			"alt_text": "multiselect"
		},
    {
			"type": "image",
			"title": {
				"type": "plain_text",
				"text": " ",
				"emoji": true
			},
			"image_url": "https://zupimages.net/up/22/51/mz5o.png",
			"alt_text": "Multiselect"
		},
		{
			"type": "divider"
		},
    {
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": "Checkboxes",
				"emoji": true
			}
		},
		{
			"type": "image",
			"title": {
				"type": "plain_text",
				"text": " ",
				"emoji": true
			},
			"image_url": "https://zupimages.net/up/22/51/h7v1.png",
			"alt_text": "Checkbox"
		},
    {
			"type": "divider"
		},
    {
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": "Buttons",
				"emoji": true
			}
		},
		{
			"type": "image",
			"title": {
				"type": "plain_text",
				"text": " ",
				"emoji": true
			},
			"image_url": "https://zupimages.net/up/22/51/p7po.png",
			"alt_text": "Buttons"
		},
	];
  //-----------------------------
  return blocks;
};
