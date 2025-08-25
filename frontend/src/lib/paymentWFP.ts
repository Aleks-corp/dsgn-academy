import { instance } from "@/lib/api/axios";

interface FormData {
  orderReference: string;
  orderDate: number;
  amount: string;
  currency: string;
  productName: string[];
  productCount: number[];
  productPrice: string[];
  clientAccountId: string;
  clientEmail: string;
  merchantAuthType: string;
  merchantTransactionSecureType: string;
  recurringToken: string;
  regularMode: string;
  regularAmount: string;
  regularBehavior?: string;
  regularOn: number;
  dateNext: string;
  dateEnd: string;
}

interface PaymemtData {
  orderReference: string;
  orderDate: number;
  amount: number;
  regularMode: string;
  clientAccountId: string;
  clientEmail: string;
  dateNext: string;
  dateEnd: string;
}

const nextDate = (currentDate: Date) => {
  const datetime = currentDate.getTime();
  const nextDay =
    new Date(datetime).getDate() > 28 ? 28 : new Date(datetime).getDate();
  const currentMonth =
    new Date(datetime).getMonth() === 11
      ? 0
      : new Date(datetime).getMonth() + 1;
  const nextMonth =
    new Date(datetime).getMonth() === 11
      ? 1
      : new Date(datetime).getMonth() + 2;
  const nextYear =
    new Date(datetime).getMonth() === 11
      ? new Date(datetime).getFullYear() + 1
      : new Date(datetime).getFullYear();
  const nextDate = `${nextDay < 10 ? `0` + nextDay : nextDay}.${
    nextMonth < 10 ? `0` + nextMonth : nextMonth
  }.${nextYear}`;
  const dateEnd = `${nextDay < 10 ? `0` + nextDay : nextDay}.${
    nextMonth < 10 ? `0` + currentMonth : currentMonth
  }.${nextYear + 5}`;
  return { nextDate, dateEnd };
};

const generatePaymentData = async (data: PaymemtData) => {
  const response = await instance.post("/auth/create-payment", data);
  return response.data;
};

export const handleWayForPay = async (
  email: string,
  amount: number,
  duration: "monthly" | "yearly"
) => {
  const currentDate = new Date();
  const form = document.createElement("form");
  form.action = "https://secure.wayforpay.com/pay";
  form.method = "POST";
  form.style.display = "none";

  const data = {
    orderReference: `WFPDA-${currentDate.getTime()}`,
    orderDate: currentDate.getTime(),
    amount,
    regularMode: duration,
    clientAccountId: `${email}`,
    clientEmail: `${email}`,
    dateNext: nextDate(currentDate).nextDate,
    dateEnd: nextDate(currentDate).dateEnd,
  };
  const paymentData = await generatePaymentData(data);

  const wayForPayData: FormData = {
    ...paymentData,
  };

  for (const key in wayForPayData) {
    const typedKey = key as keyof FormData;
    if (Array.isArray(wayForPayData[typedKey])) {
      wayForPayData[typedKey].forEach((value) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = `${key}[]`;
        input.value = value;
        form.appendChild(input);
      });
    } else {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = wayForPayData[typedKey] as string;
      form.appendChild(input);
    }
  }

  document.body.appendChild(form);

  form.submit();
};
