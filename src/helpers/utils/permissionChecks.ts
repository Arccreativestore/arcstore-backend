import {  UnauthorizedError } from "../../api/errorClass";
import { User } from "../../app";
import { IAccount } from "../../models/user";

export const isUserAuthorized = (user:User, method:string, global?:boolean )=>{

	if(!user) throw new UnauthorizedError("Invalid or expired session, kindly login.")

    //ROOT Admin
    if(user.role === "SUPERADMIN") return true

	//LoggedIn user accessing global route
	if(user.role && global) return true

	//Restricted resources
	if(!global && !user?.permissions?.includes(method)) throw new UnauthorizedError("You don't have access to this resources");

	return true
}