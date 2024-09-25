import gql from "graphql-tag";

const SubscriptionType = gql`
  extend type Query {
    getAllSubscriptions: [ISubResponse]
    getSubscriptionById(subId: ID!): ISubResponse
    verifyTransaction(paymentRef: ID!): String!
    getAllSubscriptions: [ISubResponseFull]
  }

  extend type Mutation {
    addSubscription(data: JSON!): String!
    InitializePayment(
      assetIds: [ID!]!
      paymentMethod: PaymentMethodEnum!
    ): IPaymentResponse
  }

  type IPaymentResponse {
    ref: String
    publicKey: String
  }

  enum ISubTypeEnum {
    premium
    freemium
  }

  enum PaymentMethodEnum {
    paystack
    googlepay
  }

  type ISubResponse {
    _id: ID
    userId: ID
    amountPaid: String
    paymentMethod: ISubTypeEnum
    assets: JSON
    status: IPaymentStatusEnum
    purchaseDate: DateTime
    createdAt: DateTime
    updatedAt: DateTime
  }
  enum IPaymentStatusEnum {
    pending
    success
    reversal
    failure
    fraud
  }
  type ISubResponseFull {
    _id: ID
    userId: ID
    amountPaid: String
    paymentMethod: ISubTypeEnum
    endDate: DateTime
    assets: JSON
    status: IPaymentStatusEnum
    purchaseDate: DateTime
    createdAt: DateTime
    updatedAt: DateTime
  }
`;

export default SubscriptionType;
