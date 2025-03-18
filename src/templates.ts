export type TemplateKey = "nuxt3-basic-starter";

export interface Template {
  title: string;
  description: string;
  repo: string;
  key: TemplateKey;
}

export const TEMPLATES: Template[] = [
  {
    title: "Nuxt 3 Basic Starter",
    description: "A basic Nuxt 3 starter template",
    repo: "ersankarimi/nuxt3-basic-starter",
    key: "nuxt3-basic-starter",
  },
];

export function getTemplateByKey(templateKey: TemplateKey) {
  return TEMPLATES.find((item) => {
    return item.key === templateKey;
  });
}
