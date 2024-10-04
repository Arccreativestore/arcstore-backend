import gql from "graphql-tag";

const SubscriptionType = gql`
  extend type Query {
    getAllSubscriptions: [ISubResponse]
    getSubscriptionById(subId: ID!): ISubResponse
    verifyTransaction(paymentRef: ID!): String!
    getAllMySubscriptions: [ISubResponse]
    getAllPlan:[IPlanResponse]
    getPlanById(planId:ID!):IPlanResponse
  }

  extend type Mutation {
    addSubscription(data: JSON!): String!
    InitializePayment(planId:ID! paymentMethod: PaymentMethodEnum!): IPaymentResponse
    addPlan(data: IPlanInput!): String!
    updatePlan(data:IUpdatePlanInput):String!
  }



      input IPlanInput{
        amount:Float!
        discount: Float!
        unit: UnitEnum!
        duration: Int!
    }

       enum UnitEnum {
        month
        year
    }
    input IUpdatePlanInput{
        planId:ID!
        amount:Float
        discount: Float
        unit: UnitEnum
        duration: Int
    }


    type IPlanResponse{
        _id:ID!
        amount: Float
        discount: Float
        unit: UnitEnum
        duration: Int
        disable:Boolean
        createdAt:DateTime
        updatedAt:DateTime
    }


    enum ProcessingMediaStatus {
    pending
    processed
    queued
    processing
    failed 
    canceled
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
