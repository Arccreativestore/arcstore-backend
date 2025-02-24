import { google } from 'googleapis';
import { ErrorHandlers } from './errorHandler';
import { GOOGLE_APPLICATION_CREDENTIALS, STRIPE_MERCHANT_ID, STRIPE_SECRET_KEY } from '../config/config';



enum IEnvironment {
  PRODUCTION="PRODUCTION",
  TEST= "TEST"
}
export interface PaymentData {
  apiVersion: number;
  apiVersionMinor: number;
  paymentMethodData: {
    type: 'CARD' | 'TOKENIZED_CARD';
    tokenizationSpecification: {
      type: 'PAYMENT_GATEWAY' | 'DIRECT';
      parameters: {
        gateway: string;
        gatewayMerchantId: string;
        [key: string]: any; 
      };
    };
  };
  transactionInfo: {
    currencyCode: string;
    transactionTotal: string;
    merchantId: string;
    merchantName: string;
    [key: string]: any; 
  };
  [key: string]: any; 
}
console.log({GOOGLE_APPLICATION_CREDENTIALS})
export class GooglePayService {
  private auth: any
  private merchantId: string = STRIPE_MERCHANT_ID;
  private environment:IEnvironment = STRIPE_SECRET_KEY.startsWith('sk_test_') ? IEnvironment.TEST : IEnvironment.PRODUCTION;
  private  serviceAccountKeyFile: string = GOOGLE_APPLICATION_CREDENTIALS

  constructor() {
    this.auth = new google.auth.GoogleAuth({
      keyFile: this.serviceAccountKeyFile,
      scopes: ['https://www.googleapis.com/auth/payments-api'],
    });
    this.merchantId = this.merchantId;
    this.environment = this.environment
  }



  async processPayment(paymentData: PaymentData): Promise<string> {
    try {
   
      const client = await this.auth.getClient();

      const response = await client.request({
        url: `https://payments.googleapis.com/payments/v2/tokens`,
        method: 'POST',
        data: paymentData,
      });

      return response.data.token;
    } catch (error: any) { 
      console.error('Error processing Google Pay payment:', error);
      throw new ErrorHandlers().UserInputError('Error processing payment')
    }
  }

  createPaymentData(
    amount: string,
    currency: string,
    otherData: { [key: string]: any } = {}
  ): PaymentData {
    if (!amount || !currency) {
      throw new ErrorHandlers().UserInputError('Amount and currency are required.');
    }

    const paymentData: PaymentData = {
      apiVersion: 2,
      apiVersionMinor: 0,
      paymentMethodData: {
        type: 'CARD',
        tokenizationSpecification: {
          type: 'PAYMENT_GATEWAY',
          parameters: {
            gateway: 'stripe',
            gatewayMerchantId:this.merchantId,
            ...otherData.gatewayParams || {}, 
          },
        },
      },
      transactionInfo: {
        currencyCode: currency,
        transactionTotal: amount,
        merchantId: this.merchantId,
        merchantName: 'akuh innocent', 
        ...otherData.transactionInfo || {},
      },
      ...otherData.paymentData || {},
    };

    return paymentData;
  }
}
