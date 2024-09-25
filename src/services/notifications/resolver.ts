import { addNotificationJob } from "../../agenda/pushNotifications";
import { User } from "../../app";
import { ErrorHandlers } from "../../helpers/errorHandler";
import { isUserAuthorized } from "../../helpers/utils/permissionChecks";
import datasource from "./datasource";
import { vailidatNotiInput } from "./types";


const notificationMutation = {
    async createPushNotification(__: any, {data}: {data: {title: string, message: string}}, context: {user: User}){
        try {
            
            const user = context?.user
            if(!user) throw new ErrorHandlers().AuthenticationError('Please Login to Proceed')
            isUserAuthorized(user, this.createPushNotification.name)
            const { title, message} = data
            if(!title || !message || typeof title != "string" || typeof message != "string") 
                throw new ErrorHandlers().ValidationError("Please enter valid title and body")
            
            const getUserToken = await new datasource().getUserToken()
            const tokenStrings: string[] = getUserToken.map(tokenObj => tokenObj.fcmToken.toString());  

            addNotificationJob(tokenStrings, title, message)
            await new datasource().savePush(title, message, tokenStrings)
            return { status: "success", message: "message forwarded to all recipients"}


        } catch (error) {
            throw error
        }

},

    async getPushNotificationsHistory(__: any, {data}:{ data: {limit?: number, page?: number }}, context: {user: User}){

            try {
                const user = context?.user
                vailidatNotiInput(data)
                isUserAuthorized(user, this.getPushNotificationsHistory.name)
                
                const getPushHistory = await new datasource().getPushHistory(data?.limit, data?.page)
                return getPushHistory

            } catch (error) {
                throw error
            }

    }
}
