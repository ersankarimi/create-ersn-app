export interface Template {
  title: string;
  description: string;
  repo: string;
  key: string;
  templates?: Template[];
}

export const TEMPLATES: Template[] = [
  {
    title: "Nuxt 3 Basic Starter",
    description: "A basic Nuxt 3 starter template",
    repo: "ersankarimi/nuxt3-basic-starter",
    key: "nuxt3-basic-starter",
  },
  {
    title: "Nuxt + UI Starter",
    description: "A collection of Nuxt starter templates using different versions of Nuxt UI",
    repo: "ersankarimi/nuxt-ui-starter",
    key: "nuxt-ui-starter",
    templates: [
      {
        title: "Nuxt 3 + UI 2",
        description: "A minimal Nuxt 3 starter template using Nuxt UI v2",
        repo: "ersankarimi/nuxt-ui-starter#nuxt3-ui2",
        key: "nuxt3-ui2",
      },
      {
        title: "Nuxt 3 + UI 3",
        description: "A minimal Nuxt 3 starter template using Nuxt UI v3",
        repo: "ersankarimi/nuxt-ui-starter#nuxt3-ui3",
        key: "nuxt3-ui3",
      },
      {
        title: "Nuxt 4 + UI 3",
        description: "A minimal Nuxt 4 starter template using Nuxt UI v3",
        repo: "ersankarimi/nuxt-ui-starter#nuxt4-ui3",
        key: "nuxt4-ui3",
      },
    ],
  },
];

export function getTemplateByKey(templateKey: string, parentTemplateKey?: string) {
  if (!templateKey) {
    throw new TypeError("Template key is required");
  }

  if (!parentTemplateKey) {
    return TEMPLATES.find((item) => {
      return item.key === templateKey;
    });
  }

  const selectedParentTemplate = TEMPLATES.find((item) => {
    return item.key === parentTemplateKey;
  });

  if (!selectedParentTemplate?.templates) {
    throw new Error("This template doesn't have any sub-template!");
  }

  return selectedParentTemplate.templates.find((item) => {
    return item.key === templateKey;
  });
}

export function isParentTemplateKey(templateKey: string) {
  const selectedTemplate = getTemplateByKey(templateKey);

  if (!selectedTemplate) {
    throw new Error("Template not found");
  }

  return !!selectedTemplate.templates && selectedTemplate.templates.length > 0;
}

export function getTemplateOptions(parentTemplateKey?: string) {
  if (!parentTemplateKey) {
    return TEMPLATES.map(({ key, title, description }) => {
      return {
        value: key,
        label: title,
        hint: description,
      };
    });
  }

  const selectedTemplate = getTemplateByKey(parentTemplateKey);

  if (!selectedTemplate || !selectedTemplate.templates) {
    throw new Error("Selected template does not have sub-templates");
  }

  return selectedTemplate.templates.map(({ key, title, description }) => {
    return {
      value: key,
      label: title,
      hint: description,
    };
  });
}
