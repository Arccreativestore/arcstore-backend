
import SubscriptionDatasource from './datasource.js';
import {IAccount} from "../../models/user.js";
import { Request, Response } from 'express'

import { isUserAuthorized } from '../../helpers/utils/permissionChecks.js';
import { User } from '../../app.js';
import { IPaymentMethodEnum } from '../../models/purchaseHistory.js';
import { ISubscriptions } from '../../models/subscription.js';


export const SubscriptionMutation = {

    async addSubscription(__: unknown, { data }: { data: any }, context:{req:Request, res:Response, user:User}):Promise<string> {
        isUserAuthorized(context.user, this.addSubscription.name)
        return await new SubscriptionDatasource().addSubscription(data)
    },

    async InitializePayment(__: unknown, {assetIds, paymentMethod}: { assetIds:string[], paymentMethod:IPaymentMethodEnum }, context:{req:Request, res:Response, user:User}): Promise<{ ref:string, publicKey:string }> {
        isUserAuthorized(context.user, this.InitializePayment.name, true)
        return await new SubscriptionDatasource().InitializePayment(assetIds, paymentMethod, context.user)
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



};

