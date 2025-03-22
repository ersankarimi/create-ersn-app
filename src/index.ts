#!/usr/bin/env node

import type { TemplateKey } from "templates";
import path from "node:path";
import process from "node:process";
import { intro, log, outro, select, spinner, text } from "@clack/prompts";
import chalk from "chalk";
import { COLORS } from "colors";
import filenamify from "filenamify";
import gradient from "gradient-string";
import { getTemplateByKey, TEMPLATES } from "templates";
import { cloneGithubRepo, getPackageManager, handleCancel, handleDestinationNoEmpty, isStringContainSpaces, shouldContinue } from "utils";
import isValidFilename from "valid-filename";

const state: {
  selectedTemplateKey: TemplateKey | null;
  projectName: string;
} = {
  selectedTemplateKey: null,
  projectName: "my-app",
};

const currentWorkingDir = process.cwd();

const banner = gradient([
  {
    color: COLORS.purple,
    pos: 0,
  },
  {
    color: COLORS.pink,
    pos: 0.6,
  },
  {
    color: COLORS.cyan,
    pos: 0.8,
  },
]).multiline(
  [
    "   ____ ____  _____    _  _____ _____   _____ ____  ____  _   _      _    ____  ____",
    "  / ___|  _ \\| ____|  / \\|_   _| ____| | ____|  _ \\/ ___|| \\ | |    / \\  |  _ \\|  _ \\",
    " | |   | |_) |  _|   / _ \\ | | |  _|   |  _| | |_) \\___ \\|  \\| |   / _ \\ | |_) | |_) |",
    " | |___|  _ <| |___ / ___ \\| | | |___  | |___|  _ < ___) | |\\  |  / ___ \\|  __/|  __/",
    "  \\____|_| \\_\\_____/_/   \\_\\_| |_____| |_____|_| \\_\\____/|_| \\_| /_/   \\_\\_|   |_|",
  ].join("\n"),
);

async function selectingTemplateKey() {
  try {
    const userTemplateKey = await select({
      message: "Choose what starter template you want to use",
      options: TEMPLATES.map((item) => {
        return {
          value: item.key,
          label: item.title,
          hint: item.description,
        };
      }),
    });

    await handleCancel(userTemplateKey);

    if (typeof userTemplateKey === "symbol") {
      throw new TypeError("You didn't select a Template");
    }
    else {
      state.selectedTemplateKey = userTemplateKey;
      const selectedTemplate = getTemplateByKey(userTemplateKey);
      log.info(
        `Selected starter template: ${selectedTemplate?.title}`,
      );
    }
  }
  catch (error) {
    if (error instanceof Error) {
      log.error(error.message);
      await shouldContinue(selectingTemplateKey);
    }
  }
}

async function setProjectName() {
  try {
    const userProjectName = await text({
      message: "Project name:",
      initialValue: "",
      defaultValue: "",
      placeholder: state.projectName,
    });

    await handleCancel(userProjectName);

    if (typeof userProjectName === "symbol") {
      throw new TypeError("You didn't set a project name");
    }

    if (!userProjectName) {
      log.info(`Project name is set to default: ${state.projectName}`);
    }
    else if (userProjectName !== "." && (!isValidFilename(userProjectName) || isStringContainSpaces(userProjectName))) {
      const formattedProjectName = isStringContainSpaces(userProjectName) ? userProjectName.split(" ").join("-") : filenamify(userProjectName, { replacement: "-" });

      log.info(`Project name is set to: ${formattedProjectName}`);
      state.projectName = formattedProjectName;
    }
    else if (userProjectName === ".") {
      const projectName = currentWorkingDir.split("/").pop() || "";
      state.projectName = projectName || state.projectName;
      log.info(`Project name is set to current working dir: ${projectName}`);
    }
    else {
      state.projectName = userProjectName;
      log.info(`Project name: ${userProjectName}`);
    }
  }
  catch (error) {
    if (error instanceof Error) {
      log.error(error.message);
      await shouldContinue(setProjectName);
    }
  }
}

async function downloadTheTemplate() {
  const s = spinner();

  if (!state.selectedTemplateKey) {
    throw new TypeError("There is no selected template key!");
  }

  try {
    const fullDestination = path.join(
      process.cwd(),
      state.projectName,
    );

    await handleDestinationNoEmpty(fullDestination);

    s.start("Downloading the template ....");

    await cloneGithubRepo(state.selectedTemplateKey, fullDestination);

    s.stop(
      "✅ Successfully downloaded the template",
    );
  }
  catch (error) {
    if (error instanceof Error) {
      s.stop(
        "❌ Failed to download template",
      );
      log.error(error.message);
      outro(
        "Failed to download the template. Please try again.",
      );
    }
  }
}

async function main() {
  try {
    console.clear();
    console.log(banner);
    console.log();

    intro(
      chalk.bold(
        gradient([COLORS.purple, COLORS.pink])("Welcome to create-ersn-app!"),
      ),
    );

    await selectingTemplateKey();
    await setProjectName();

    if (state.projectName && state.selectedTemplateKey) {
      await downloadTheTemplate();
    }
  }
  catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
  finally {
    outro("Done, now run:");

    console.log(`
  ${chalk.bold("cd")} ${state.projectName}
  ${chalk.bold(`${getPackageManager()} install`)}`);

    process.exit(0);
  }
}

main().catch((error) => {
  if (error instanceof Error) {
    console.error(error.message);
    log.error(error.message);
  }
  else {
    log.error("Something went wrong!");
  }
});
