// WayForPay отримує serviceUrl/returnUrl з BASE_URL: без схеми він невалідний,
// WFP не реєструє регулярний платіж і ніколи не стукає на вебхук.
export const normalizeBaseUrl = (value: string | undefined): string =>
  (value ?? "").trim().replace(/\/+$/, "");

export const assertBaseUrl = (): void => {
  const baseUrl = normalizeBaseUrl(process.env.BASE_URL);
  let valid = /^https?:\/\/[^/\s]+$/.test(baseUrl);
  if (valid) {
    try {
      new URL(baseUrl);
    } catch {
      valid = false;
    }
  }
  if (!valid) {
    console.error(
      `🛑 CRITICAL: BASE_URL="${process.env.BASE_URL ?? ""}" невалідний. Потрібен повний абсолютний URL зі схемою (https://домен), без слеша в кінці та шляху. WayForPay serviceUrl/returnUrl зламані.`
    );
    process.exit(1);
  }
  if (!/^https:\/\//.test(baseUrl) && process.env.NODE_ENV === "production") {
    console.error(
      `🛑 CRITICAL: BASE_URL=${baseUrl} без https у production — WayForPay може не прийняти serviceUrl.`
    );
    process.exit(1);
  }
  console.info(`WFP serviceUrl: ${baseUrl}/auth/payment-webhook`);
};
