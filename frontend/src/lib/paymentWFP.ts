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
  regularCount: string;
  dateNext: string;
}

interface PaymemtData {
  orderReference: string;
  orderDate: number;
  amount: number;
  regularMode: string;
  clientAccountId: string;
  clientEmail: string;
  regularCount: string;
  dateNext: string;
}

export function getNextPaymentDate(
  currentDate: Date,
  duration: "monthly" | "yearly"
): string {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const day = currentDate.getDate();
  if (duration === "monthly") {
    const nextDate = new Date(year, month + 1, day);

    const dd = String(nextDate.getDate()).padStart(2, "0");
    const mm = String(nextDate.getMonth() + 1).padStart(2, "0");
    const yyyy = nextDate.getFullYear();

    return `${dd}.${mm}.${yyyy}`;
  } else {
    const nextDate = new Date(year + 1, month, day);
    const dd = String(nextDate.getDate()).padStart(2, "0");
    const mm = String(nextDate.getMonth() + 1).padStart(2, "0");
    const yyyy = nextDate.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
  }
}

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
    dateNext: getNextPaymentDate(currentDate, duration),
    regularCount: duration === "monthly" ? "60" : "5",
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
