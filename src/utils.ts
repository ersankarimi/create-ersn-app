import process from "node:process";
import { cancel, confirm, isCancel, outro } from "@clack/prompts";

export async function shouldContinue(nextStep: () => Promise<void>) {
  const shouldContinue = await confirm({
    message: "Do you want to continue?",
  });

  if (shouldContinue) {
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
