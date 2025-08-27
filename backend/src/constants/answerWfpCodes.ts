export const answerWFPCodes = {
  ok: {
    code: 4100,
    message: "Успішне виконання",
  },
  invalid: {
    code: 4101,
    message: "Невірний номер замовлення",
  },
  notFound: {
    code: 4102,
    message: "Не знайдено регулярний платіж за вказаним номером замовлення",
  },
  notAllowed: {
    code: 4103,
    message: "Операцію не дозволено",
  },
  error: {
    code: 4104,
    message: "Помилка перевірки",
  },
  exists: {
    code: 4105,
    message: "Регулярний платіж за вказаним номером замовлення вже існує",
  },
  completed: {
    code: 4106,
    message: "Регулярний платіж завершено",
  },
  closed: {
    code: 4107,
    message: "Регулярний платіж закрито",
  },
};
