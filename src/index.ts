#!/usr/bin/env node

import type { TemplateKey } from "templates";
import { intro, log, outro, select, text } from "@clack/prompts";
import chalk from "chalk";
import { COLORS } from "colors";
import filenamify from "filenamify";
import gradient from "gradient-string";
import { getTemplateByKey, TEMPLATES } from "templates";
import { handleCancel, isStringContainSpaces, shouldContinue } from "utils";
import isValidFilename from "valid-filename";

const state: {
  selectedTemplateKey: TemplateKey | null;
  projectName: string;
} = {
  selectedTemplateKey: null,
  projectName: "my-app",
};

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
    const templateKey = await select({
      message: "Choose what starter template you want to use",
      options: TEMPLATES.map((item) => {
        return {
          value: item.key,
          label: item.title,
          hint: item.description,
        };
      }),
    });

    await handleCancel(templateKey);

    if (typeof templateKey === "symbol") {
      throw new TypeError("You didn't select a Template");
    }
    else {
      state.selectedTemplateKey = templateKey;
      const selectedTemplate = getTemplateByKey(templateKey);
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
    const projectName = await text({
      message: "Project name:",
      initialValue: "",
      defaultValue: "",
      placeholder: state.projectName,
    }).then((value) => {
      return String(value);
    });

    if (!projectName) {
      log.info(`Project name is set to default: ${state.projectName}`);
    }

    if (!isValidFilename(projectName) || isStringContainSpaces(projectName)) {
      const formattedProjectName = isStringContainSpaces(projectName) ? projectName.split(" ").join("-") : filenamify(projectName, { replacement: "-" });

      log.info(`Project name is set to: ${formattedProjectName}`);
      state.projectName = formattedProjectName;
    }
  }
  catch (error) {
    if (error instanceof Error) {
      log.error(error.message);
    }
  }
}

async function main() {
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

  outro(`You're all set!`);
}

main().catch((error) => {
  console.log("annjing", error);
  if (error instanceof Error) {
    console.log("anjingg");
    console.error(error.message);
  }
});
