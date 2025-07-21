export interface PaymentData {
  orderReference: string;
  orderDate: number;
  clientAccountId: string;
  clientEmail: string;
  dateNext: string;
  dateEnd: string;
}

export interface ResponseData {
  orderReference: string;
  status: string;
  time: number;
  signature: string;
}

export interface RequestData {
  orderReference: string;
  transactionStatus: string;
  phone: string;
  regularDateEnd: string;
}
