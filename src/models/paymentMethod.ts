import { Document, Model, model, ObjectId, Schema } from 'mongoose';

export enum PaymentMethodEnum {
    PayPal = 'paypal',
    BankTransfer = 'bank_transfer',
    PayStack = 'paystack',
    GooglePay = 'googlepay'
}

export interface IPaymentMethod extends Document {
    userId: ObjectId;
    method: PaymentMethodEnum;
    details: Record<string, any>;
    isActive: boolean;
}

interface IPaymentMethodModel extends Model<IPaymentMethod> {}

const PaymentMethodSchema = new Schema<IPaymentMethod>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
        index: true,
    },
    method: {
        type: String,
        enum: Object.values(PaymentMethodEnum),
        required: true,
    },
    details: {
        type: Schema.Types.Mixed,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true,
    versionKey: false,
});

const PaymentMethodModel = (isTest: boolean = false) => {
    if (isTest === undefined || isTest === null) throw new Error('Invalid environment');
    const collectionName = isTest ? 'test_payment_methods' : 'payment_methods';
    return model<IPaymentMethod, IPaymentMethodModel>(collectionName, PaymentMethodSchema, collectionName);
};

export default PaymentMethodModel;
