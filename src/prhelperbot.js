import Bot from "slackbots";
import fs from "fs";
import { getSlackName, getReviewers } from "./helpers";

if (fs.existsSync("./.env")) require("dotenv").config({ path: "./.env" });

const settings = {
  token: process.env.API_TOKEN,
  name: "prhelperbot"
};

export default class PRHelperBot {
  constructor() {
    this.prBot = new Bot(settings);
  }

  start() {
    // this.prBot.postMessageToUser('mike', 'I\'m just getting started')
  }

  sendMessage(
    {
      action,
      prData
    }
  ) {
    if (action === "opened" || action === "reopened") {
      this.prBot.postMessageToGroup(
        "cinebody-platform",
        "",
        openedAttachment(prData)
      );
    } else if (action === "closed") {
      this.prBot.postMessageToGroup(
        "cinebody-platform",
        "",
        closedAttachment(prData)
      );
    }
  }
}

const openedAttachment = prData => {
  const fields = prData.requested_reviewers.length > 0
    ? [
        {
          title: "Reviewers",
          value: getReviewers(prData.requested_reviewers),
          short: true
        }
      ]
    : [];
  return {
    link_names: "1",
    as_user: "true",
    attachments: [
      {
        fallback: `${getSlackName(prData.user.login)} opened a pull request`,
        color: "#00BDF2",
        pretext: "",
        author_name: `${getSlackName(prData.user.login)}`,
        author_link: `https://github.com/${prData.user.login}`,
        author_icon: prData.user.avatar_url,
        title: prData.title,
        title_link: prData.html_url,
        text: prData.body,
        fields: fields
      }
    ]
  };
};

const closedAttachment = prData => {
  const message = prData.merged_by !== null
    ? `${getSlackName(prData.merged_by.login)} merged ${getSlackName(prData.user.login)}'s pull request.`
    : "A pull request was merged.";
  return {
    link_names: "1",
    as_user: "true",
    attachments: [
      {
        fallback: message,
        color: "#6F42C1",
        text: `${message} You rock!`
      }
    ]
  };
};

const warnAttachment = prData => ({
  link_names: "1",
  as_user: "true",
  attachments: [
    {
      fallback: "A pull request is getting stale",
      color: "#E8412F",
      title: "The following pull request has been open for over two hours. Please consider reviewing."
    }
  ]
});
