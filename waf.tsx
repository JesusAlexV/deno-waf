// @ts-nocheck

interface WafParameter {
  name: string;
  disallowTags?: boolean;
}

interface WafConfig {
  parameters?: WafParameter[];
}

const getParam = (url, param) => {
  const { searchParams: query } = new URL(url);
  return query.get(param);
}

const waf: Function = (config: WafConfig) => async (ctx: any, next: any): Promise<void> => {
  // Validate parameters
  if (!config.parameters) {
    config.parameters = [];
  }
  for (const parameter of config.parameters) {
    let paramValue = getParam(ctx.request.url, parameter.name);
    if (paramValue) {
        paramValue = paramValue.toLowerCase();
      if (parameter.disallowTags) {
        if (paramValue.includes('<')) {
          ctx.response.body = 'Web Application Firewall: Your name cannot contain HTML tags';
          return;
        }
      }
    }
  }
  await next();
}

export default waf;
