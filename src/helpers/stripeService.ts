import __Subscription from "../models/subscription.js";
import __Payment, { transactionStatus } from "../models/payments.js";
import Base from '../base.js';
import Stripe from 'stripe';

class TeamSubscriptionService {
    private stripe: Stripe;
    private stripeKey: string;


    constructor(stripeKey: string) {
        this.stripeKey = stripeKey;
        this.stripe = new Stripe(this.stripeKey, { apiVersion: "2025-01-27.acacia" });
    }

    /** ✅ Process Stripe Webhook */
    async processWebhook(payload: { event: string, data: any }): Promise<void> {
        const reference = payload.data.id;

        switch (payload.event) {
            case 'charge.success':
                return this.processData(payload.data);
            case 'charge.failed':
                await __Payment().updateOne({ _id: reference }, { $set: { status: transactionStatus.failure } });
                break;
            case 'invoice.payment_succeeded':  // ✅ Subscription Renewed
                await this.renewSubscription(payload.data);
                break;
            case 'invoice.payment_failed': // ❌ Subscription Payment Failed
                await this.handleFailedPayment(payload.data);
                break;
            case 'customer.subscription.deleted': // 🚫 Subscription Canceled
                await this.cancelSubscriptionInDB(payload.data);
                break;
            case 'invoice.upcoming': // 🔔 Notify user of upcoming renewal
                await this.notifyUpcomingSubscription(payload.data);
                break;
            default:
                console.log("⚠️ Unable to process webhook");
                break;
        }
    }

    /** ✅ Create Subscription (Dynamic Team Size) */
    async createSubscriptionOrOneTimePayment(email: string, paymentMethodId: string, planId:string,  pricePerMember:number, currency:string, teamSize: number=1,isOneTime:boolean=true) {
        try {


            console.log({
                email,
                limit: 1,
              })
      
              let customer:any =  await this.stripe.customers.list({
                email,
                limit: 1,
              });
      
              console.log({customer})
              if (customer.data.length === 0) {
                customer = await this.stripe.customers.create({
                    payment_method: paymentMethodId,
                    invoice_settings: { default_payment_method: paymentMethodId },
                    metadata: { email , planId}
                });
    
              } else {
                customer = customer.data[0];
              }
      
    
            console.log({customer})

            if (isOneTime) {
                const paymentIntent = await this.stripe.paymentIntents.create({
                    customer: customer.id,
                    amount: pricePerMember * teamSize, 
                    currency,
                    payment_method: paymentMethodId,
                    confirm: true, 
                    metadata: { email, planId }
                });
    
                return paymentIntent;
            }else{
            const subscription = await this.stripe.subscriptions.create({
                customer: customer.id,
                items: [{
                    price_data: {
                        currency,
                        unit_amount: pricePerMember, 
                        recurring: { interval: "month" },
                        product:"Team Subscription"  
                    },
                    quantity: teamSize
                }],
                expand: ["latest_invoice.payment_intent"],
                metadata: { email, planId }
            });

            return subscription;
        }
        } catch (error) {
            console.error("❌ Error creating subscription:", error);
            throw new Error("Failed to create subscription");
        }
    }

    /** ✅ Update Subscription (Change Team Size) */
    async updateSubscription(subscriptionId: string, newTeamSize: number) {
        try {
            const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
            if (!subscription) throw new Error("Subscription not found");

            const updatedSubscription = await this.stripe.subscriptions.update(subscriptionId, {
                items: [{ id: subscription.items.data[0].id, quantity: newTeamSize }],
                metadata: { teamSize: newTeamSize }
            });

            console.log(`✅ Subscription updated for ${newTeamSize} members`);
            return updatedSubscription;
        } catch (error) {
            console.error("❌ Error updating subscription:", error);
            throw new Error("Failed to update subscription");
        }
    }

    /** 🚫 Cancel Subscription */
    async cancelSubscription(subscriptionId: string) {
        try {
            await this.stripe.subscriptions.update(subscriptionId, {
                cancel_at_period_end: true
            });

            console.log("🚫 Subscription set to cancel at period end.");
        } catch (error) {
            console.error("❌ Error canceling subscription:", error);
            throw new Error("Failed to cancel subscription");
        }
    }

    /** 🔄 Renew Subscription */
    async renewSubscription(invoice: any) {
        const subscriptionId = invoice.subscription;

        try {
            await __Subscription().updateOne(
                { stripeSubscriptionId: subscriptionId },
                { $set: { status: "active", updatedAt: new Date() } }
            );

            console.log(`🔄 Subscription ${subscriptionId} renewed successfully.`);
        } catch (error) {
            console.error("❌ Error renewing subscription:", error);
        }
    }

    /** ❌ Handle Failed Subscription Payment */
    async handleFailedPayment(invoice: any) {
        const subscriptionId = invoice.subscription;
        
        try {
            await __Subscription().updateOne(
                { stripeSubscriptionId: subscriptionId },
                { $set: { status: "past_due", updatedAt: new Date() } }
            );

            console.log(`❌ Subscription ${subscriptionId} payment failed.`);
        } catch (error) {
            console.error("❌ Error handling failed payment:", error);
        }
    }

    /** 🚫 Remove Canceled Subscription from DB */
    async cancelSubscriptionInDB(subscription: any) {
        const subscriptionId = subscription.id;
        
        try {
            await __Subscription().deleteOne({ stripeSubscriptionId: subscriptionId });

            console.log(`🚫 Subscription ${subscriptionId} removed from DB.`);
        } catch (error) {
            console.error("❌ Error deleting subscription from DB:", error);
        }
    }

    /** 🔔 Notify User of Upcoming Subscription Charge */
    async notifyUpcomingSubscription(invoice: any) {
        const userId = invoice.customer;
        const amountDue = invoice.amount_due / 100;

        console.log(`🔔 User ${userId} has an upcoming charge of $${amountDue}.`);
        // Here, integrate your email/SMS notification service
    }

    /** ✅ Process Payment and Activate Subscription */
    async processData(data: Record<string, any>) {
        const isTransaction = await __Payment().findById(data.reference);
        if (!isTransaction) {
            console.log(JSON.stringify(data, null, 2), "❌ Error processing payment");
            return;
        }

        const formattedPayload: Record<string, any> = {
            userId: isTransaction.userId,
            paymentId: isTransaction._id,
            amount: isTransaction.amountPaid,
            type: isTransaction.paymentMethod,
            expiresAt: isTransaction.expiresAt,
            stripeSubscriptionId: data.subscription || null
        };

        if (isTransaction.teamMembers) {
            formattedPayload.teamMembers = isTransaction.teamMembers;
        }

        try {
            await new Base().handleMongoError(__Subscription().create(formattedPayload));
            isTransaction.status = transactionStatus.success;
            await isTransaction.save();
        } catch (error) {
            console.error("❌ Error processing subscription:", error);
        }
    }
}

export default TeamSubscriptionService;
