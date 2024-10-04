import { ObjectId } from "mongoose"
import { UserDatasource } from "../auth/datasource"
import AssetDatasource from "./datasource"
import datasource from "../notifications/datasource"
import agenda from "../../config/agenda"

export const notifyCreator =  async (userId: ObjectId, assetId: string, action: string)=>{

    if(!action) return
    const getCreator = await new AssetDatasource().getCreator(assetId)
    if(!getCreator) return
    const getUser = await new UserDatasource().findById(userId)
    if(!getUser) return
    const creatorSubscribed = await new datasource().isUserSubscribed(getCreator._id)
    if(!creatorSubscribed) return
    const fcmToken = creatorSubscribed?.fcmToken 
    const message = `${getUser.firstName} ${action} your asset`

    agenda.now('new asset interaction notification', {fcmToken, message})


}