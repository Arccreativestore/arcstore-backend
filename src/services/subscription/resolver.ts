import SubscriptionDatasource from './datasource.js';
import { Request, Response } from 'express'
import { isUserAuthorized } from '../../helpers/utils/permissionChecks.js';
import { User } from '../../app.js';
import { IPaymentMethodEnum } from '../../models/purchaseHistory.js';
import { ISubscriptions } from '../../models/subscription.js';
import { IPlanValidation, IUpdatePlanValidation } from './validation.js';


export const SubscriptionMutation = {

    async addSubscription(__: unknown, { data }: { data: any }, context:{req:Request, res:Response, user:User}):Promise<string> {
        isUserAuthorized(context.user, this.addSubscription.name)
        return await new SubscriptionDatasource().addSubscription(data)
    },

    async InitializePayment(__: unknown, {planId, paymentMethod}: { planId:string, paymentMethod:IPaymentMethodEnum }, context:{req:Request, res:Response, user:User}): Promise<{ ref:string, publicKey:string }> {
        isUserAuthorized(context.user, this.InitializePayment.name, true)
        return await new SubscriptionDatasource().InitializePayment(planId, paymentMethod, context.user)
    },

    async addPlan(__: unknown, {data}: { data: IPlanValidation }, context: {
        req: Request,
        res: Response,
        user: User
    }): Promise<string> {
        isUserAuthorized(context.user, this.addPlan.name)
        return await new SubscriptionDatasource().addPlan(data);
    },
    async updatePlan(__: unknown, {data}: { data: IUpdatePlanValidation }, context: {
        req: Request,
        res: Response,
        user: User
    }): Promise<string> {
        isUserAuthorized(context.user, this.updatePlan.name)
        return await new SubscriptionDatasource().updatePlan(data);
    },


};

export const SubscriptionQuery = {

    async getSubscriptionById(_: unknown, {subId}: { subId:string }, context:{req:Request, res:Response, user:User}):Promise<ISubscriptions | null> {
        isUserAuthorized(context.user, this.getSubscriptionById.name)
        return await new SubscriptionDatasource().getSubscriptionById(subId);
    },

    async getAllSubscriptions(__: unknown, _:unknown, context:{req:Request, res:Response, user:User}){
        isUserAuthorized(context.user, this.getAllSubscriptions.name)
        return await new SubscriptionDatasource().getAllSubscriptions();
    },

    async getAllMySubscriptions(__: unknown, _:unknown, context:{req:Request, res:Response, user:User}){
        isUserAuthorized(context.user, this.getAllSubscriptions.name)
        return await new SubscriptionDatasource().getAllMySubscriptions(context.user._id);
    },

    async verifyTransaction(__: unknown, { paymentRef }: { paymentRef:string }, context:{req:Request, res:Response, user:User}):Promise<string> {
        isUserAuthorized(context.user, this.verifyTransaction.name, true)

        return await new SubscriptionDatasource().verifyTransaction(paymentRef, context.user)
    },



    async getPlanById(_: unknown, {planId}: { planId: string }, context: {
        req: Request,
        res: Response,
        user: User
    }): Promise<any> {
        isUserAuthorized(context.user, this.getPlanById.name, true)
        return await new SubscriptionDatasource().getPlanById(planId);
    },

    async getAllPlan(_: unknown, __: unknown, context: {
        req: Request,
        res: Response,
        user: User
    }): Promise<any[]> {
        isUserAuthorized(context.user, this.getAllPlan.name, true)
        return await new SubscriptionDatasource().getAllPlan();
    },
};

