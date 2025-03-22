import type { TemplateKey } from "templates";
import fs from "node:fs";
import process from "node:process";
import { cancel, confirm, isCancel, log, outro, select } from "@clack/prompts";
import degit from "degit";
import { getTemplateByKey } from "templates";

export async function shouldContinue(nextStep: () => Promise<void>) {
  const isUserWantToContinue = await confirm({
    message: "Do you want to continue?",
  });

  if (isUserWantToContinue) {
    await nextStep();
  }
  else {
    outro("Goodbye!");
    process.exit(0);
  }
}

export async function handleCancel(proccess: unknown) {
  if (isCancel(proccess)) {
    cancel("Operation cancelled!");
    return process.exit(0);
  }
}

export function isStringContainSpaces(str: string) {
  return /\s/.test(str);
}

export async function cloneGithubRepo(templateKey: TemplateKey, destination: string = ".") {
  try {
    const selectedTemplate = getTemplateByKey(templateKey);

    if (!selectedTemplate) {
      throw new Error("Template not found");
    }

    const githubRepo = selectedTemplate.repo;

    const emitter = degit(githubRepo, {
      cache: false,
      force: true,
      verbose: true,
    });

    await emitter.clone(destination);
  }
  catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      log.error(error.message);
    }
  }
}

export async function handleDestinationNoEmpty(destination: string) {
  try {
    if (!destination) {
      throw new TypeError("Destination is required!");
    }

    const isDirCanUse = await isDestinationEmpty(destination);

    if (isDirCanUse) {
      return;
    }

    const userProcessType = await select({
      message: "Current directory is not empty. Please choose how to proceed:",
      options: [
        {
          label: "Cancel operation",
          value: "cancel",
        },
        {
          label: "Remove existing files and continue",
          value: "remove",
        },
        {
          label: "Ignore files and continue",
          value: "ignore",
          hint: "oh no",
        },
      ],
    });

    await handleCancel(userProcessType);

    if (typeof userProcessType === "symbol") {
      throw new TypeError("You didn't select a process type");
    }
    else if (userProcessType === "cancel") {
      cancel("Operation cancelled!");
      process.exit(0);
    }
    else if (userProcessType === "remove") {
      fs.rmSync(destination, { recursive: true });
    }
    // else if (userProcessType === "ignore") {

    // }
  }
  catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
}

export async function isDestinationEmpty(destination: string) {
  try {
    const isDirExist = fs.existsSync(destination);

    if (isDirExist) {
      const files = fs.readdirSync(destination);
      return !!(isDirExist && !files.length);
    }
    else {
      return true;
    }
  }
  catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
}

export function getPackageManager() {
  const packageManager = {
    npm: "npm",
    yarn: "yarn",
    pnpm: "pnpm",
    bun: "bun",
  };
  const firstNpmConfigUserAgent = process.env.npm_config_user_agent?.split(" ")[0];

  if (!firstNpmConfigUserAgent) {
    return "npm";
  }

  return Object.keys(packageManager).find((key) => {
    const pm = firstNpmConfigUserAgent.split("/")[0];

    return pm === key;
  }) || "npm";
}
